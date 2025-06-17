import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Send, X, Minimize2, Maximize2, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ChatSession {
  id: number;
  userId: number | null;
  visitorId: string | null;
  status: string;
  priority: string;
  assignedAgent: string | null;
  subject: string | null;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

interface ChatMessage {
  id: number;
  sessionId: number;
  senderId: number | null;
  senderType: string;
  message: string;
  messageType: string;
  isRead: boolean;
  createdAt: string;
}

export default function LiveChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState("");
  const [initialSubject, setInitialSubject] = useState("");

  const { data: sessions = [] } = useQuery({
    queryKey: ['/api/chat/sessions', user?.id],
    queryFn: () => api.getChatSessions(user?.id),
    enabled: !!user && isOpen,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/chat/messages', currentSession?.id],
    queryFn: () => api.getChatMessages(currentSession!.id),
    enabled: !!currentSession,
    refetchInterval: 3000, // Poll for new messages every 3 seconds
  });

  const createSessionMutation = useMutation({
    mutationFn: (sessionData: any) => api.createChatSession(sessionData),
    onSuccess: (newSession) => {
      setCurrentSession(newSession);
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions'] });
      toast({
        title: "Chat iniciado",
        description: "Un agente se conectará contigo pronto",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (messageData: any) => api.sendChatMessage(messageData),
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ['/api/chat/messages', currentSession?.id] });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: ({ sessionId, updates }: { sessionId: number; updates: any }) =>
      api.updateChatSession(sessionId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/sessions'] });
    },
  });

  useEffect(() => {
    if (isOpen && user && sessions.length === 0) {
      // Check for active sessions when opening chat
      const activeSession = sessions.find((s: ChatSession) => s.status === 'active');
      if (activeSession) {
        setCurrentSession(activeSession);
      }
    }
  }, [isOpen, user, sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startNewChat = () => {
    const sessionData = {
      userId: user?.id || null,
      visitorId: user ? null : `visitor_${Date.now()}`,
      status: "active",
      priority: "normal",
      subject: initialSubject || "Consulta general",
    };

    createSessionMutation.mutate(sessionData);
  };

  const sendMessage = () => {
    if (!message.trim() || !currentSession) return;

    const messageData = {
      sessionId: currentSession.id,
      senderId: user?.id || null,
      senderType: user ? "user" : "visitor",
      message: message.trim(),
      messageType: "text",
    };

    sendMessageMutation.mutate(messageData);
  };

  const endChat = () => {
    if (!currentSession) return;

    updateSessionMutation.mutate({
      sessionId: currentSession.id,
      updates: { status: "closed", closedAt: new Date() },
    });

    setCurrentSession(null);
    setIsOpen(false);
    toast({
      title: "Chat finalizado",
      description: "La sesión de chat ha sido cerrada",
    });
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'resolved':
        return 'bg-blue-500';
      case 'closed':
        return 'bg-gray-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const ChatWidget = () => (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card className={`w-80 shadow-xl border-purple-200 dark:border-purple-800 transition-all duration-300 ${
          isMinimized ? 'h-14' : 'h-96'
        }`}>
          <CardHeader className="p-3 bg-purple-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(currentSession?.status || 'active')}`}></div>
                <CardTitle className="text-sm">
                  {currentSession ? 'Chat en vivo' : 'Soporte al cliente'}
                </CardTitle>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-purple-700 p-1 h-auto"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-purple-700 p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {currentSession && (
              <div className="text-xs opacity-90">
                {currentSession.assignedAgent ? `Con ${currentSession.assignedAgent}` : 'Conectando...'}
              </div>
            )}
          </CardHeader>

          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-80">
              {!currentSession ? (
                <div className="flex-1 p-4 space-y-4">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                      ¿Necesitas ayuda?
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Inicia una conversación con nuestro equipo de soporte
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <Textarea
                      placeholder="¿En qué podemos ayudarte? (opcional)"
                      value={initialSubject}
                      onChange={(e) => setInitialSubject(e.target.value)}
                      className="border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
                      rows={3}
                    />
                    
                    <Button
                      onClick={startNewChat}
                      disabled={createSessionMutation.isPending}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {createSessionMutation.isPending ? "Conectando..." : "Iniciar Chat"}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 p-3">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          La conversación ha comenzado
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messages.map((msg: ChatMessage) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.senderType === 'user' || msg.senderType === 'visitor' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] p-2 rounded-lg text-sm ${
                                msg.senderType === 'user' || msg.senderType === 'visitor'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                {msg.senderType === 'agent' && <Bot className="w-3 h-3" />}
                                {(msg.senderType === 'user' || msg.senderType === 'visitor') && <User className="w-3 h-3" />}
                                <span className="text-xs opacity-75">
                                  {msg.senderType === 'agent' ? 'Soporte' : 'Tú'}
                                </span>
                                <span className="text-xs opacity-50 ml-auto">
                                  {formatMessageTime(msg.createdAt)}
                                </span>
                              </div>
                              <p>{msg.message}</p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-3 border-t border-purple-200 dark:border-purple-800">
                    <div className="flex gap-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!message.trim() || sendMessageMutation.isPending}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          currentSession.status === 'active' 
                            ? 'text-green-600 border-green-300' 
                            : 'text-gray-600 border-gray-300'
                        }`}
                      >
                        {currentSession.status === 'active' ? 'En línea' : 'Desconectado'}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={endChat}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
                      >
                        Finalizar chat
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );

  return <ChatWidget />;
}