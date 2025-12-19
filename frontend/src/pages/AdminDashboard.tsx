import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Package, 
  BarChart3, 
  Users, 
  Plus, 
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { books, categories, getCategoryIcon } from '@/data/mockData';

type AdminTab = 'books' | 'orders' | 'reports';

const AdminDashboard = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('books');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to access this page.
        </p>
        <Link to="/">
          <Button className="mt-6">Go Home</Button>
        </Link>
      </div>
    );
  }

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  // Mock orders for admin
  const pendingOrders = [
    { id: 'PO-001', book: 'A Brief History of Time', quantity: 20, status: 'pending' },
    { id: 'PO-002', book: 'Cosmos', quantity: 15, status: 'pending' },
  ];

  const tabs = [
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'orders', label: 'Publisher Orders', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream-dark/50">
      {/* Header */}
      <div className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl font-bold text-secondary-foreground">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-secondary-foreground/70">
              Manage books, orders, and view reports
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Books', value: books.length, icon: BookOpen, color: 'text-primary' },
            { label: 'Low Stock', value: books.filter(b => b.quantity < b.threshold).length, icon: Clock, color: 'text-amber-500' },
            { label: 'Pending Orders', value: pendingOrders.length, icon: Package, color: 'text-blue-500' },
            { label: 'Total Sales', value: '$12,450', icon: DollarSign, color: 'text-sage' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl bg-card p-6 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-border pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className="gap-2"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Books Tab */}
        {activeTab === 'books' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="hero" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Book
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl bg-card shadow-soft">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Book</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.isbn} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="h-12 w-9 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-xs text-muted-foreground">{book.isbn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-sm">
                          {getCategoryIcon(book.category)} {book.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">${book.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          book.quantity < book.threshold
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sage/20 text-sage'
                        }`}>
                          {book.quantity} / {book.threshold}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-xl bg-card p-6 shadow-soft">
              <h3 className="mb-4 font-display text-lg font-bold">Pending Publisher Orders</h3>
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-muted/50 p-4"
                  >
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.book} • {order.quantity} copies
                      </p>
                    </div>
                    <Button variant="hero" size="sm" className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Confirm Receipt
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 lg:grid-cols-2"
          >
            <div className="rounded-xl bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold">Top 5 Customers (Last 3 Months)</h3>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { name: 'John Doe', spent: 450 },
                  { name: 'Jane Smith', spent: 380 },
                  { name: 'Mike Johnson', spent: 320 },
                  { name: 'Sarah Wilson', spent: 290 },
                  { name: 'Tom Brown', spent: 245 },
                ].map((customer, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <span>{customer.name}</span>
                    </div>
                    <span className="font-semibold">${customer.spent}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-card p-6 shadow-soft">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold">Top 10 Selling Books</h3>
              </div>
              <div className="mt-4 space-y-3">
                {books.slice(0, 5).map((book, i) => (
                  <div key={book.isbn} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="line-clamp-1">{book.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{50 - i * 8} sold</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-card p-6 shadow-soft lg:col-span-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-display text-lg font-bold">Sales by Category</h3>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-5">
                {categories.map((cat) => (
                  <div key={cat} className="rounded-lg bg-muted/50 p-4 text-center">
                    <span className="text-2xl">{getCategoryIcon(cat)}</span>
                    <p className="mt-2 font-semibold">{cat}</p>
                    <p className="text-lg font-bold text-primary">${Math.floor(Math.random() * 3000 + 1000)}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
