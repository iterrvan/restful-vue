import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu correo electrónico.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate newsletter subscription
    setTimeout(() => {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Te has suscrito al newsletter. Recibirás nuestras ofertas especiales.",
      });
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 gradient-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Mantente Conectado</h3>
        <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
          Recibe ofertas especiales, nuevos productos y contenido espiritual directamente en tu correo
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white border-0 focus:ring-2 focus:ring-secondary"
            disabled={loading}
          />
          <Button
            type="submit"
            className="bg-secondary hover:bg-amber-600 text-white font-semibold whitespace-nowrap"
            disabled={loading}
          >
            {loading ? "Suscribiendo..." : "Suscribirse"}
          </Button>
        </form>
      </div>
    </section>
  );
}
