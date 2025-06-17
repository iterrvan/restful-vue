import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCartItemSchema, insertAddressSchema, insertOrderSchema, insertReviewSchema, insertCouponSchema, insertNotificationSchema, insertChatSessionSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
      
      const user = await storage.createUser(userData);
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(400).json({ message: "Datos inválidos" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      
      res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      res.status(500).json({ message: "Error del servidor" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const categoryId = req.query.category ? parseInt(req.query.category as string) : undefined;
      const search = req.query.search as string;
      const products = await storage.getProducts(categoryId, search);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener productos destacados" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      
      const galleries = await storage.getProductGalleries(id);
      const reviews = await storage.getProductReviews(id);
      
      res.json({ ...product, galleries, reviews });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener producto" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener categorías" });
    }
  });

  // Cart routes
  app.get("/api/cart/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      let cart = await storage.getUserCart(userId);
      
      if (!cart) {
        cart = await storage.createCart(userId);
      }
      
      const items = await storage.getCartItems(cart.id);
      res.json({ cart, items });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener carrito" });
    }
  });

  app.post("/api/cart/add", async (req, res) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addCartItem(cartItemData);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Datos inválidos para agregar al carrito" });
    }
  });

  app.put("/api/cart/update/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Error al actualizar item del carrito" });
    }
  });

  app.delete("/api/cart/remove/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeCartItem(id);
      res.json({ message: "Item removido del carrito" });
    } catch (error) {
      res.status(400).json({ message: "Error al remover item del carrito" });
    }
  });

  // Favorites routes
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener favoritos" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const { userId, productId } = req.body;
      const favorite = await storage.addFavorite(userId, productId);
      res.json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Error al agregar favorito" });
    }
  });

  app.delete("/api/favorites/:userId/:productId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      await storage.removeFavorite(userId, productId);
      res.json({ message: "Favorito removido" });
    } catch (error) {
      res.status(400).json({ message: "Error al remover favorito" });
    }
  });

  // Addresses routes
  app.get("/api/addresses/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const addresses = await storage.getUserAddresses(userId);
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener direcciones" });
    }
  });

  app.post("/api/addresses", async (req, res) => {
    try {
      const addressData = insertAddressSchema.parse(req.body);
      const address = await storage.createAddress(addressData);
      res.json(address);
    } catch (error) {
      res.status(400).json({ message: "Datos inválidos para la dirección" });
    }
  });

  // Orders routes
  app.get("/api/orders/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedidos" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Error al crear pedido" });
    }
  });

  // Reviews routes
  app.get("/api/reviews/:productId", async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener reseñas" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const reviewData = insertReviewSchema.parse(req.body);
      const review = await storage.addReview(reviewData);
      res.json(review);
    } catch (error) {
      res.status(400).json({ message: "Error al agregar reseña" });
    }
  });

  app.post("/api/reviews/:reviewId/helpful", async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const { userId, isHelpful } = req.body;
      const helpful = await storage.markReviewHelpful(reviewId, userId, isHelpful);
      res.json(helpful);
    } catch (error) {
      res.status(400).json({ message: "Error al marcar reseña como útil" });
    }
  });

  // Coupons routes
  app.get("/api/coupons", async (req, res) => {
    try {
      const coupons = await storage.getCoupons();
      res.json(coupons);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener cupones" });
    }
  });

  app.get("/api/coupons/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const coupon = await storage.getCoupon(code);
      if (!coupon) {
        return res.status(404).json({ message: "Cupón no encontrado" });
      }
      res.json(coupon);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener cupón" });
    }
  });

  app.post("/api/coupons/validate", async (req, res) => {
    try {
      const { code, userId, total } = req.body;
      const validation = await storage.validateCoupon(code, userId, total);
      res.json(validation);
    } catch (error) {
      res.status(400).json({ message: "Error al validar cupón" });
    }
  });

  app.post("/api/coupons/apply", async (req, res) => {
    try {
      const { userId, couponId, orderId } = req.body;
      await storage.applyCoupon(userId, couponId, orderId);
      res.json({ message: "Cupón aplicado exitosamente" });
    } catch (error) {
      res.status(400).json({ message: "Error al aplicar cupón" });
    }
  });

  // Notifications routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const unreadOnly = req.query.unreadOnly === 'true';
      const notifications = await storage.getUserNotifications(userId, unreadOnly);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener notificaciones" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.json(notification);
    } catch (error) {
      res.status(400).json({ message: "Error al crear notificación" });
    }
  });

  app.patch("/api/notifications/:notificationId/read", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.notificationId);
      await storage.markNotificationRead(notificationId);
      res.json({ message: "Notificación marcada como leída" });
    } catch (error) {
      res.status(400).json({ message: "Error al marcar notificación como leída" });
    }
  });

  app.patch("/api/notifications/:userId/read-all", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.markAllNotificationsRead(userId);
      res.json({ message: "Todas las notificaciones marcadas como leídas" });
    } catch (error) {
      res.status(400).json({ message: "Error al marcar todas las notificaciones como leídas" });
    }
  });

  // Chat routes
  app.get("/api/chat/sessions", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const sessions = await storage.getChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener sesiones de chat" });
    }
  });

  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const sessionData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Error al crear sesión de chat" });
    }
  });

  app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener mensajes del chat" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const message = await storage.addChatMessage(messageData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Error al enviar mensaje" });
    }
  });

  app.patch("/api/chat/sessions/:sessionId", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const updates = req.body;
      const session = await storage.updateChatSession(sessionId, updates);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Error al actualizar sesión de chat" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
