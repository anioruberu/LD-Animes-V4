"use client"

import { AnimeGrid } from "@/components/anime-grid"
import { SidebarMenu } from "@/components/sidebar-menu"

export default function DirectorioPage() {
  return (
    <div className="container mx-auto px-4 pt-16 pb-24">
      <div className="space-y-8">
        <AnimeGrid title="Directorio" showViewAll={false} />
      </div>
      <SidebarMenu />
    </div>
  )
}
