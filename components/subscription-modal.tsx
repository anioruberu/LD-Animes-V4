"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Crown, Shield } from "lucide-react"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999]">
      <Card className="w-full max-w-md bg-background border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-yellow-500" />
              </div>
              <h2 className="text-xl font-bold">Suscripción Premium</h2>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-10 w-10 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-foreground">¡Próximamente!</h3>

            <p className="text-muted-foreground mb-6">
              Las suscripciones no están disponibles en este momento. Estamos trabajando en traerte una experiencia sin
              anuncios.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-foreground mb-3">Función que vendrá:</h4>

              <div className="flex items-center justify-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Experiencia sin anuncios</span>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={onClose} className="w-full bg-[#5271ff] hover:bg-[#4461ee] text-white">
                Entendido
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
