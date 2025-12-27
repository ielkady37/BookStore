import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { reportApi } from "@/services/api";
import { TopBook, TopCustomer, RestockStat } from "@/types";

export default function AdminAnalytics() {
  const [dashboardData, setDashboardData] = useState<{
    salesLastMonth: number;
    topCustomers: TopCustomer[];
    topSellingBooks: TopBook[];
  } | null>(null);

  const [selectedDate, setSelectedDate] = useState("");
  const [dailySales, setDailySales] = useState<number | null>(null);

  const [restockStats, setRestockStats] = useState<RestockStat[]>([]);

  useEffect(() => {
    fetchDashboard();
    fetchRestockStats();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await reportApi.getDashboard();
      setDashboardData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    }
  };

  const fetchRestockStats = async () => {
    try {
      const res = await reportApi.getRestockStats();
      setRestockStats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch restock stats", err);
    }
  };

  const handleDateSearch = async () => {
    if (!selectedDate) return;
    try {
      const res = await reportApi.getDailySales(selectedDate);
      setDailySales(res.data.data.total_sales);
    } catch (err) {
      console.error("Failed to fetch daily sales", err);
    }
  };

  if (!dashboardData) return <div className="p-8">Loading Analytics...</div>;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
          <p className="text-muted-foreground">
            Overview of sales, inventory, and customer activity.
          </p>
        </div>

        {/* 1. Sales Reports Section */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Monthly Sales Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Sales (Previous Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                ${dashboardData.salesLastMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Total confirmed revenue from last month
              </p>
            </CardContent>
          </Card>

          {/* Daily Sales Search Tool */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Check Daily Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
                <Button onClick={handleDateSearch} variant="secondary">
                  Check
                </Button>
              </div>
              {dailySales !== null && (
                <div className="mt-4">
                  <span className="text-muted-foreground text-sm">
                    Total for {selectedDate}:
                  </span>
                  <div className="text-2xl font-bold text-green-600">
                    ${dailySales.toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 2. Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Selling Books Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Selling Books</CardTitle>
              <CardDescription>Last 3 Months</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.topSellingBooks}
                  layout="vertical"
                  margin={{ left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="title"
                    type="category"
                    width={150}
                    tickFormatter={(val) =>
                      val.length > 20 ? `${val.substring(0, 20)}...` : val
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    formatter={(value: number) => [`${value} copies`, "Sold"]}
                  />
                  <Bar
                    dataKey="total_copies_sold"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Customers List */}
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Customers</CardTitle>
              <CardDescription>
                By purchase volume (Last 3 Months)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {dashboardData.topCustomers.map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {i + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {c.username}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {c.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${c.total_spent.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.orders_count} orders
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3. Restock Frequency Table */}
        <Card>
          <CardHeader>
            <CardTitle>Restock Frequency Report</CardTitle>
            <CardDescription>
              Number of times specific books have been ordered from publishers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead className="text-right">Times Ordered</TableHead>
                  <TableHead className="text-right">
                    Total Qty Restocked
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restockStats.length > 0 ? (
                  restockStats.map((stat) => (
                    <TableRow key={stat.isbn}>
                      <TableCell className="font-medium">
                        {stat.title}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {stat.isbn}
                      </TableCell>
                      <TableCell className="text-right">
                        {stat.restock_count}
                      </TableCell>
                      <TableCell className="text-right">
                        {stat.total_quantity_restocked}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No restocking history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
