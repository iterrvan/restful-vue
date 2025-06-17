import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star, Download } from "lucide-react";
import { Product } from "@/types";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
}

const productImages = {
  1: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  2: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  3: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
  4: "https://pixabay.com/get/g988f408de7a583a70d73aa872058fe863845f326c14f74711af55e2a47eb6515856fd10e211e1c6a6cb01c24abf62a5419d26627722b5ff16f277c013cc3c70d_1280.jpg"
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [, navigate] = useLocation();
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removido de favoritos" : "Agregado a favoritos",
      description: `${product.name} ${isFavorite ? "ha sido removido de" : "ha sido agregado a"} tus favoritos.`,
    });
  };

  const handleCardClick = () => {
    navigate(`/producto/${product.id}`);
  };

  const imageUrl = productImages[product.id as keyof typeof productImages] || "/placeholder-image.jpg";

  return (
    <Card className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden cursor-pointer card-hover mystical-shadow" onClick={handleCardClick}>
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <Button
          variant="secondary"
          size="sm"
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md ${isFavorite ? "text-red-500" : "text-gray-600"}`}
          onClick={handleToggleFavorite}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        
        {product.stock === 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500">Agotado</Badge>
        )}
        
        {product.isDigital && (
          <Badge className="absolute top-3 left-3 bg-secondary">Digital</Badge>
        )}
        
        {!product.isDigital && product.stock > 0 && product.id <= 2 && (
          <Badge className="absolute top-3 left-3 bg-accent">Nuevo</Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h4 className="font-semibold text-gray-900 mb-2 truncate">{product.name}</h4>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{product.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary">${product.price}</span>
          <div className="flex items-center">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-3 w-3 fill-current" />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">(24)</span>
          </div>
        </div>
        
        <Button
          className="w-full bg-primary hover:bg-purple-700 text-white font-semibold transition-colors"
          onClick={handleAddToCart}
          disabled={cartLoading || product.stock === 0}
        >
          {product.isDigital ? (
            <>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.stock === 0 ? "Agotado" : "Agregar al Carrito"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
