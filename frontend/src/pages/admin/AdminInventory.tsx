import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AddBookModal } from "@/components/admin/AddBookModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Search,
  AlertTriangle,
  Package,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/services/api";
import { Book } from "@/types";

const AdminInventory = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/books");
      setBooks(res.data.data.books);
    } catch (error) {
      console.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm) ||
      book.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockBooks = books.filter(
    (book) => book.stock_quantity < book.threshold && book.stock_quantity > 0
  );
  const outOfStockBooks = books.filter((book) => book.stock_quantity === 0);
  const totalBooks = books.reduce((acc, book) => acc + book.stock_quantity, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">
              Inventory Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your book inventory and stock levels
            </p>
          </div>
          <Button variant="hero" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Book
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold">
                {totalBooks}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                across {books.length} titles
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-warning/20 bg-warning/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-warning">
                Low Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold text-warning">
                {lowStockBooks.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                titles below threshold
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-elegant border-destructive/20 bg-destructive/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-destructive">
                Out of Stock
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold text-destructive">
                {outOfStockBooks.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                titles need restocking
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="shadow-elegant mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ISBN, title, or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="font-display">Book Inventory</CardTitle>
            <CardDescription>
              {loading ? "Loading..." : `${filteredBooks.length} books found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">ISBN</TableHead>
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold text-center">
                      Stock
                    </TableHead>
                    <TableHead className="font-semibold text-center">
                      Threshold
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBooks.map((book) => {
                    const isLowStock = book.stock_quantity < book.threshold;
                    const isOutOfStock = book.stock_quantity === 0;

                    return (
                      <TableRow
                        key={book.isbn}
                        className={cn(
                          "transition-colors",
                          isOutOfStock &&
                            "bg-destructive/5 hover:bg-destructive/10",
                          isLowStock &&
                            !isOutOfStock &&
                            "bg-warning/5 hover:bg-warning/10"
                        )}
                      >
                        <TableCell className="font-mono text-sm">
                          {book.isbn}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {book.authors}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{book.category}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={cn(
                              "font-semibold",
                              isOutOfStock && "text-destructive",
                              isLowStock && !isOutOfStock && "text-warning"
                            )}
                          >
                            {book.stock_quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {book.threshold}
                        </TableCell>
                        <TableCell className="text-right">
                          {isOutOfStock ? (
                            <Badge variant="destructive">Out of Stock</Badge>
                          ) : isLowStock ? (
                            <Badge
                              variant="secondary"
                              className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                            >
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="default">In Stock</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchInventory} // Reload list after adding
      />
    </div>
  );
};

export default AdminInventory;
