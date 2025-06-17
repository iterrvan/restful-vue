import { apiRequest } from "./queryClient";

export const api = {
  // Auth
  async login(email: string, password: string) {
    const response = await apiRequest("POST", "/api/auth/login", { email, password });
    return response.json();
  },

  async register(name: string, email: string, password: string) {
    const response = await apiRequest("POST", "/api/auth/register", { name, email, password });
    return response.json();
  },

  // Products
  async getProducts(categoryId?: number, search?: string) {
    const params = new URLSearchParams();
    if (categoryId) params.append("category", categoryId.toString());
    if (search) params.append("search", search);
    
    const response = await fetch(`/api/products?${params.toString()}`);
    if (!response.ok) throw new Error("Error al obtener productos");
    return response.json();
  },

  async getFeaturedProducts() {
    const response = await fetch("/api/products/featured");
    if (!response.ok) throw new Error("Error al obtener productos destacados");
    return response.json();
  },

  async getProduct(id: number) {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) throw new Error("Error al obtener producto");
    return response.json();
  },

  // Categories
  async getCategories() {
    const response = await fetch("/api/categories");
    if (!response.ok) throw new Error("Error al obtener categorías");
    return response.json();
  },

  // Cart
  async getCart(userId: number) {
    const response = await fetch(`/api/cart/${userId}`);
    if (!response.ok) throw new Error("Error al obtener carrito");
    return response.json();
  },

  async addToCart(userId: number, cartId: number, productId: number, quantity: number, priceAtMoment: string) {
    const response = await apiRequest("POST", "/api/cart/add", {
      userId,
      cartId,
      productId,
      quantity,
      priceAtMoment
    });
    return response.json();
  },

  async updateCartItem(itemId: number, quantity: number) {
    const response = await apiRequest("PUT", `/api/cart/update/${itemId}`, { quantity });
    return response.json();
  },

  async removeCartItem(itemId: number) {
    const response = await apiRequest("DELETE", `/api/cart/remove/${itemId}`);
    return response.json();
  },

  // Favorites
  async getFavorites(userId: number) {
    const response = await fetch(`/api/favorites/${userId}`);
    if (!response.ok) throw new Error("Error al obtener favoritos");
    return response.json();
  },

  async addFavorite(userId: number, productId: number) {
    const response = await apiRequest("POST", "/api/favorites", { userId, productId });
    return response.json();
  },

  async removeFavorite(userId: number, productId: number) {
    const response = await apiRequest("DELETE", `/api/favorites/${userId}/${productId}`);
    return response.json();
  },

  // Addresses
  async getAddresses(userId: number) {
    const response = await fetch(`/api/addresses/${userId}`);
    if (!response.ok) throw new Error("Error al obtener direcciones");
    return response.json();
  },

  async createAddress(address: any) {
    const response = await apiRequest("POST", "/api/addresses", address);
    return response.json();
  },

  // Orders
  async getOrders(userId: number) {
    const response = await fetch(`/api/orders/${userId}`);
    if (!response.ok) throw new Error("Error al obtener pedidos");
    return response.json();
  },

  async createOrder(order: any) {
    const response = await apiRequest("POST", "/api/orders", order);
    return response.json();
  },

  // Reviews
  async getProductReviews(productId: number) {
    const response = await fetch(`/api/reviews/${productId}`);
    if (!response.ok) throw new Error("Error al obtener reseñas");
    return response.json();
  },

  async addReview(userId: number, productId: number, rating: number, comment?: string) {
    const response = await apiRequest("POST", "/api/reviews", {
      userId,
      productId,
      rating,
      comment
    });
    return response.json();
  },

  async markReviewHelpful(reviewId: number, userId: number, isHelpful: boolean) {
    const response = await apiRequest("POST", `/api/reviews/${reviewId}/helpful`, {
      userId,
      isHelpful
    });
    return response.json();
  },

  // Coupons
  async getCoupons() {
    const response = await fetch("/api/coupons");
    if (!response.ok) throw new Error("Error al obtener cupones");
    return response.json();
  },

  async validateCoupon(code: string, userId: number, total: number) {
    const response = await apiRequest("POST", "/api/coupons/validate", {
      code,
      userId,
      total
    });
    return response.json();
  },

  async applyCoupon(userId: number, couponId: number, orderId?: number) {
    const response = await apiRequest("POST", "/api/coupons/apply", {
      userId,
      couponId,
      orderId
    });
    return response.json();
  },

  // Notifications
  async getNotifications(userId: number, unreadOnly?: boolean) {
    const params = unreadOnly ? "?unreadOnly=true" : "";
    const response = await fetch(`/api/notifications/${userId}${params}`);
    if (!response.ok) throw new Error("Error al obtener notificaciones");
    return response.json();
  },

  async createNotification(notification: any) {
    const response = await apiRequest("POST", "/api/notifications", notification);
    return response.json();
  },

  async markNotificationRead(notificationId: number) {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PATCH"
    });
    if (!response.ok) throw new Error("Error al marcar notificación");
    return response.json();
  },

  async markAllNotificationsRead(userId: number) {
    const response = await fetch(`/api/notifications/${userId}/read-all`, {
      method: "PATCH"
    });
    if (!response.ok) throw new Error("Error al marcar notificaciones");
    return response.json();
  },

  // Chat
  async getChatSessions(userId?: number) {
    const params = userId ? `?userId=${userId}` : "";
    const response = await fetch(`/api/chat/sessions${params}`);
    if (!response.ok) throw new Error("Error al obtener sesiones de chat");
    return response.json();
  },

  async createChatSession(session: any) {
    const response = await apiRequest("POST", "/api/chat/sessions", session);
    return response.json();
  },

  async getChatMessages(sessionId: number) {
    const response = await fetch(`/api/chat/sessions/${sessionId}/messages`);
    if (!response.ok) throw new Error("Error al obtener mensajes");
    return response.json();
  },

  async sendChatMessage(message: any) {
    const response = await apiRequest("POST", "/api/chat/messages", message);
    return response.json();
  },

  async updateChatSession(sessionId: number, updates: any) {
    const response = await fetch(`/api/chat/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error("Error al actualizar sesión");
    return response.json();
  }
};
