import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Heart, ShoppingCart, User, Menu, Search, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartSidebar from "./CartSidebar";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartItemsCount = getCartItemsCount();

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Místico</h1>
              <span className="text-sm text-gray-500 ml-2 hidden sm:inline">Artesanías Espirituales</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className={`transition-colors ${location === "/" ? "text-primary" : "text-gray-700 hover:text-primary"}`}>
                Inicio
              </Link>
              <Link href="/productos" className={`transition-colors ${location.startsWith("/productos") ? "text-primary" : "text-gray-700 hover:text-primary"}`}>
                Productos
              </Link>
              <a href="#categories" className="text-gray-700 hover:text-primary transition-colors">Categorías</a>
              <a href="#about" className="text-gray-700 hover:text-primary transition-colors">Sobre Nosotros</a>
              <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Contacto</a>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </form>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Favorites */}
              <Button variant="ghost" size="sm" className="relative p-2 text-gray-600 hover:text-primary">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2 text-gray-600 hover:text-primary"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-primary">
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline">{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/perfil">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/perfil">Mis Pedidos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/perfil">Favoritos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/registro">Registrarse</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden p-2 text-gray-600">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col space-y-4 mt-8">
                    <Link href="/" className="text-gray-700 hover:text-primary py-2">Inicio</Link>
                    <Link href="/productos" className="text-gray-700 hover:text-primary py-2">Productos</Link>
                    <a href="#categories" className="text-gray-700 hover:text-primary py-2">Categorías</a>
                    <div className="pt-4">
                      <form onSubmit={handleSearch}>
                        <Input
                          type="text"
                          placeholder="Buscar..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </form>
                    </div>
                    {!user && (
                      <div className="pt-4 space-y-2">
                        <Button variant="outline" className="w-full" asChild>
                          <Link href="/login">Iniciar Sesión</Link>
                        </Button>
                        <Button className="w-full" asChild>
                          <Link href="/registro">Registrarse</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
