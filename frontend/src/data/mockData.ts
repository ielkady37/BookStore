// Mock Data for the Online Bookstore System
// This file contains all hardcoded data used throughout the application

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: 'Science' | 'Art' | 'Religion' | 'History' | 'Geography';
  price: number;
  stockQuantity: number;
  threshold: number;
  coverImage: string;
  description: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Order {
  id: string;
  orderNo: string;
  date: string;
  books: { title: string; quantity: number; price: number }[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface PublisherOrder {
  id: string;
  publisher: string;
  bookTitle: string;
  isbn: string;
  quantity: number;
  orderDate: string;
  status: 'Ordered' | 'Received';
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export const mockBooks: Book[] = [
  {
    id: '1',
    isbn: '978-0-13-468599-1',
    title: 'The Fabric of the Cosmos',
    author: 'Brian Greene',
    publisher: 'Vintage Books',
    category: 'Science',
    price: 24.99,
    stockQuantity: 45,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=600&fit=crop',
    description: 'A journey through the deepest questions of space, time, and reality.',
  },
  {
    id: '2',
    isbn: '978-0-7148-4426-4',
    title: 'The Story of Art',
    author: 'E.H. Gombrich',
    publisher: 'Phaidon Press',
    category: 'Art',
    price: 39.95,
    stockQuantity: 8,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=600&fit=crop',
    description: 'The most famous and popular book on art ever written.',
  },
  {
    id: '3',
    isbn: '978-0-06-112008-4',
    title: 'A History of God',
    author: 'Karen Armstrong',
    publisher: 'Ballantine Books',
    category: 'Religion',
    price: 18.00,
    stockQuantity: 32,
    threshold: 15,
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
    description: 'The 4,000-year quest of Judaism, Christianity, and Islam.',
  },
  {
    id: '4',
    isbn: '978-0-14-028039-4',
    title: 'Sapiens: A Brief History',
    author: 'Yuval Noah Harari',
    publisher: 'Harper',
    category: 'History',
    price: 22.99,
    stockQuantity: 0,
    threshold: 20,
    coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
    description: 'A groundbreaking narrative of humanity\'s creation and evolution.',
  },
  {
    id: '5',
    isbn: '978-0-19-957588-2',
    title: 'Prisoners of Geography',
    author: 'Tim Marshall',
    publisher: 'Scribner',
    category: 'Geography',
    price: 16.99,
    stockQuantity: 25,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=600&fit=crop',
    description: 'Ten maps that explain everything about the world.',
  },
  {
    id: '6',
    isbn: '978-0-393-35668-2',
    title: 'A Short History of Nearly Everything',
    author: 'Bill Bryson',
    publisher: 'Broadway Books',
    category: 'Science',
    price: 20.00,
    stockQuantity: 55,
    threshold: 15,
    coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    description: 'A journey through science\'s most extraordinary discoveries.',
  },
  {
    id: '7',
    isbn: '978-0-500-20271-1',
    title: 'Ways of Seeing',
    author: 'John Berger',
    publisher: 'Penguin Books',
    category: 'Art',
    price: 15.00,
    stockQuantity: 5,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=600&fit=crop',
    description: 'A revolutionary approach to understanding visual culture.',
  },
  {
    id: '8',
    isbn: '978-0-06-093546-7',
    title: 'The Rise and Fall of the Third Reich',
    author: 'William L. Shirer',
    publisher: 'Simon & Schuster',
    category: 'History',
    price: 28.00,
    stockQuantity: 18,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&h=600&fit=crop',
    description: 'A definitive history of Nazi Germany.',
  },
  {
    id: '9',
    isbn: '978-0-14-044913-6',
    title: 'The World\'s Religions',
    author: 'Huston Smith',
    publisher: 'HarperOne',
    category: 'Religion',
    price: 17.99,
    stockQuantity: 42,
    threshold: 12,
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    description: 'An exploration of the world\'s great wisdom traditions.',
  },
  {
    id: '10',
    isbn: '978-0-393-31755-8',
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    publisher: 'W. W. Norton',
    category: 'Geography',
    price: 19.95,
    stockQuantity: 3,
    threshold: 10,
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
    description: 'The fates of human societies explained through geography.',
  },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNo: 'ORD-2024-001',
    date: '2024-12-20',
    books: [
      { title: 'The Fabric of the Cosmos', quantity: 1, price: 24.99 },
      { title: 'Sapiens: A Brief History', quantity: 2, price: 22.99 },
    ],
    total: 70.97,
    status: 'Delivered',
  },
  {
    id: '2',
    orderNo: 'ORD-2024-002',
    date: '2024-12-22',
    books: [
      { title: 'The Story of Art', quantity: 1, price: 39.95 },
    ],
    total: 39.95,
    status: 'Shipped',
  },
  {
    id: '3',
    orderNo: 'ORD-2024-003',
    date: '2024-12-24',
    books: [
      { title: 'Ways of Seeing', quantity: 1, price: 15.00 },
      { title: 'A History of God', quantity: 1, price: 18.00 },
    ],
    total: 33.00,
    status: 'Processing',
  },
];

export const mockUser: User = {
  id: '1',
  name: 'Alexandra Chen',
  email: 'alexandra.chen@email.com',
  phone: '+1 (555) 123-4567',
  address: '123 Library Lane, Booktown, BK 12345',
};

export const mockPublisherOrders: PublisherOrder[] = [
  {
    id: '1',
    publisher: 'Phaidon Press',
    bookTitle: 'The Story of Art',
    isbn: '978-0-7148-4426-4',
    quantity: 25,
    orderDate: '2024-12-23',
    status: 'Ordered',
  },
  {
    id: '2',
    publisher: 'Penguin Books',
    bookTitle: 'Ways of Seeing',
    isbn: '978-0-500-20271-1',
    quantity: 20,
    orderDate: '2024-12-22',
    status: 'Ordered',
  },
  {
    id: '3',
    publisher: 'W. W. Norton',
    bookTitle: 'Guns, Germs, and Steel',
    isbn: '978-0-393-31755-8',
    quantity: 15,
    orderDate: '2024-12-20',
    status: 'Received',
  },
  {
    id: '4',
    publisher: 'Harper',
    bookTitle: 'Sapiens: A Brief History',
    isbn: '978-0-14-028039-4',
    quantity: 30,
    orderDate: '2024-12-21',
    status: 'Ordered',
  },
];

export const mockSalesData: SalesData[] = [
  { date: '2024-12-01', sales: 1250.00, orders: 15 },
  { date: '2024-12-02', sales: 980.50, orders: 12 },
  { date: '2024-12-03', sales: 1540.75, orders: 18 },
  { date: '2024-12-04', sales: 2100.00, orders: 25 },
  { date: '2024-12-05', sales: 1875.25, orders: 22 },
  { date: '2024-12-06', sales: 890.00, orders: 10 },
  { date: '2024-12-07', sales: 1100.50, orders: 13 },
  { date: '2024-12-08', sales: 1650.00, orders: 20 },
  { date: '2024-12-09', sales: 1420.75, orders: 17 },
  { date: '2024-12-10', sales: 1980.00, orders: 24 },
];

export const mockTopCustomers = [
  { id: '1', name: 'Alexandra Chen', totalSpent: 1250.97, orders: 15 },
  { id: '2', name: 'Marcus Johnson', totalSpent: 987.50, orders: 12 },
  { id: '3', name: 'Sarah Williams', totalSpent: 876.25, orders: 10 },
  { id: '4', name: 'David Kim', totalSpent: 654.00, orders: 8 },
  { id: '5', name: 'Emily Rodriguez', totalSpent: 543.75, orders: 7 },
];

export const mockTopSellingBooks = [
  { id: '1', title: 'Sapiens: A Brief History', unitsSold: 245, revenue: 5632.55 },
  { id: '2', title: 'The Fabric of the Cosmos', unitsSold: 198, revenue: 4950.02 },
  { id: '3', title: 'A Short History of Nearly Everything', unitsSold: 176, revenue: 3520.00 },
  { id: '4', title: 'The Story of Art', unitsSold: 134, revenue: 5353.30 },
  { id: '5', title: 'Guns, Germs, and Steel', unitsSold: 122, revenue: 2433.90 },
  { id: '6', title: 'A History of God', unitsSold: 98, revenue: 1764.00 },
  { id: '7', title: 'Prisoners of Geography', unitsSold: 87, revenue: 1478.13 },
  { id: '8', title: 'Ways of Seeing', unitsSold: 76, revenue: 1140.00 },
  { id: '9', title: 'The World\'s Religions', unitsSold: 65, revenue: 1169.35 },
  { id: '10', title: 'The Rise and Fall of the Third Reich', unitsSold: 54, revenue: 1512.00 },
];

export const mockRestockHistory = [
  { isbn: '978-0-14-028039-4', title: 'Sapiens: A Brief History', restockCount: 8 },
  { isbn: '978-0-7148-4426-4', title: 'The Story of Art', restockCount: 6 },
  { isbn: '978-0-500-20271-1', title: 'Ways of Seeing', restockCount: 5 },
  { isbn: '978-0-393-31755-8', title: 'Guns, Germs, and Steel', restockCount: 4 },
  { isbn: '978-0-13-468599-1', title: 'The Fabric of the Cosmos', restockCount: 3 },
];

export const categories = ['Science', 'Art', 'Religion', 'History', 'Geography'] as const;
