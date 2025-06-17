import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function HeroSection() {
  const [, navigate] = useLocation();

  return (
    <section className="relative gradient-hero text-white">
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">Descubre la Magia</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Productos artesanales para tu bienestar espiritual
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-secondary hover:bg-amber-600 text-white font-semibold"
              onClick={() => navigate("/productos")}
            >
              Ver Productos
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold"
              onClick={() => {
                const categoriesSection = document.getElementById("categories");
                categoriesSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explorar Categorías
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
