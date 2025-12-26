/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api"; // Import API

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback to refresh inventory
}

const categories = ["Science", "Art", "Religion", "History", "Geography"];

export function AddBookModal({
  isOpen,
  onClose,
  onSuccess,
}: AddBookModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    publication_year: new Date().getFullYear().toString(), // Added
    category: "",
    price: "",
    stockQuantity: "",
    threshold: "",
    coverImage: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format data for Backend
      const payload = {
        isbn: formData.isbn,
        title: formData.title,
        authors: [formData.author], // Backend expects array
        publisher: formData.publisher,
        publication_year: parseInt(formData.publication_year),
        selling_price: parseFloat(formData.price),
        category: formData.category,
        stock_quantity: parseInt(formData.stockQuantity),
        threshold: parseInt(formData.threshold),
      };

      await api.post("/books", payload);

      toast({
        title: "Book Added",
        description: `"${formData.title}" has been added to the inventory.`,
      });

      // Reset
      setFormData({
        isbn: "",
        title: "",
        author: "",
        publisher: "",
        publication_year: new Date().getFullYear().toString(),
        category: "",
        price: "",
        stockQuantity: "",
        threshold: "",
        coverImage: "",
        description: "",
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add book",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Add New Book
          </DialogTitle>
          <DialogDescription>
            Fill in the details to add a new book to the inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                placeholder="978-0..."
                value={formData.isbn}
                onChange={(e) =>
                  setFormData({ ...formData, isbn: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Book title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="author">Author (Primary)</Label>
              <Input
                id="author"
                placeholder="Author name"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="publisher">Publisher</Label>
              <Input
                id="publisher"
                placeholder="Publisher name"
                value={formData.publisher}
                onChange={(e) =>
                  setFormData({ ...formData, publisher: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Pub. Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.publication_year}
                onChange={(e) =>
                  setFormData({ ...formData, publication_year: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, stockQuantity: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Low Stock Threshold</Label>
              <Input
                id="threshold"
                type="number"
                min="1"
                value={formData.threshold}
                onChange={(e) =>
                  setFormData({ ...formData, threshold: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="hero"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
