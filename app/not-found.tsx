"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold text-[#5271ff]">404</h1>
          <h2 className="text-2xl font-semibold">Página no encontrada</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-[#5271ff] hover:bg-[#4461ee]">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Ir al inicio
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver atrás
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground">
            ¿Necesitas ayuda? Puedes explorar nuestro{" "}
            <Link href="/directorio" className="text-[#5271ff] hover:underline">
              directorio de animes
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
