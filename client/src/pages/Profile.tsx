import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Package, Heart, MapPin, CreditCard, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { api } from "@/lib/api";
import { Order, Address, Favorite } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default function Profile() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not authenticated
  if (!user) {
    navigate("/login");
    return null;
  }

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders", user.id],
    queryFn: () => api.getOrders(user.id),
  });

  const { data: addresses = [] } = useQuery<Address[]>({
    queryKey: ["/api/addresses", user.id],
    queryFn: () => api.getAddresses(user.id),
  });

  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ["/api/favorites", user.id],
    queryFn: () => api.getFavorites(user.id),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu cuenta y visualiza tu actividad</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mystical-shadow">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm">Pedidos</span>
                    <Badge variant="secondary">{orders.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm">Direcciones</span>
                    <Badge variant="secondary">{addresses.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <span className="text-sm">Favoritos</span>
                    <Badge variant="secondary">{favorites.length}</Badge>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={logout}
                >
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Profile Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Mis Pedidos
                </TabsTrigger>
                <TabsTrigger value="addresses" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Direcciones
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favoritos
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders" className="mt-6">
                <Card className="mystical-shadow">
                  <CardHeader>
                    <CardTitle>Historial de Pedidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No tienes pedidos aún
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Comienza a comprar y verás tus pedidos aquí
                        </p>
                        <Button onClick={() => navigate("/productos")}>
                          Ir de Compras
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-semibold">Pedido #{order.id}</h4>
                                <p className="text-sm text-gray-600">
                                  {format(new Date(order.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                                  {statusLabels[order.status as keyof typeof statusLabels]}
                                </Badge>
                                <p className="text-lg font-semibold text-primary mt-1">
                                  ${order.total}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                {order.currency}
                              </span>
                              <Button variant="outline" size="sm">
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="addresses" className="mt-6">
                <Card className="mystical-shadow">
                  <CardHeader>
                    <CardTitle>Mis Direcciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No tienes direcciones guardadas
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Agrega una dirección para hacer tus compras más rápido
                        </p>
                        <Button>Agregar Dirección</Button>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="font-semibold">{address.street}</p>
                                <p className="text-sm text-gray-600">{address.colony}</p>
                                <p className="text-sm text-gray-600">
                                  {address.city}, {address.state}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {address.country} {address.zipCode}
                                </p>
                                {address.reference && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Ref: {address.reference}
                                  </p>
                                )}
                              </div>
                              <Button variant="ghost" size="sm">
                                Editar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-6">
                <Card className="mystical-shadow">
                  <CardHeader>
                    <CardTitle>Mis Favoritos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {favorites.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No tienes favoritos aún
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Marca productos como favoritos para encontrarlos fácilmente
                        </p>
                        <Button onClick={() => navigate("/productos")}>
                          Explorar Productos
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {favorites.map((favorite) => (
                          <div key={favorite.id} className="flex items-center justify-between border rounded-lg p-4">
                            <div>
                              <h4 className="font-semibold">Producto #{favorite.productId}</h4>
                              <p className="text-sm text-gray-600">
                                Agregado a favoritos
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">Ver Producto</Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                Remover
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
