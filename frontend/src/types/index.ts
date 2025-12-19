export type BookCategory = 'Science' | 'Art' | 'Religion' | 'History' | 'Geography';

export interface Publisher {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface Book {
  isbn: string;
  title: string;
  authors: string[];
  publisher: Publisher;
  publicationYear: number;
  price: number;
  category: BookCategory;
  quantity: number;
  threshold: number;
  coverImage?: string;
  description?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: string;
  isAdmin: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
}

export interface BookOrder {
  id: string;
  bookIsbn: string;
  quantity: number;
  orderDate: Date;
  status: 'pending' | 'confirmed';
}
