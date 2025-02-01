export interface SimpleCategory {
  /** This category's ID. */
  readonly id: number;
  /** This category's name. */
  readonly name: string;
}

export interface CurrentCategory {
  /**
   * Current category's ID.
   * If there's no current category, this field is absent.
   */
  readonly id?: number;
  /**
   * Current category's name.
   * If there's no current category, this field is absent.
   */
  readonly name?: string;
  /**
   * Current category parent's ID.
   * If there's no current category, this field is absent.
   */
  readonly parent?: number | null;
  /**
   * IDs of all the children of this category.
   * If there's no current category, this field is absent.
   */
  readonly children?: number[];
  /**
   * Direct descendants of this category.
   * If there's no current category, these are all the categories
   * which don't have a parent.
   */
  readonly subcategories: SimpleCategory[];
}

/**
 * Category with a full name including all it's ancestors.
 */
export interface ApiFullCategory {
  /** This category's ID. */
  readonly id: number;
  /** This category's full name. */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  readonly full_name: string[];
}

/**
 * Category with a full name including all it's ancestors.
 */
export interface FullCategory {
  /** This category's ID. */
  readonly id: number;
  /** This category's full name. */
  readonly fullName: string;
}
