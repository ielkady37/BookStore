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
import { CreditCard, Lock, Calendar, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { useCart } from "@/context/CartContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  total: number;
}

export function CheckoutModal({
  isOpen,
  onClose,
  onComplete,
  total,
}: CheckoutModalProps) {
  const { items } = useCart();
  const { toast } = useToast();

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const payload = {
        items: items.map((item) => ({
          isbn: item.book.isbn,
          quantity: item.quantity,
          // Fixed: Use selling_price
          price: item.book.selling_price,
        })),
        creditCard: {
          number: cardNumber.replace(/\s/g, ""),
          expiry: expiryDate,
        },
      };

      await api.post("/orders/checkout", payload);

      setIsProcessing(false);
      setIsComplete(true);

      setTimeout(() => {
        toast({
          title: "Order Placed Successfully!",
          description: "Thank you for your purchase.",
        });
        setIsComplete(false);
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        onComplete();
      }, 1500);
    } catch (err: any) {
      setIsProcessing(false);
      toast({
        title: "Transaction Failed",
        description:
          err.response?.data?.message || "Payment could not be processed.",
        variant: "destructive",
      });
    }
  };

  const formatCardNumber = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19);
  const formatExpiryDate = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1/$2")
      .slice(0, 5);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        {isComplete ? (
          <div className="py-12 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="font-display text-2xl font-semibold mb-2">
              Payment Successful!
            </h3>
            <p className="text-muted-foreground">
              Your order has been processed.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" /> Secure Checkout
              </DialogTitle>
              <DialogDescription>
                Enter your payment details to complete your purchase.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                <span className="text-muted-foreground">Order Total</span>
                <span className="font-display text-2xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) =>
                        setExpiryDate(formatExpiryDate(e.target.value))
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
