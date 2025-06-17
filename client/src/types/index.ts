export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: string;
  stock: number;
  isDigital: boolean;
  recipe?: string;
  magicalProperties?: string;
  galleries?: ProductGallery[];
  reviews?: Review[];
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface ProductGallery {
  id: number;
  productId: number;
  imageUrl: string;
  altText: string;
}

export interface CartItem {
  id: number;
  userId: number;
  cartId: number;
  productId: number;
  quantity: number;
  priceAtMoment: string;
  product?: Product;
}

export interface Cart {
  id: number;
  userId: number;
  status: string;
}

export interface Address {
  id: number;
  userId: number;
  street: string;
  colony: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  reference?: string;
}

export interface Order {
  id: number;
  userId: number;
  addressId: number;
  total: string;
  currency: string;
  status: string;
  createdAt: Date;
}

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  loading: boolean;
}
