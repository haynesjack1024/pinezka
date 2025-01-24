export interface Subcategory {
  readonly id: number;
  readonly name: string;
}

export interface Category extends Subcategory {
  readonly parent: number | null;
  readonly subcategories: Subcategory[];
}
