import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPublisherOrders, PublisherOrder } from '@/data/mockData';
import { CheckCircle, Clock, Truck, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const AdminOrders = () => {
  const [orders, setOrders] = useState<PublisherOrder[]>(mockPublisherOrders);

  const handleConfirmReceipt = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: 'Received' as const } : order
      )
    );

    toast({
      title: 'Order Confirmed',
      description: 'The shipment has been marked as received.',
    });
  };

  const pendingOrders = orders.filter((o) => o.status === 'Ordered');
  const receivedOrders = orders.filter((o) => o.status === 'Received');

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Publisher Orders</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage orders placed to publishers for restocking
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold">{pendingOrders.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                awaiting shipment confirmation
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Received This Month
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold">{receivedOrders.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                shipments confirmed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Publisher Orders
            </CardTitle>
            <CardDescription>
              Manage incoming stock orders from publishers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Publisher</TableHead>
                    <TableHead className="font-semibold">Book</TableHead>
                    <TableHead className="font-semibold">ISBN</TableHead>
                    <TableHead className="font-semibold text-center">Quantity</TableHead>
                    <TableHead className="font-semibold">Order Date</TableHead>
                    <TableHead className="font-semibold text-center">Status</TableHead>
                    <TableHead className="font-semibold text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className={cn(
                        'transition-colors',
                        order.status === 'Received' && 'bg-success/5'
                      )}
                    >
                      <TableCell className="font-medium">{order.publisher}</TableCell>
                      <TableCell>{order.bookTitle}</TableCell>
                      <TableCell className="font-mono text-sm">{order.isbn}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {order.quantity}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.orderDate}
                      </TableCell>
                      <TableCell className="text-center">
                        {order.status === 'Received' ? (
                          <Badge variant="success" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Received
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Ordered
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.status === 'Ordered' ? (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleConfirmReceipt(order.id)}
                          >
                            <Package className="h-4 w-4 mr-1" />
                            Confirm Receipt
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Completed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminOrders;
