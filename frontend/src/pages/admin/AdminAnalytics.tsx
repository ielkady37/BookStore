/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "@/services/api";

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/reports/dashboard");
        setStats(res.data.data);
      } catch (err) {
        console.error("Failed to fetch analytics");
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Sales Last Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.salesLastMonth || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Books</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topSellingBooks || []}>
                  <XAxis
                    dataKey="title"
                    tickFormatter={(v) => v.substring(0, 10)}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="total_copies_sold"
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCustomers?.map((c: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{c.username}</p>
                      <p className="text-sm text-muted-foreground">{c.email}</p>
                    </div>
                    <div className="font-bold">${c.total_spent}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
