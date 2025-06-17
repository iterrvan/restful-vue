import { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartContextType, Product } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
      setCartId(null);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await api.getCart(user.id);
      setCartId(data.cart.id);
      
      // Get product details for each cart item
      const itemsWithProducts = await Promise.all(
        data.items.map(async (item: CartItem) => {
          try {
            const product = await api.getProduct(item.productId);
            return { ...item, product };
          } catch (error) {
            console.error(`Error loading product ${item.productId}:`, error);
            return item;
          }
        })
      );
      
      setCartItems(itemsWithProducts);
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!user || !cartId) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get product details to get current price
      const product = await api.getProduct(productId);
      
      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.productId === productId);
      
      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        await api.addToCart(user.id, cartId, productId, quantity, product.price);
        await loadCart(); // Reload cart to get updated data
      }
      
      toast({
        title: "Producto agregado",
        description: "El producto ha sido agregado al carrito.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    setLoading(true);
    try {
      await api.updateCartItem(itemId, quantity);
      
      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    setLoading(true);
    try {
      await api.removeCartItem(itemId);
      
      // Update local state
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      toast({
        title: "Producto removido",
        description: "El producto ha sido removido del carrito.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo remover el producto del carrito.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => 
      total + (parseFloat(item.priceAtMoment) * item.quantity), 0
    );
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
