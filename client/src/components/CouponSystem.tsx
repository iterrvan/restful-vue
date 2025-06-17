import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Tag, Check, X, Percent, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CouponSystemProps {
  total: number;
  onCouponApplied: (discount: number, coupon: any) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: any;
}

interface Coupon {
  id: number;
  code: string;
  name: string;
  description: string;
  type: string;
  value: string;
  minimumAmount: string | null;
  maxDiscount: string | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string | null;
}

export default function CouponSystem({ 
  total, 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon 
}: CouponSystemProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const validateCouponMutation = useMutation({
    mutationFn: (code: string) => api.validateCoupon(code, user!.id, total),
    onSuccess: (result) => {
      setIsValidating(false);
      if (result.valid) {
        onCouponApplied(result.discount, result.coupon);
        setCouponCode("");
        toast({
          title: "¡Cupón aplicado!",
          description: `Descuento de $${result.discount.toFixed(2)} aplicado`,
        });
      } else {
        toast({
          title: "Cupón inválido",
          description: "El cupón no es válido o no cumple los requisitos",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      setIsValidating(false);
      toast({
        title: "Error",
        description: "No se pudo validar el cupón",
        variant: "destructive",
      });
    },
  });

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Código requerido",
        description: "Por favor ingresa un código de cupón",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para usar cupones",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    validateCouponMutation.mutate(couponCode.toUpperCase());
  };

  const handleRemoveCoupon = () => {
    onCouponRemoved();
    toast({
      title: "Cupón removido",
      description: "El descuento ha sido removido del pedido",
    });
  };

  const calculateDiscount = (coupon: Coupon, orderTotal: number) => {
    if (coupon.type === 'percentage') {
      let discount = (orderTotal * parseFloat(coupon.value)) / 100;
      if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
        discount = parseFloat(coupon.maxDiscount);
      }
      return discount;
    } else {
      return parseFloat(coupon.value);
    }
  };

  const formatCouponValue = (coupon: Coupon) => {
    if (coupon.type === 'percentage') {
      return `${coupon.value}% de descuento`;
    } else {
      return `$${parseFloat(coupon.value).toFixed(2)} de descuento`;
    }
  };

  const isExpired = (coupon: Coupon) => {
    if (!coupon.validUntil) return false;
    return new Date() > new Date(coupon.validUntil);
  };

  const meetsMinimum = (coupon: Coupon, orderTotal: number) => {
    if (!coupon.minimumAmount) return true;
    return orderTotal >= parseFloat(coupon.minimumAmount);
  };

  const isAvailable = (coupon: Coupon) => {
    if (!coupon.usageLimit) return true;
    return coupon.usedCount < coupon.usageLimit;
  };

  return (
    <div className="space-y-4">
      {appliedCoupon ? (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-900 dark:text-green-100">
                      {appliedCoupon.code}
                    </span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      Aplicado
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {appliedCoupon.name}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {formatCouponValue(appliedCoupon)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-300 dark:hover:text-green-200 dark:hover:bg-green-900/30"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                  ¿Tienes un cupón de descuento?
                </h3>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ingresa tu código"
                    className="flex-1 border-purple-200 dark:border-purple-700 focus:border-purple-500 dark:focus:border-purple-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isValidating || !couponCode.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {isValidating ? "Validando..." : "Aplicar"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cupones sugeridos */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-purple-900 dark:text-purple-100">
          Cupones disponibles
        </h4>
        
        <div className="grid gap-2">
          {/* Cupón de bienvenida */}
          <Card className="border-purple-100 dark:border-purple-900 hover:border-purple-200 dark:hover:border-purple-800 transition-colors cursor-pointer"
                onClick={() => setCouponCode("BIENVENIDO10")}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-purple-900 dark:text-purple-100">
                        BIENVENIDO10
                      </span>
                      <Badge variant="outline" className="text-xs">
                        10% OFF
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      10% de descuento para nuevos clientes
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Mínimo $50
                    </p>
                  </div>
                </div>
                {meetsMinimum({ minimumAmount: "50.00" } as Coupon, total) ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                    Disponible
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Mínimo $50
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cupón de verano */}
          <Card className="border-purple-100 dark:border-purple-900 hover:border-purple-200 dark:hover:border-purple-800 transition-colors cursor-pointer"
                onClick={() => setCouponCode("VERANO25")}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Percent className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-purple-900 dark:text-purple-100">
                        VERANO25
                      </span>
                      <Badge variant="outline" className="text-xs">
                        25% OFF
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      25% de descuento en productos seleccionados
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Mínimo $100 • Máximo $50 de descuento
                    </p>
                  </div>
                </div>
                {meetsMinimum({ minimumAmount: "100.00" } as Coupon, total) ? (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                    Disponible
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Mínimo $100
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}