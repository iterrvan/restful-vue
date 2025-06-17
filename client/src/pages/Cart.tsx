import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

const productImages = {
  1: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  2: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  3: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
  4: "https://pixabay.com/get/g988f408de7a583a70d73aa872058fe863845f326c14f74711af55e2a47eb6515856fd10e211e1c6a6cb01c24abf62a5419d26627722b5ff16f277c013cc3c70d_1280.jpg"
};

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount, loading } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const total = getCartTotal();
  const itemsCount = getCartItemsCount();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/productos");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Carrito de Compras</h1>
          <p className="text-gray-600">
            {itemsCount > 0 ? `Tienes ${itemsCount} producto${itemsCount !== 1 ? "s" : ""} en tu carrito` : "Tu carrito está vacío"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-600 mb-6">
                Agrega algunos productos para comenzar tu compra
              </p>
              <Button onClick={handleContinueShopping} size="lg">
                Continuar Comprando
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const imageUrl = productImages[item.productId as keyof typeof productImages] || "/placeholder-image.jpg";
                const itemTotal = parseFloat(item.priceAtMoment) * item.quantity;
                
                return (
                  <Card key={item.id} className="mystical-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={imageUrl}
                          alt={item.product?.name || "Producto"}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {item.product?.name || "Producto"}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {item.product?.description || ""}
                          </p>
                          <p className="text-primary font-semibold mt-1">
                            ${item.priceAtMoment} c/u
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={loading}
                              className="px-3"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-3 py-2 border-l border-r min-w-[2.5rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={loading}
                              className="px-3"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="text-right min-w-[4rem]">
                            <p className="font-semibold text-gray-900">
                              ${itemTotal.toFixed(2)}
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            disabled={loading}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="mystical-shadow sticky top-8">
                <CardHeader>
                  <CardTitle>Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemsCount} productos)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Envío</span>
                    <span>Gratis</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    className="w-full bg-primary hover:bg-purple-700 text-white font-semibold"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceder al Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleContinueShopping}
                  >
                    Continuar Comprando
                  </Button>
                  
                  <div className="text-xs text-gray-500 text-center pt-4">
                    <p>✓ Envío gratuito en pedidos superiores a $500</p>
                    <p>✓ Garantía de devolución de 30 días</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
