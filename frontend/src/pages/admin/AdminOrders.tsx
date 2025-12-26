/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await api.get("/publisher-orders");
      setOrders(res.data.data.orders);
    } catch (err) {
      console.error("Failed to fetch publisher orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmReceipt = async (orderId: number) => {
    try {
      await api.patch(`/publisher-orders/${orderId}/confirm`);
      toast({ title: "Success", description: "Stock updated." });
      fetchOrders(); // Refresh list
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to confirm.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-8">Publisher Orders</h1>
        <Card>
          <CardHeader>
            <CardTitle>Restock Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.pub_order_id}>
                    <TableCell>{order.isbn}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>
                      {new Date(order.order_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.status === "Received" ? (
                        <Badge variant="default" className="bg-green-600">
                          Received
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Ordered</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === "Ordered" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleConfirmReceipt(order.pub_order_id)
                          }
                        >
                          <Package className="w-4 h-4 mr-1" /> Confirm
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
