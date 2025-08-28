"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, FileText } from "lucide-react"
import { useEffect } from "react"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.height = "100%"
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""
    }

    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
      document.body.style.height = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999]">
      <Card className="w-full max-w-4xl bg-background border-border max-h-[90vh] overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-background sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Términos y Condiciones</h2>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
          </div>

          <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4 text-sm leading-relaxed">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">1. Descripción del Servicio</h3>
              <p>
                "LD Animes" es una app que proporciona acceso a contenido de anime a través de enlaces a servidores
                externos. No somos responsables de la disponibilidad, calidad o legalidad del contenido.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">2. Reporte de Problemas</h3>
              <p>
                Sin embargo, si experimentas fallos en la calidad de video u otros problemas, te pedimos que lo reportes
                para que podamos solucionarlo.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">3. Almacenamiento de Contenido</h3>
              <p>
                La app no almacena ningún video o archivos en su sitio web. No somos fansub, el contenido es tomado de
                sitios web gratuitos y proporcionado por terceros.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">4. Limitación de Responsabilidad</h3>
              <p>
                Al usar "LD Animes", aceptas que no nos hacemos responsables de problemas con la descarga o
                visualización de contenido de anime desde estos servidores externos.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">5. Publicidad</h3>
              <p>
                La app contiene anuncios para financiar el proyecto y mantener la aplicación en funcionamiento.
                Agradecemos tu comprensión y apoyo.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">6. Privacidad</h3>
              <p>La app no recoge datos personales del usuario y no comparte información con terceros.</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">7. Contacto</h3>
              <p>Si tienes alguna pregunta sobre estos Términos de Uso, por favor contáctanos en:</p>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-medium">anioruberu.contacto@gmail.com</p>
                <p className="font-medium">ldanimes.contacto@gmail.com</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-border bg-background">
            <Button onClick={onClose} className="w-full bg-[#5271ff] hover:bg-[#4461ee] text-white h-12">
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
