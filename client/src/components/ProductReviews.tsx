import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProductReviewsProps {
  productId: number;
}

interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string | null;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['/api/reviews', productId],
    queryFn: () => api.getProductReviews(productId),
  });

  const addReviewMutation = useMutation({
    mutationFn: () => api.addReview(user!.id, productId, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', productId] });
      setShowReviewForm(false);
      setRating(0);
      setComment("");
      toast({
        title: "Reseña agregada",
        description: "Tu reseña ha sido publicada exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agregar la reseña",
        variant: "destructive",
      });
    },
  });

  const markHelpfulMutation = useMutation({
    mutationFn: ({ reviewId, isHelpful }: { reviewId: number; isHelpful: boolean }) =>
      api.markReviewHelpful(reviewId, user!.id, isHelpful),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', productId] });
      toast({
        title: "Gracias por tu feedback",
        description: "Tu opinión sobre esta reseña ha sido registrada",
      });
    },
  });

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
            onClick={interactive && onRate ? () => onRate(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: Review) => sum + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            Reseñas y Calificaciones
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                ({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        
        {user && (
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {showReviewForm ? "Cancelar" : "Escribir Reseña"}
          </Button>
        )}
      </div>

      {showReviewForm && (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100">
              Agregar Reseña
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                Calificación
              </label>
              {renderStars(rating, true, setRating)}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                Comentario (opcional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia con este producto..."
                className="border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
                rows={4}
              />
            </div>
            
            <Button
              onClick={() => addReviewMutation.mutate()}
              disabled={rating === 0 || addReviewMutation.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {addReviewMutation.isPending ? "Publicando..." : "Publicar Reseña"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="border-purple-200 dark:border-purple-800">
            <CardContent className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">
                Aún no hay reseñas para este producto.
              </p>
              {user && (
                <p className="text-purple-600 dark:text-purple-400 mt-2">
                  ¡Sé el primero en escribir una reseña!
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          reviews.map((review: Review) => (
            <Card key={review.id} className="border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {renderStars(review.rating)}
                    {review.isVerifiedPurchase && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Compra verificada
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {review.comment}
                  </p>
                )}
                
                {user && user.id !== review.userId && (
                  <div className="flex items-center gap-2 pt-3 border-t border-purple-100 dark:border-purple-800">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ¿Te resultó útil esta reseña?
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markHelpfulMutation.mutate({ reviewId: review.id, isHelpful: true })}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Sí
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markHelpfulMutation.mutate({ reviewId: review.id, isHelpful: false })}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      No
                    </Button>
                    {review.helpfulCount > 0 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                        {review.helpfulCount} persona{review.helpfulCount !== 1 ? 's' : ''} encontró esto útil
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}