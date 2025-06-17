import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const productImages = {
  1: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
  2: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
  3: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
  4: "https://pixabay.com/get/g988f408de7a583a70d73aa872058fe863845f326c14f74711af55e2a47eb6515856fd10e211e1c6a6cb01c24abf62a5419d26627722b5ff16f277c013cc3c70d_1280.jpg"
};

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, loading } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      onClose();
      return;
    }
    navigate("/checkout");
    onClose();
  };

  const handleViewCart = () => {
    navigate("/carrito");
    onClose();
  };

  const total = getCartTotal();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito de Compras
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mt-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ShoppingCart className="h-16 w-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Tu carrito está vacío</p>
                <p className="text-sm">Agrega algunos productos para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const imageUrl = productImages[item.productId as keyof typeof productImages] || "/placeholder-image.jpg";
                  
                  return (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
                      <img
                        src={imageUrl}
                        alt={item.product?.name || "Producto"}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product?.name || "Producto"}</h4>
                        <p className="text-sm text-gray-500">${item.priceAtMoment}</p>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={loading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="mx-3 font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={loading}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => removeFromCart(item.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cartItems.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">
                  ${total.toFixed(2)}
                </span>
              </div>
              
              <Button
                className="w-full bg-primary hover:bg-purple-700 text-white font-semibold"
                onClick={handleCheckout}
                disabled={loading}
              >
                Proceder al Checkout
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleViewCart}
              >
                Ver Carrito Completo
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
