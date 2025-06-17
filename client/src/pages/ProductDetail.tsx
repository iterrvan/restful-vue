import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Minus, Plus, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const productImages = {
  1: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
  2: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
  3: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600",
  4: "https://pixabay.com/get/g988f408de7a583a70d73aa872058fe863845f326c14f74711af55e2a47eb6515856fd10e211e1c6a6cb01c24abf62a5419d26627722b5ff16f277c013cc3c70d_1280.jpg"
};

export default function ProductDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", id],
    queryFn: () => api.getProduct(parseInt(id!)),
    enabled: !!id
  });

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!product) return;

    try {
      await addToCart(product.id, quantity);
      toast({
        title: "Producto agregado",
        description: `${product.name} ha sido agregado al carrito.`,
      });
    } catch (error) {
      // Error handling is done in the context
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar favoritos.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removido de favoritos" : "Agregado a favoritos",
      description: `${product?.name} ${isFavorite ? "ha sido removido de" : "ha sido agregado a"} tus favoritos.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
            <Button onClick={() => navigate("/productos")}>Volver a productos</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const imageUrl = productImages[product.id as keyof typeof productImages] || "/placeholder-image.jpg";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/productos")} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver a productos
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-96 md:h-[500px] object-cover rounded-lg mystical-shadow"
            />
            {product.isDigital && (
              <Badge className="absolute top-4 left-4 bg-secondary">Digital</Badge>
            )}
            {product.stock === 0 && (
              <Badge className="absolute top-4 right-4 bg-red-500">Agotado</Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600">(24 reseñas)</span>
              </div>

              <p className="text-4xl font-bold text-primary mb-6">
                ${product.price}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Descripción</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Cantidad:</span>
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
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-purple-700 text-white font-semibold"
                  onClick={handleAddToCart}
                  disabled={cartLoading || product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock === 0 ? "Agotado" : "Agregar al Carrito"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleToggleFavorite}
                  className={isFavorite ? "text-red-500 border-red-500" : ""}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Detalles</TabsTrigger>
              <TabsTrigger value="properties">Propiedades Mágicas</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Receta e Ingredientes</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.recipe || "Información de ingredientes no disponible."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="properties" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Propiedades Espirituales</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.magicalProperties || "Información de propiedades mágicas no disponible."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Reseñas de Clientes</h3>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                        <span className="font-medium">Ana M.</span>
                        <span className="text-gray-500 text-sm ml-2">hace 2 días</span>
                      </div>
                      <p className="text-gray-600">
                        Excelente calidad y aroma increíble. La uso todas las noches para relajarme.
                      </p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-current" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <span className="font-medium">Carlos R.</span>
                        <span className="text-gray-500 text-sm ml-2">hace 1 semana</span>
                      </div>
                      <p className="text-gray-600">
                        Muy buen producto, aunque el aroma podría ser un poco más intenso.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
