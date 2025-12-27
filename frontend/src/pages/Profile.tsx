/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";

export default function Profile() {
  const { user: authUser } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>(authUser || {});
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch Orders on Mount
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data.data.orders);
      } catch (error) {
        console.error("Error fetching orders");
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSave = async () => {
    try {
      await api.patch("/users/update-me", {
        first_name: userData.fname,
        last_name: userData.lname,
        phone: userData.phone,
        shipping_address: userData.address,
      });

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
      });
    } catch (err) {
      toast({ title: "Update Failed", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Completed" ? "default" : "secondary";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-lg">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">
                {userData.fname} {userData.lname}
              </h1>
              <p className="text-muted-foreground">{userData.email}</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="h-4 w-4" /> Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4" /> Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input
                        disabled={!isEditing}
                        value={userData.fname}
                        onChange={(e) =>
                          setUserData({ ...userData, fname: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input
                        disabled={!isEditing}
                        value={userData.lname}
                        onChange={(e) =>
                          setUserData({ ...userData, lname: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        disabled={!isEditing}
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        disabled={!isEditing}
                        value={userData.address}
                        onChange={(e) =>
                          setUserData({ ...userData, address: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.order_id}
                          className="p-4 border rounded-lg space-y-4"
                        >
                          <div className="flex justify-between">
                            <div>
                              <p className="font-semibold">
                                Order #{order.order_id}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  order.order_date
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={getStatusColor(order.status) as any}
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${order.total_amount}</span>
                          </div>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <p className="text-muted-foreground">No past orders.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
