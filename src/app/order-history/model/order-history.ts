
export interface OrderHistoryResource {
  data: OrderHistory[];
  links?: OrderHistoryLinks;
  meta?: OrderHistoryMeta;
  relationship?: any;
}

export interface OrderHistory {
  id: string;
  attributes: OrderHistoryAttributes;
  links?: OrderHistoryLinks;
  meta?: OrderHistoryMeta;
  relationship?: any;
}

export interface OrderHistoryAttributes {
  created: string;
  grand_total: number;
  name: string;
  order_source: string;
  owner: string;
  payment_link: string;
  receipt_link: string;
  updated: string;
}

export interface OrderHistoryLinks {
  _self: string;
  first: string;
  next: string;
}

export interface OrderHistoryMeta {
  filters: string[];
  order_by: string[];
  page_length: string;
  page_number: string;
  type: string;
}
