export const DND_TYPES = {
	INGREDIENT: 'ingredient',
	CONSTRUCTOR_INGREDIENT: 'constructor_ingredient',
} as const;

export type TDndType = (typeof DND_TYPES)[keyof typeof DND_TYPES];
