import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  mockSalesData,
  mockTopCustomers,
  mockTopSellingBooks,
  mockRestockHistory,
} from '@/data/mockData';
import {
  DollarSign,
  TrendingUp,
  Users,
  BookOpen,
  CalendarIcon,
  Trophy,
  RefreshCcw,
  BarChart3,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const AdminAnalytics = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Calculate totals for mock data
  const previousMonthSales = mockSalesData.reduce((acc, day) => acc + day.sales, 0);
  const totalOrders = mockSalesData.reduce((acc, day) => acc + day.orders, 0);

  // Find sales for selected date
  const selectedDateData = selectedDate
    ? mockSalesData.find((d) => d.date === format(selectedDate, 'yyyy-MM-dd'))
    : null;

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Analytics Hub</h1>
          <p className="text-muted-foreground mt-1">
            Monitor sales, track performance, and gain insights
          </p>
        </div>

        {/* Top Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-elegant bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Previous Month Sales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold text-primary">
                ${previousMonthSales.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-success" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">this month</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold">
                ${(previousMonthSales / totalOrders).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">per order</p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold">
                {mockTopCustomers.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Sales Lookup & Sales Chart */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Daily Sales Lookup */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Daily Sales Lookup
              </CardTitle>
              <CardDescription>Select a date to view sales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              {selectedDateData ? (
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <p className="text-sm text-muted-foreground mb-2">
                    Sales on {format(selectedDate!, 'MMMM d, yyyy')}
                  </p>
                  <p className="font-display text-2xl font-bold text-success">
                    ${selectedDateData.sales.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDateData.orders} orders
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground">
                    No data available for this date
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sales Chart */}
          <Card className="shadow-elegant lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Trend
              </CardTitle>
              <CardDescription>Daily sales over the past 10 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockSalesData}>
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="var(--chart-grid)" 
                      strokeOpacity={0.5}
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => format(new Date(value), 'MMM d')}
                      tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                      stroke="var(--chart-grid)"
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`} 
                      tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                      stroke="var(--chart-grid)"
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Sales']}
                      labelFormatter={(label) => format(new Date(label), 'MMMM d, yyyy')}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row - Leaderboards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top 5 Customers */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                Top 5 Customers
              </CardTitle>
              <CardDescription>By total spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTopCustomers.map((customer, index) => (
                  <div
                    key={customer.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                        index === 0 && 'bg-warning text-warning-foreground',
                        index === 1 && 'bg-muted-foreground/30 text-foreground',
                        index === 2 && 'bg-warning/50 text-foreground',
                        index > 2 && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.orders} orders
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        ${customer.totalSpent.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 10 Selling Books */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Top 10 Selling Books
              </CardTitle>
              <CardDescription>By units sold</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={mockTopSellingBooks.slice(0, 5)}
                    layout="vertical"
                    margin={{ left: 0, right: 20 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="var(--chart-grid)" 
                      strokeOpacity={0.5}
                    />
                    <XAxis 
                      type="number" 
                      tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                      stroke="var(--chart-grid)"
                    />
                    <YAxis
                      type="category"
                      dataKey="title"
                      width={100}
                      tickFormatter={(value) =>
                        value.length > 15 ? `${value.slice(0, 15)}...` : value
                      }
                      tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                      stroke="var(--chart-grid)"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Bar dataKey="unitsSold" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Restock Frequency */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <RefreshCcw className="h-5 w-5" />
                Restock Frequency
              </CardTitle>
              <CardDescription>Times restocked per book</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRestockHistory.map((item) => (
                  <div
                    key={item.isbn}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {item.isbn}
                      </p>
                    </div>
                    <Badge
                      variant={item.restockCount >= 5 ? 'destructive' : 'secondary'}
                      className="ml-2"
                    >
                      {item.restockCount}x
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminAnalytics;
