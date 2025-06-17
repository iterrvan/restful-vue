import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, MapPin, Package, Shield } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Address } from "@/types";

const addressSchema = z.object({
  street: z.string().min(1, "La calle es requerida"),
  colony: z.string().min(1, "La colonia es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  state: z.string().min(1, "El estado es requerido"),
  country: z.string().min(1, "El país es requerido"),
  zipCode: z.string().min(1, "El código postal es requerido"),
  reference: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function Checkout() {
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      colony: "",
      city: "",
      state: "",
      country: "México",
      zipCode: "",
      reference: "",
    },
  });

  const { data: addresses = [] } = useQuery<Address[]>({
    queryKey: ["/api/addresses", user?.id],
    queryFn: () => api.getAddresses(user!.id),
    enabled: !!user,
  });

  const total = getCartTotal();

  // Redirect if not authenticated or cart is empty
  if (!user) {
    navigate("/login");
    return null;
  }

  if (cartItems.length === 0) {
    navigate("/carrito");
    return null;
  }

  const onSubmit = async (data: AddressFormData) => {
    setIsProcessing(true);
    
    try {
      let addressId = selectedAddress;
      
      // Create new address if none selected
      if (!addressId) {
        const newAddress = await api.createAddress({
          ...data,
          userId: user.id,
        });
        addressId = newAddress.id;
      }

      // Create order
      const order = await api.createOrder({
        userId: user.id,
        addressId: addressId!,
        total: total.toString(),
      });

      // Clear cart and redirect to success
      await clearCart();
      
      toast({
        title: "¡Pedido realizado!",
        description: `Tu pedido #${order.id} ha sido procesado exitosamente.`,
      });
      
      navigate("/perfil");
    } catch (error) {
      toast({
        title: "Error al procesar el pedido",
        description: "Ocurrió un error al procesar tu pedido. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Finalizar Compra</h1>
          <p className="text-gray-600">Completa tu información para procesar el pedido</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="mystical-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dirección de Envío
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Direcciones guardadas</h3>
                    <div className="space-y-2">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedAddress === address.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedAddress(address.id)}
                        >
                          <p className="font-medium">
                            {address.street}, {address.colony}
                          </p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                  </div>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <h3 className="font-semibold">
                      {selectedAddress ? "O agrega una nueva dirección" : "Nueva dirección"}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Calle y número</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Reforma 123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="colony"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Colonia</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Centro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Ciudad de México" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: CDMX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Código Postal</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 01234" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Referencias (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Casa azul con portón blanco" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="mystical-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Método de Pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Tarjeta de Crédito/Débito
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1">PayPal</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="transfer" id="transfer" />
                    <Label htmlFor="transfer" className="flex-1">Transferencia Bancaria</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="mystical-shadow sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Resumen del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.product?.name}</p>
                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                      </div>
                      <span className="font-medium">
                        ${(parseFloat(item.priceAtMoment) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span>Subtotal</span>
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
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isProcessing || (!selectedAddress && !form.formState.isValid)}
                >
                  {isProcessing ? "Procesando..." : "Realizar Pedido"}
                </Button>
                
                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    Pago 100% seguro
                  </p>
                  <p>Tu información está protegida</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
