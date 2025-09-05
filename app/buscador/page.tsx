"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimeGrid } from "@/components/anime-grid"
import { Search, Filter, X } from "lucide-react"
import { SidebarMenu } from "@/components/sidebar-menu"

export default function BuscadorPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Definimos los géneros con su nombre de visualización y su valor exacto para la base de datos
  const genres = [
    { display: "Acción", value: "Acción" },
    { display: "Artes Marciales", value: "Artes Marciales" },
    { display: "Aventura", value: "Aventura" },
    { display: "Ciencia Ficción", value: "Ciencia Ficción" },
    { display: "Comedia", value: "Comedia" },
    { display: "Deportes", value: "Deportes" },
    { display: "Detectives", value: "Detectives" },
    { display: "Drama", value: "Drama" },
    { display: "Ecchi", value: "Ecchi" },
    { display: "Espacio", value: "Espacio" },
    { display: "Escolar", value: "Escolar" },
    { display: "Fantasía", value: "Fantasía" },
    { display: "Gore", value: "Gore" },
    { display: "Harem", value: "Harem" },
    { display: "Hentai", value: "Hentai" },
    { display: "Histórico", value: "Histórico" },
    { display: "Horror", value: "Horror" },
    { display: "Isekai", value: "Isekai" },
    { display: "Josei", value: "Josei" },
    { display: "Juegos", value: "Juegos" },
    { display: "Mahou Shoujo", value: "Mahou Shoujo" },
    { display: "Mecha", value: "Mecha" },
    { display: "Militar", value: "Militar" },
    { display: "Misterio", value: "Misterio" },
    { display: "Mitológico", value: "Mitológico" },
    { display: "Música", value: "Música" },
    { display: "Parodia", value: "Parodia" },
    { display: "Psicológico", value: "Psicológico" },
    { display: "Recuerdos De La Vida", value: "Recuerdos De La Vida" },
    { display: "Romance", value: "Romance" },
    { display: "Samuráis", value: "Samuráis" },
    { display: "Seinen", value: "Seinen" },
    { display: "Shoujo", value: "Shoujo" },
    { display: "Shoujo Ai", value: "Shoujo Ai" },
    { display: "Shounen", value: "Shounen" },
    { display: "Shounen Ai", value: "Shounen Ai" },
    { display: "Sobrenatural", value: "Sobrenatural" },
    { display: "Súper Poderes", value: "Súper Poderes" },
    { display: "Suspenso", value: "Suspenso" },
    { display: "Vampiros", value: "Vampiros" },
  ]

  const statuses = ["En Emisión", "Finalizado", "En Pause"] // Cambié "Próximamente" por "En Pause"

  const types = ["TV", "OVA", "ONA", "Película", "Especial"]

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedGenre("all")
    setSelectedStatus("all")
    setSelectedType("all")
  }

  const clearGenreFilter = () => {
    setSelectedGenre("all")
  }

  const clearStatusFilter = () => {
    setSelectedStatus("all")
  }

  const clearTypeFilter = () => {
    setSelectedType("all")
  }

  // Función para obtener el nombre de visualización de un género a partir de su valor de BD
  const getGenreDisplayName = (value: string) => {
    const genre = genres.find((g) => g.value === value)
    return genre ? genre.display : value
  }

  return (
    <div className="container mx-auto px-4 pt-16 pb-24">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Géneros</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre.value} value={genre.value}>
                    {genre.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {" "}
                    {/* Mantener el valor exacto del estado */}
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {" "}
                    {/* Mantener el valor exacto del tipo */}
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filtros activos */}
        {(selectedGenre !== "all" || selectedStatus !== "all" || selectedType !== "all") && (
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Filtros activos:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-[#5271ff] hover:text-[#4461ee]"
              >
                Limpiar todo
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedGenre !== "all" && (
                <div className="bg-[#5271ff] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {getGenreDisplayName(selectedGenre)} {/* Usar la función para mostrar el nombre correcto */}
                  <button onClick={clearGenreFilter} className="hover:bg-white/20 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedStatus !== "all" && (
                <div className="bg-[#5271ff] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {selectedStatus}
                  <button onClick={clearStatusFilter} className="hover:bg-white/20 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {selectedType !== "all" && (
                <div className="bg-[#5271ff] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {selectedType}
                  <button onClick={clearTypeFilter} className="hover:bg-white/20 rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay filtros activos */}
        {selectedGenre === "all" && selectedStatus === "all" && selectedType === "all" && !searchQuery.trim() && (
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Usa los filtros de arriba para encontrar animes específicos</p>
          </div>
        )}

        <AnimeGrid
          title="Resultados de Búsqueda"
          showViewAll={false}
          searchQuery={searchQuery}
          selectedGenre={selectedGenre}
          selectedStatus={selectedStatus}
          selectedType={selectedType}
        />
      </div>

      <SidebarMenu />
    </div>
  )
}
