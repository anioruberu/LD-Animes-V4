"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Lock } from "lucide-react"
import { useEffect } from "react"

interface PrivacyPolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">Política de Privacidad</h2>
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
            <p>Por favor, lee detenidamente nuestra política de privacidad antes de usar nuestra aplicación.</p>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">1. Información que recopilamos</h3>

              <div className="space-y-3">
                <h4 className="font-medium">1.1 Información proporcionada por el usuario</h4>
                <p>
                  Actualmente, LD Animes no requiere que los usuarios creen cuentas o proporcionen información personal
                  para utilizar la aplicación. Todas las funciones, como favoritos e historial de visualización, se
                  almacenan localmente en su dispositivo.
                </p>

                <h4 className="font-medium">1.2 Información recopilada automáticamente</h4>
                <p>
                  LD Animes no recopila ninguna información personal de los usuarios. Nuestra aplicación está diseñada
                  para funcionar completamente de manera local en su dispositivo, sin enviar datos a nuestros
                  servidores.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">2. Cómo utilizamos su información</h3>
              <p>
                Como no recopilamos información personal de los usuarios, no utilizamos ni procesamos ningún dato
                personal. Todas las funcionalidades de la aplicación operan localmente en su dispositivo.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">3. Almacenamiento de datos locales</h3>
              <p>LD Animes almacena ciertos datos localmente en su dispositivo, incluyendo:</p>
              <div className="bg-muted/50 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-1">
                  <li>Lista de animes favoritos</li>
                  <li>Lista de animes que estás viendo</li>
                  <li>Lista de animes ya vistos</li>
                  <li>Historial de visualización</li>
                  <li>Preferencias de configuración</li>
                </ul>
              </div>
              <p>
                Estos datos se almacenan únicamente en su dispositivo y no se sincronizan con nuestros servidores. Si
                desinstala la aplicación, estos datos se eliminarán permanentemente.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">4. Compartir información</h3>
              <p>
                Como no recopilamos información personal, no compartimos, vendemos, intercambiamos ni transferimos datos
                de usuarios a terceros.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">5. Seguridad de los datos</h3>
              <p>
                Dado que todos los datos se almacenan localmente en su dispositivo, usted mantiene el control total
                sobre su información. Recomendamos mantener su dispositivo actualizado con las últimas actualizaciones
                de seguridad para proteger sus datos locales.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">6. Derechos de los usuarios</h3>
              <p>
                Como no recopilamos ni procesamos información personal, no hay datos personales sobre los cuales ejercer
                derechos. Sin embargo, si tiene alguna pregunta o inquietud, puede contactarnos a través de la
                información proporcionada al final de esta política.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">7. Menores de edad</h3>
              <p>
                LD Animes está destinado a usuarios de todas las edades, pero recomendamos que los menores de 13 años
                utilicen nuestra aplicación bajo la supervisión de un padre o tutor.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">8. Cambios a esta política</h3>
              <p>
                Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio
                publicando la nueva Política de Privacidad en esta página y, si los cambios son significativos,
                proporcionaremos un aviso más prominente o le enviaremos una notificación directa.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">9. Contenido y derechos de autor</h3>
              <p>
                LD Animes es una aplicación que proporciona enlaces a contenido de anime disponible en Internet. No
                alojamos ni almacenamos ningún contenido con derechos de autor en nuestros servidores. Respetamos los
                derechos de propiedad intelectual y esperamos que nuestros usuarios hagan lo mismo.
              </p>
              <p>
                Si usted es propietario de derechos de autor y cree que algún contenido enlazado a través de nuestra
                aplicación infringe sus derechos, contáctenos y tomaremos las medidas apropiadas.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">10. Contacto</h3>
              <p>
                Si tiene preguntas o inquietudes sobre esta Política de Privacidad o nuestras prácticas de privacidad,
                contáctenos en:
              </p>
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
