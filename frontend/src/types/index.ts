export interface User {
  user_id: number;
  username: string;
  email: string;
  role: "admin" | "customer";
  fname: string;
  lname: string;
  address?: string;
  phone?: string;
}

export interface Book {
  isbn: string;
  title: string;
  authors: string;
  publisher_name?: string;
  publication_year: number;
  selling_price: number;
  category: string;
  stock_quantity: number;
  threshold: number;
  coverImage?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  order_id: number;
  order_date: string;
  total_amount: number;
  status: string;
  total_items: number;
}

export interface TopCustomer {
  username: string;
  email: string;
  orders_count: number;
  total_spent: number;
}

export interface TopBook {
  title: string;
  isbn: string;
  total_copies_sold: number;
}

export interface RestockStat {
  title: string;
  isbn: string;
  restock_count: number;
  total_quantity_restocked: number;
}
