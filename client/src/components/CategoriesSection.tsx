import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Category } from "@/types";
import { useLocation } from "wouter";

const categoryImages = {
  "Velas": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
  "Jabones": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200", 
  "Libretas": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
  "Inciensos": "https://pixabay.com/get/gd7beae096cdf6d615e7f8950a05c139045c1762f8cb145199b5dfa85156ba60202b1fc5be70c8b78fd1985614d6df1ea42f77c128e69c0a2c9664e450e799cb1_1280.jpg"
};

const categoryGradients = {
  "Velas": "from-purple-100 to-pink-100",
  "Jabones": "from-green-100 to-teal-100",
  "Libretas": "from-amber-100 to-orange-100", 
  "Inciensos": "from-indigo-100 to-purple-100"
};

export default function CategoriesSection() {
  const [, navigate] = useLocation();
  
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
    queryFn: () => api.getCategories()
  });

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/productos?category=${categoryId}`);
  };

  if (isLoading) {
    return (
      <section id="categories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Categorías</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Categorías</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora nuestra selección cuidadosamente curada de productos espirituales y artesanales
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer card-hover mystical-shadow"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className={`bg-gradient-to-br ${categoryGradients[category.name as keyof typeof categoryGradients] || "from-gray-100 to-gray-200"} rounded-xl p-6 text-center`}>
                <img
                  src={categoryImages[category.name as keyof typeof categoryImages] || "/placeholder-image.jpg"}
                  alt={category.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                <p className="text-sm text-gray-600">
                  {category.name === "Velas" && "Ilumina tu espacio"}
                  {category.name === "Jabones" && "Cuidado natural"}
                  {category.name === "Libretas" && "Plasma tus ideas"}
                  {category.name === "Inciensos" && "Aromas sagrados"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
