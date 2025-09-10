describe('Страница Конструктор', () => {
	beforeEach(() => {
		// Загрузка главной страницы
		cy.visit('/');
		// Дождаться загрузки ингредиентов (например, булки)
		cy.contains('Булки').should('be.visible');
		// Проверить, что область конструктора пуста
		cy.contains('Перетащите ингредиенты сюда');
	});

	it('Позволяет перетащить ингредиенты, собрать заказ и отобразить модальное окно заказа', () => {
		// КАСТОМНО! Найдите реальный селектор для ингредиента из вашей разметки!
		// Пример: берем первый ингредиент из секции "Булки"
		cy.get('[data-testid="ingredient_card"]')
			.contains('булка', { matchCase: false })
			.parents('[data-testid="ingredient_card"]')
			.first()
			.as('bun');
		cy.get('[data-testid="ingredient_card"]')
			.contains('соус', { matchCase: false })
			.parents('[data-testid="ingredient_card"]')
			.first()
			.as('sauce');
		cy.get('[data-testid="ingredient_card"]')
			.contains('метеорит', { matchCase: false })
			.parents('[data-testid="ingredient_card"]')
			.first()
			.as('filling');

		// Перетащить булку в конструктор (наверх)
		cy.get('@bun').scrollIntoView();
		cy.get('@bun').trigger('dragstart');
		cy.get('[data-testid="constructor_drop_zone"]').trigger('drop');
		// Проверить, что булка добавилась
		cy.get('.constructor-element').contains('(верх)').should('exist');
		cy.get('.constructor-element').contains('(низ)').should('exist');

		// Перетащить начинку
		cy.get('@filling').trigger('dragstart');
		cy.get('[data-testid="constructor_drop_zone"]').trigger('drop');
		// Проверить, что в конструкторе появилась начинка (по имени)
		cy.get('.constructor-element')
			.contains(/метеорит/i)
			.should('exist');

		// Перетащить соус
		cy.get('@sauce').trigger('dragstart');
		cy.get('[data-testid="constructor_drop_zone"]').trigger('drop');
		// По имени
		cy.get('.constructor-element').contains(/соус/i).should('exist');

		// Проверить, что кнопка оформления активна
		cy.contains('Войти для оформления').should('be.enabled').click();

		// При необходимости залогиниться
		cy.url().then((url) => {
			if (url.includes('/login')) {
				cy.get('input[name="email"]').type('testuser@example.com');
				cy.get('input[name="password"]').type('password123');
				cy.get('button[type="submit"]').click();
			}
		});

		// Ожидаем индикатор загрузки заказа
		cy.contains(/Оформляем заказ/i, {
			timeout: 5000,
		}).should('be.visible');

		// Проверка, что order modal отрендерён
		// Ждём появления модального окна с номером заказа
		cy.get('[data-testid="order-details"]', { timeout: 25000 }).within(() => {
			cy.contains(/\d{5,}/, { timeout: 15000 }).should('be.visible'); // номер заказа
		});

		// Проверить, что модалка закрывается по кнопке или иконке
		cy.get(
			'[class*="modal"] button,[class*="modal"] svg,[class*="modal"] [aria-label*="закрыть" i]'
		)
			.first()
			.click({ force: true });

		// Модалка закрыта
		cy.get('[class*="modal"]').should('not.exist');
	});
});
