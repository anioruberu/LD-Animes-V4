"use client"

import { AnimeGrid } from "@/components/anime-grid"
import { SidebarMenu } from "@/components/sidebar-menu"
import { ContinueWatchingGrid } from "@/components/continue-watching-grid" // Importar el nuevo componente

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="pt-16 space-y-8">
        {/* Nueva sección: Seguir Viendo - Se ocultará automáticamente si no hay historial */}
        <ContinueWatchingGrid />

        {/* Animes Recientes - En Emisión */}
        <AnimeGrid title="Animes Recientes" showViewAll={false} />

        {/* Animes Latinos - Con servidor latino */}
        <AnimeGrid title="Animes Latinos" showViewAll={false} />

        {/* Animes Más Vistos - Por número de vistas */}
        <AnimeGrid title="Animes Más Vistos" showViewAll={false} />

        {/* Animes Más Populares - Por calificación */}
        <AnimeGrid title="Animes Más Populares" showViewAll={false} />
      </div>

      <SidebarMenu />

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
