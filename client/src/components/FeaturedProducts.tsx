import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Product } from "@/types";
import { useLocation } from "wouter";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const [, navigate] = useLocation();
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
    queryFn: () => api.getFeaturedProducts()
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Productos Destacados</h3>
              <p className="text-gray-600">Nuestras creaciones más populares</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-sm h-80"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">Productos Destacados</h3>
            <p className="text-gray-600">Nuestras creaciones más populares</p>
          </div>
          <Button
            variant="link"
            className="text-primary hover:text-purple-700 font-semibold"
            onClick={() => navigate("/productos")}
          >
            Ver todos →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
