"use client"

import { AnimeGrid } from "@/components/anime-grid"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export default function GeneroPage() {
  const params = useParams()
  const router = useRouter()
  const genero = decodeURIComponent(params.nombre as string)

  const handleVolver = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVolver}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Regresar</span>
          </Button>
          <h1 className="text-2xl font-bold">{genero}</h1>
        </div>

        <AnimeGrid title="Resultados de Búsqueda" showViewAll={false} selectedGenre={genero} hideGenres={true} />
      </div>
    </div>
  )
}
