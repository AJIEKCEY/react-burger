// Типы для WebSocket Manager
export interface WebSocketError {
	message: string;
	code?: number;
	type?: string;
	target?: WebSocket;
}

export interface WebSocketCloseEvent {
	code: number;
	reason: string;
	wasClean: boolean;
	target: WebSocket;
}

export interface WebSocketMessageData {
	success: boolean;
	[key: string]: unknown;
}

export interface WebSocketCallbacks<T = WebSocketMessageData> {
	onMessage: (data: T) => void;
	onOpen?: () => void;
	onError?: (error: WebSocketError) => void;
	onClose?: (event: WebSocketCloseEvent) => void;
}

export type WebSocketConnectionState =
	| 'connecting'
	| 'connected'
	| 'closing'
	| 'disconnected'
	| 'unknown';

export interface ReconnectionConfig {
	maxAttempts: number;
	delay: number;
	shouldReconnect: (closeEvent: WebSocketCloseEvent) => boolean;
}

class WebSocketManager {
	private static instance: WebSocketManager;
	private connections: Map<string, WebSocket> = new Map();
	private subscribers: Map<string, Set<(data: WebSocketMessageData) => void>> =
		new Map();
	private reconnectAttempts: Map<string, number> = new Map();
	private reconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();
	private maxReconnectAttempts = 5;
	private reconnectDelay = 3000;

	static getInstance(): WebSocketManager {
		if (!WebSocketManager.instance) {
			WebSocketManager.instance = new WebSocketManager();
		}
		return WebSocketManager.instance;
	}

	connect<T extends WebSocketMessageData = WebSocketMessageData>(
		url: string,
		onMessage: (data: T) => void,
		onOpen?: () => void,
		onError?: (error: WebSocketError) => void
	): void {
		console.log('WebSocket Manager: connect called for', url);

		// Типизированный колбэк для сообщений
		const typedOnMessage = onMessage as (data: WebSocketMessageData) => void;

		// Добавляем подписчика
		const subscribers = this.subscribers.get(url) || new Set();
		subscribers.add(typedOnMessage);
		this.subscribers.set(url, subscribers);

		// Если уже есть активное соединение
		const existingSocket = this.connections.get(url);
		if (existingSocket && existingSocket.readyState === WebSocket.OPEN) {
			console.log('Using existing connection');
			if (onOpen) onOpen();
			return;
		}

		// Если соединение в процессе установки
		if (existingSocket && existingSocket.readyState === WebSocket.CONNECTING) {
			console.log('Connection already in progress');
			return;
		}

		// Создаем новое соединение
		this.createConnection(url, onOpen, onError);
	}

	private createConnection(
		url: string,
		onOpen?: () => void,
		onError?: (error: WebSocketError) => void
	): void {
		console.log('Creating new WebSocket connection to:', url);

		try {
			const socket = new WebSocket(url);
			this.connections.set(url, socket);

			socket.onopen = () => {
				console.log('WebSocket connected to:', url);
				this.reconnectAttempts.set(url, 0); // Сбрасываем счетчик попыток
				this.clearReconnectTimeout(url);
				if (onOpen) onOpen();
			};

			socket.onerror = (event: Event) => {
				console.error('WebSocket error for:', url, event);
				const error: WebSocketError = {
					message: 'WebSocket connection error',
					type: event.type,
					target: event.target as WebSocket,
				};
				if (onError) onError(error);
			};

			socket.onmessage = (event: MessageEvent<string>) => {
				try {
					const data: WebSocketMessageData = JSON.parse(event.data);
					const subscribers = this.subscribers.get(url);
					if (subscribers) {
						subscribers.forEach((callback) => callback(data));
					}
				} catch (error) {
					console.error('Error parsing WebSocket message:', error);
					const parseError: WebSocketError = {
						message:
							error instanceof Error
								? error.message
								: 'Failed to parse message',
						type: 'parse_error',
					};
					if (onError) onError(parseError);
				}
			};

			socket.onclose = (event: CloseEvent) => {
				console.log(
					'WebSocket closed for:',
					url,
					'code:',
					event.code,
					'wasClean:',
					event.wasClean
				);
				this.connections.delete(url);

				const closeEvent: WebSocketCloseEvent = {
					code: event.code,
					reason: event.reason,
					wasClean: event.wasClean,
					target: event.target as WebSocket,
				};

				// Автоматическое переподключение только если есть подписчики и закрытие не было чистым
				this.handleReconnection(url, closeEvent);
			};
		} catch (error) {
			console.error('Failed to create WebSocket:', error);
			const createError: WebSocketError = {
				message:
					error instanceof Error
						? error.message
						: 'Failed to create WebSocket connection',
			};
			if (onError) onError(createError);
		}
	}

	private handleReconnection(
		url: string,
		closeEvent: WebSocketCloseEvent
	): void {
		const subscribers = this.subscribers.get(url);
		const attempts = this.reconnectAttempts.get(url) || 0;

		const shouldReconnect =
			subscribers &&
			subscribers.size > 0 &&
			!closeEvent.wasClean &&
			closeEvent.code !== 1000 &&
			attempts < this.maxReconnectAttempts;

		if (shouldReconnect) {
			this.reconnectAttempts.set(url, attempts + 1);
			console.log(
				`Attempting reconnect ${attempts + 1}/${this.maxReconnectAttempts} in ${this.reconnectDelay}ms`
			);

			const timeoutId = setTimeout(() => {
				const currentSubscribers = this.subscribers.get(url);
				if (currentSubscribers && currentSubscribers.size > 0) {
					this.createConnection(url);
				}
			}, this.reconnectDelay);

			this.reconnectTimeouts.set(url, timeoutId);
		}
	}

	private clearReconnectTimeout(url: string): void {
		const timeoutId = this.reconnectTimeouts.get(url);
		if (timeoutId) {
			clearTimeout(timeoutId);
			this.reconnectTimeouts.delete(url);
		}
	}

	disconnect(
		url: string,
		onMessage?: (data: WebSocketMessageData) => void
	): void {
		console.log(
			'Disconnect called for:',
			url,
			'specific callback:',
			!!onMessage
		);

		if (onMessage) {
			// Удаляем конкретного подписчика
			const subscribers = this.subscribers.get(url);
			if (subscribers) {
				subscribers.delete(onMessage);
				console.log('Remaining subscribers:', subscribers.size);

				// Если подписчиков больше нет, закрываем соединение
				if (subscribers.size === 0) {
					console.log('No subscribers left, closing connection');
					this.closeConnection(url);
				}
			}
		} else {
			// Закрываем все соединение
			this.closeConnection(url);
		}
	}

	private closeConnection(url: string): void {
		// Очищаем таймер переподключения
		this.clearReconnectTimeout(url);

		const socket = this.connections.get(url);
		if (socket) {
			console.log('Closing WebSocket connection to:', url);
			// Используем код 1000 для нормального закрытия
			socket.close(1000, 'Normal closure');
		}

		this.connections.delete(url);
		this.subscribers.delete(url);
		this.reconnectAttempts.delete(url);
	}

	// Принудительное переподключение
	reconnect(url: string): void {
		console.log('Manual reconnect for:', url);

		// Сохраняем подписчиков перед закрытием
		const subscribers = this.subscribers.get(url);

		this.closeConnection(url);

		// Небольшая задержка перед переподключением
		setTimeout(() => {
			if (subscribers && subscribers.size > 0) {
				// Восстанавливаем подписчиков
				this.subscribers.set(url, subscribers);
				this.createConnection(url);
			}
		}, 100);
	}

	getConnectionState(url: string): WebSocketConnectionState {
		const socket = this.connections.get(url);
		if (!socket) return 'disconnected';

		switch (socket.readyState) {
			case WebSocket.CONNECTING:
				return 'connecting';
			case WebSocket.OPEN:
				return 'connected';
			case WebSocket.CLOSING:
				return 'closing';
			case WebSocket.CLOSED:
				return 'disconnected';
			default:
				return 'unknown';
		}
	}

	getSubscribersCount(url: string): number {
		return this.subscribers.get(url)?.size || 0;
	}

	// Метод для настройки параметров переподключения
	setReconnectionConfig(config: Partial<ReconnectionConfig>): void {
		if (config.maxAttempts !== undefined) {
			this.maxReconnectAttempts = config.maxAttempts;
		}
		if (config.delay !== undefined) {
			this.reconnectDelay = config.delay;
		}
	}

	// Метод для получения информации о состоянии соединения
	getConnectionInfo(url: string): {
		state: WebSocketConnectionState;
		subscribersCount: number;
		reconnectAttempts: number;
	} {
		return {
			state: this.getConnectionState(url),
			subscribersCount: this.getSubscribersCount(url),
			reconnectAttempts: this.reconnectAttempts.get(url) || 0,
		};
	}

	// Метод для очистки всех соединений (полезно при размонтировании приложения)
	disconnectAll(): void {
		console.log('Disconnecting all WebSocket connections');

		for (const url of this.connections.keys()) {
			this.closeConnection(url);
		}
	}
}

export const wsManager = WebSocketManager.getInstance();
