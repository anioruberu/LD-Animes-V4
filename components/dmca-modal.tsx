"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Shield } from "lucide-react"
import { useEffect } from "react"

interface DMCAModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DMCAModal({ isOpen, onClose }: DMCAModalProps) {
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">DMCA</h2>
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
            <p>
              Esta App "LD Animes" rechaza totalmente cualquier intento de violación de derechos de autor, así como
              también protege y respalda los derechos de los propietarios y cualquier otra legalidad a los que se vean
              inmersos.
            </p>

            <p>
              En consecuencia este sitio web recopila archivos de videos que ya se encuentran alojados en
              streamango.com, openload.co, Terabox, Mega, sevenload.com, vipshare.org, idowatch.net.com, YouTube.com,
              Rapidvideo, powvideo.net, netu.tv, cloudy.ec, GoogleDrive.com entre otras webs similares.
            </p>

            <p>
              Por consiguiente "LD Animes" es una App que brinda fácil acceso a la información y contenido de los videos
              mediante el uso de "Inserción de Videos" o API Keys permitidas por la Play Store que claramente no se
              encuentra tipificado como una infracción a los derechos de autor, esto según sentencias del Séptimo
              Tribunal de Apelaciones.
            </p>

            <p>
              La App no sube ni almacena en su sitio o servidor, cualquier archivo de anime, película, videos, archivo
              multimedia en ninguno de sus tipos (avi, mov, flv, mpg, mpeg, divx, mp3, mp4, mkv, torrent, iPod, PSP) o
              cualquier otro tipo de material que se encuentre protegidos por derechos de autor.
            </p>

            <p>
              El único material que se encuentra en la App son enlaces a los contenidos ya mencionados, facilitando así
              su visualización.
            </p>

            <p>
              "LD Animes" no aprueba, ni hace posesión de información, datos, contenido, servicios, productos,
              opiniones, archivos y cualquier otra clase de material que se encuentre alojados en los servidores de
              Rapidvideo, Streamango, Openload, Terabox, Mega, YouTube, Veoh, Megavideo, Tutv, etc.
            </p>

            <p>
              "LD Animes" está de acuerdo con 17 USC § 512 y la Digital Millennium Copyright Act ("DMCA"). Es nuestra
              política responder a cualquier notificación de infracción y tomar las acciones apropiadas bajo la Digital
              Millennium Copyright Act ("DMCA") y otras leyes de propiedad intelectual aplicables.
            </p>

            <p>
              Si considera que su contenido con derechos de autor ha sido publicado, infringido o violado, en "LD
              Animes", deberá ponerse en contacto con nuestro agente de Copyright, por escrito brindando la siguiente
              información:
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <p>
                <strong>I.</strong> Una firma física o electrónica de una persona autorizada para actuar en nombre del
                propietario de un derecho exclusivo que presuntamente ha sido vulnerado.
              </p>

              <p>
                <strong>II.</strong> Identificación del material protegido por derechos de autor que se refiere han sido
                infringidas, o, si diversos contenidos en el sitio web están cubiertas por una sola notificación, una
                lista representativa de dicho contenido en dicha página web.
              </p>

              <p>
                <strong>III.</strong> Identificación del material que se declara estar infringiendo y que debe ser
                removido o cuyo acceso debe ser inhabilitado, así como también la información suficiente para permitir
                la ubicación del contenido. Incluyendo la URL en el cuerpo del correo electrónico, siendo esta la única
                manera de localizarla.
              </p>

              <p>
                <strong>IV.</strong> Proporcione su dirección postal, número de teléfono y dirección de correo
                electrónico, para permitir que "LD Animes" pueda contactarse con la parte demandante.
              </p>

              <p>
                <strong>V.</strong> Una dirección de correo electrónica válida username@copyrightcompany ayudará a
                testificar que está representando o que es el dueño legítimo de los derechos de autor.
              </p>

              <p>
                <strong>VI.</strong> Los correos deberán ser enviados a <strong>anioruberu.contacto@gmail.com</strong> o{" "}
                <strong>ldanimes.contacto@gmail.com</strong> o de lo contrario no serán procesados.
              </p>
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
