import { 
  users, products, categories, cartItems, addresses, orders, favorites, reviews, carts, productGalleries,
  coupons, notifications, chatSessions, chatMessages, reviewHelpful,
  type User, type InsertUser, type Product, type Category, type CartItem, type InsertCartItem,
  type Address, type InsertAddress, type Order, type InsertOrder, type Favorite, type Review,
  type ProductGallery, type Cart, type Coupon, type InsertCoupon, type Notification, 
  type InsertNotification, type ChatSession, type InsertChatSession, type ChatMessage, 
  type InsertChatMessage, type ReviewHelpful, type InsertReview
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(categoryId?: number, search?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  
  // Product Galleries
  getProductGalleries(productId: number): Promise<ProductGallery[]>;
  
  // Cart
  getUserCart(userId: number): Promise<Cart | undefined>;
  createCart(userId: number): Promise<Cart>;
  getCartItems(cartId: number): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeCartItem(id: number): Promise<void>;
  clearCart(cartId: number): Promise<void>;
  
  // Addresses
  getUserAddresses(userId: number): Promise<Address[]>;
  getAddress(id: number): Promise<Address | undefined>;
  createAddress(address: InsertAddress): Promise<Address>;
  
  // Orders
  getUserOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  
  // Favorites
  getUserFavorites(userId: number): Promise<Favorite[]>;
  addFavorite(userId: number, productId: number): Promise<Favorite>;
  removeFavorite(userId: number, productId: number): Promise<void>;
  
  // Reviews
  getProductReviews(productId: number): Promise<Review[]>;
  addReview(review: InsertReview): Promise<Review>;
  markReviewHelpful(reviewId: number, userId: number, isHelpful: boolean): Promise<ReviewHelpful>;
  
  // Coupons
  getCoupons(): Promise<Coupon[]>;
  getCoupon(code: string): Promise<Coupon | undefined>;
  validateCoupon(code: string, userId: number, total: number): Promise<{ valid: boolean; discount: number; coupon?: Coupon }>;
  applyCoupon(userId: number, couponId: number, orderId?: number): Promise<void>;
  
  // Notifications
  getUserNotifications(userId: number, unreadOnly?: boolean): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(notificationId: number): Promise<void>;
  markAllNotificationsRead(userId: number): Promise<void>;
  
  // Chat
  getChatSessions(userId?: number): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatMessages(sessionId: number): Promise<ChatMessage[]>;
  addChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateChatSession(sessionId: number, updates: Partial<ChatSession>): Promise<ChatSession>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private productGalleries: Map<number, ProductGallery[]>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem[]>;
  private addresses: Map<number, Address[]>;
  private orders: Map<number, Order[]>;
  private favorites: Map<number, Favorite[]>;
  private reviews: Map<number, Review[]>;
  private coupons: Map<number, Coupon>;
  private notifications: Map<number, Notification[]>;
  private chatSessions: Map<number, ChatSession>;
  private chatMessages: Map<number, ChatMessage[]>;
  private reviewHelpful: Map<number, ReviewHelpful[]>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.productGalleries = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.addresses = new Map();
    this.orders = new Map();
    this.favorites = new Map();
    this.reviews = new Map();
    this.coupons = new Map();
    this.notifications = new Map();
    this.chatSessions = new Map();
    this.chatMessages = new Map();
    this.reviewHelpful = new Map();
    this.currentId = 1;
    
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Categories
    const categoriesData = [
      { id: 1, name: "Velas", description: "Velas aromáticas artesanales", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Jabones", description: "Jabones naturales hechos a mano", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: "Libretas", description: "Libretas artesanales de cuero", createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: "Inciensos", description: "Inciensos aromáticos para meditación", createdAt: new Date(), updatedAt: new Date() }
    ];
    
    categoriesData.forEach(cat => this.categories.set(cat.id, cat));

    // Products
    const productsData = [
      {
        id: 1, categoryId: 1, name: "Vela Aromática Lavanda", description: "Relajante aroma de lavanda natural",
        price: "15.00", stock: 50, isDigital: false,
        recipe: "Cera de soja natural, aceite esencial de lavanda búlgara, mecha de algodón orgánico",
        magicalProperties: "La lavanda es conocida por sus propiedades calmantes y purificadoras. Ideal para rituales de relajación.",
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 2, categoryId: 2, name: "Jabón Artesanal Miel", description: "Con ingredientes naturales y miel pura",
        price: "12.00", stock: 30, isDigital: false,
        recipe: "Aceite de coco, aceite de oliva, miel orgánica, manteca de karité",
        magicalProperties: "La miel atrae la abundancia y dulzura a tu vida.",
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 3, categoryId: 3, name: "Libreta Místico Dreams", description: "Cuero artesanal con páginas recicladas",
        price: "45.00", stock: 20, isDigital: false,
        recipe: "Cuero genuino, papel reciclado, hilo encerado",
        magicalProperties: "Perfecta para escribir tus intenciones y manifestaciones.",
        createdAt: new Date(), updatedAt: new Date()
      },
      {
        id: 4, categoryId: 4, name: "Set Inciensos Chakras", description: "7 aromas para equilibrar tus chakras",
        price: "28.00", stock: 25, isDigital: false,
        recipe: "Resinas naturales, aceites esenciales específicos para cada chakra",
        magicalProperties: "Ayuda a equilibrar y alinear los siete chakras principales.",
        createdAt: new Date(), updatedAt: new Date()
      }
    ];

    productsData.forEach(prod => this.products.set(prod.id, prod));

    // Product galleries
    const galleriesData = [
      { id: 1, productId: 1, imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", altText: "Vela Aromática Lavanda", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, productId: 2, imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", altText: "Jabón Artesanal Miel", createdAt: new Date(), updatedAt: new Date() },
      { id: 3, productId: 3, imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", altText: "Libreta Místico Dreams", createdAt: new Date(), updatedAt: new Date() },
      { id: 4, productId: 4, imageUrl: "https://pixabay.com/get/g988f408de7a583a70d73aa872058fe863845f326c14f74711af55e2a47eb6515856fd10e211e1c6a6cb01c24abf62a5419d26627722b5ff16f277c013cc3c70d_1280.jpg", altText: "Set Inciensos Chakras", createdAt: new Date(), updatedAt: new Date() }
    ];

    galleriesData.forEach(gallery => {
      const existing = this.productGalleries.get(gallery.productId) || [];
      existing.push(gallery);
      this.productGalleries.set(gallery.productId, existing);
    });

    // Sample coupons
    const couponsData = [
      {
        id: 1,
        code: "BIENVENIDO10",
        name: "Bienvenida 10% descuento",
        description: "10% de descuento para nuevos clientes",
        type: "percentage",
        value: "10.00",
        minimumAmount: "50.00",
        maxDiscount: null,
        usageLimit: 100,
        usedCount: 15,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        code: "VERANO25",
        name: "Descuento de Verano",
        description: "25% de descuento en productos seleccionados",
        type: "percentage",
        value: "25.00",
        minimumAmount: "100.00",
        maxDiscount: "50.00",
        usageLimit: 50,
        usedCount: 8,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    couponsData.forEach(coupon => {
      this.coupons.set(coupon.id, coupon);
    });

    this.currentId = 10;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      emailVerifiedAt: null,
      rememberToken: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getProducts(categoryId?: number, search?: string): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }
    
    return products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).slice(0, 4);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getProductGalleries(productId: number): Promise<ProductGallery[]> {
    return this.productGalleries.get(productId) || [];
  }

  async getUserCart(userId: number): Promise<Cart | undefined> {
    return this.carts.get(userId);
  }

  async createCart(userId: number): Promise<Cart> {
    const cart: Cart = {
      id: this.currentId++,
      userId,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.carts.set(userId, cart);
    return cart;
  }

  async getCartItems(cartId: number): Promise<CartItem[]> {
    return this.cartItems.get(cartId) || [];
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    const cartItem: CartItem = {
      ...item,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const existing = this.cartItems.get(item.cartId) || [];
    existing.push(cartItem);
    this.cartItems.set(item.cartId, existing);
    
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    // Find and update cart item
    for (const [cartId, items] of this.cartItems.entries()) {
      const itemIndex = items.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        items[itemIndex].quantity = quantity;
        items[itemIndex].updatedAt = new Date();
        return items[itemIndex];
      }
    }
    throw new Error("Cart item not found");
  }

  async removeCartItem(id: number): Promise<void> {
    for (const [cartId, items] of this.cartItems.entries()) {
      const filteredItems = items.filter(item => item.id !== id);
      if (filteredItems.length !== items.length) {
        this.cartItems.set(cartId, filteredItems);
        return;
      }
    }
  }

  async clearCart(cartId: number): Promise<void> {
    this.cartItems.set(cartId, []);
  }

  async getUserAddresses(userId: number): Promise<Address[]> {
    return this.addresses.get(userId) || [];
  }

  async getAddress(id: number): Promise<Address | undefined> {
    for (const addresses of this.addresses.values()) {
      const address = addresses.find(addr => addr.id === id);
      if (address) return address;
    }
    return undefined;
  }

  async createAddress(insertAddress: InsertAddress): Promise<Address> {
    const address: Address = {
      ...insertAddress,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const existing = this.addresses.get(insertAddress.userId) || [];
    existing.push(address);
    this.addresses.set(insertAddress.userId, existing);
    
    return address;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.orders.get(userId) || [];
  }

  async getOrder(id: number): Promise<Order | undefined> {
    for (const orders of this.orders.values()) {
      const order = orders.find(ord => ord.id === id);
      if (order) return order;
    }
    return undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = {
      ...insertOrder,
      id: this.currentId++,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const existing = this.orders.get(insertOrder.userId) || [];
    existing.push(order);
    this.orders.set(insertOrder.userId, existing);
    
    return order;
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return this.favorites.get(userId) || [];
  }

  async addFavorite(userId: number, productId: number): Promise<Favorite> {
    const favorite: Favorite = {
      id: this.currentId++,
      userId,
      productId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const existing = this.favorites.get(userId) || [];
    existing.push(favorite);
    this.favorites.set(userId, existing);
    
    return favorite;
  }

  async removeFavorite(userId: number, productId: number): Promise<void> {
    const existing = this.favorites.get(userId) || [];
    const filtered = existing.filter(fav => fav.productId !== productId);
    this.favorites.set(userId, filtered);
  }

  async getProductReviews(productId: number): Promise<Review[]> {
    return this.reviews.get(productId) || [];
  }

  async addReview(userId: number, productId: number, rating: number, comment?: string): Promise<Review> {
    const review: Review = {
      id: this.currentId++,
      userId,
      productId,
      rating,
      comment: comment || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const existing = this.reviews.get(productId) || [];
    existing.push(review);
    this.reviews.set(productId, existing);
    
    return review;
  }
}

export const storage = new MemStorage();
