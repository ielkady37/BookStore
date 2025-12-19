import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Package, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Account = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Mock order history
  const orders = [
    {
      id: 'ORD-001',
      date: '2025-01-15',
      total: 45.98,
      status: 'Delivered',
      items: 2,
    },
    {
      id: 'ORD-002',
      date: '2025-01-10',
      total: 89.97,
      status: 'Shipped',
      items: 3,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream-dark/50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl font-bold">My Account</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your profile and view your orders
          </p>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl bg-card p-6 shadow-medium"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Profile</h2>
              <Button variant="ghost" size="sm" className="gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">{user.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{user.shippingAddress}</span>
              </div>
            </div>
          </motion.div>

          {/* Order History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl bg-card p-6 shadow-medium">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="font-display text-xl font-bold">Order History</h2>
              </div>

              <div className="mt-6 space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-muted/50 p-4"
                  >
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items} items • {order.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-sage/20 text-sage'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {order.status}
                      </span>
                      <span className="font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">
                    No orders yet
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Account;
