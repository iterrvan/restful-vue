import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const productImages = {
  1: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
  2: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
  3: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
  4: "https://pixabay.com/get/g988f408de7a583a70d73aa872058fe863845f326c14f74711af55e2a47eb6515856fd10e211e1c6a6cb01c24abf62a5419d26627722b5ff16f277c013cc3c70d_1280.jpg"
};

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  if (!product) return null;

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart(product.id, quantity);
      onClose();
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removido de favoritos" : "Agregado a favoritos",
      description: `${product.name} ${isFavorite ? "ha sido removido de" : "ha sido agregado a"} tus favoritos.`,
    });
  };

  const imageUrl = productImages[product.id as keyof typeof productImages] || "/placeholder-image.jpg";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            {product.isDigital && (
              <Badge className="absolute top-4 left-4 bg-secondary">Digital</Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-bold">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">(24 reseñas)</span>
            </div>

            <p className="text-3xl font-bold text-primary">${product.price}</p>

            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {product.magicalProperties && (
              <div>
                <h3 className="font-semibold mb-2">Propiedades Mágicas</h3>
                <p className="text-gray-600">{product.magicalProperties}</p>
              </div>
            )}

            {product.recipe && (
              <div>
                <h3 className="font-semibold mb-2">Receta e Ingredientes</h3>
                <p className="text-gray-600">{product.recipe}</p>
              </div>
            )}

            <Separator />

            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 border-l border-r min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                className="flex-1 bg-primary hover:bg-purple-700 text-white font-semibold"
                onClick={handleAddToCart}
                disabled={cartLoading || product.stock === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.stock === 0 ? "Agotado" : "Agregar al Carrito"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFavorite}
                className={isFavorite ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Reviews Preview */}
            <div>
              <h3 className="font-semibold mb-4">Reseñas Recientes</h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <span className="font-medium">Ana M.</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Excelente calidad y aroma increíble. La uso todas las noches para relajarme.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
