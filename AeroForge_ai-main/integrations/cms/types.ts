export interface WixDataItem {
  _id?: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  [key: string]: any;
}

export interface WixDataQueryResult<T = WixDataItem> {
  items: T[];
  totalCount?: number;
  hasNext(): boolean;
}
