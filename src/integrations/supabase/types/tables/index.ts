import type { TablesBase } from './base';
import type { MealPlansTable } from './meal-plans';
import type { ProfilesTable } from './profiles';
import type { RecipesTable } from './recipes';

export type Tables = TablesBase & MealPlansTable & ProfilesTable & RecipesTable;

export type TablesInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TablesUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TablesRow<T extends keyof Tables> = Tables[T]['Row'];

export * from './base';
export * from './meal-plans';
export * from './profiles';
export * from './recipes';