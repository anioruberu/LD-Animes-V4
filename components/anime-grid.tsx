"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Play, ChevronRight, Eye, Flag, ChevronLeft, Shuffle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Anime {
  id: number
  title: string
  image: string
  score: number
  year: number
  status: string
  type: string
  episodes: number
  genres: string[]
  synopsis: string
  views?: number
  language?: string
}

interface AnimeGridProps {
  title: string
  showViewAll?: boolean
  searchQuery?: string
  selectedGenre?: string
  selectedStatus?: string
  selectedType?: string
  hideGenres?: boolean
}

export function AnimeGrid({
  title,
  showViewAll = true,
  searchQuery = "",
  selectedGenre = "all",
  selectedStatus = "all",
  selectedType = "all",
  hideGenres = false,
}: AnimeGridProps) {
  const [animes, setAnimes] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const router = useRouter()

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  const handleSurpriseMe = async () => {
    try {
      const response = await fetch("/api/anime/random")
      const data = await response.json()
      if (data.success && data.anime) {
        router.push(`/anime/${data.anime.id}`)
      }
    } catch (error) {
      console.error("Error getting random anime:", error)
    }
  }

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true)
      let url = "/api/anime?"

      if (title === "Animes Recientes") {
        url += "sort=recent"
      } else if (title === "Animes Más Vistos") {
        url += "sort=most-viewed"
      } else if (title === "Animes Más Populares") {
        url += "sort=most-popular"
      } else if (title === "Animes Latinos") {
        url += "sort=latino"
      } else if (title === "Resultados de Búsqueda") {
        if (searchQuery.trim()) url += `q=${encodeURIComponent(searchQuery)}&`
        if (selectedGenre !== "all") url += `genre=${encodeURIComponent(selectedGenre)}&`
        if (selectedStatus !== "all") url += `status=${encodeURIComponent(selectedStatus)}&`
        if (selectedType !== "all") url += `type=${encodeURIComponent(selectedType)}&`
      } else if (title === "Directorio") {
        url += `directory=true&page=${currentPage}&limit=24&`
        if (searchQuery.trim()) url += `q=${encodeURIComponent(searchQuery)}&`
        if (selectedGenre !== "all") url += `genre=${encodeURIComponent(selectedGenre)}&`
        if (selectedStatus !== "all") url += `status=${encodeURIComponent(selectedStatus)}&`
        if (selectedType !== "all") url += `type=${encodeURIComponent(selectedType)}&`
      }

      try {
        const response = await fetch(url)
        const data = await response.json()
        setAnimes(data.data)
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages)
          setTotalItems(data.pagination.totalItems)
        }
      } catch (error) {
        console.error("Error fetching animes:", error)
        setAnimes([])
      } finally {
        setLoading(false)
      }
    }

    fetchAnimes()
  }, [title, searchQuery, selectedGenre, selectedStatus, selectedType, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    const end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showViewAll && <div className="h-10 w-24 bg-muted rounded animate-pulse" />}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-[3/4] bg-muted rounded-t-lg" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          {title === "Animes Recientes" && (
            <span className="text-green-500">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
          {title === "Animes Latinos" && (
            <span className="text-red-500">
              <Flag className="h-6 w-6" />
            </span>
          )}
          {title === "Animes Más Vistos" && (
            <span className="text-purple-500">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
          {title === "Animes Más Populares" && (
            <span className="text-yellow-500">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
          )}
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {title === "Directorio" && (
            <Button onClick={handleSurpriseMe} className="bg-[#5271ff] hover:bg-[#4461ee] text-white" size="sm">
              <Shuffle className="h-4 w-4 mr-2" />
              Aleatorio
            </Button>
          )}
          {showViewAll && (
            <Button variant="ghost" className="text-[#5271ff] hover:text-[#4461ee]">
              Ver Todo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {title === "Directorio" && (
        <div className="px-4 text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
      )}

      {searchQuery.trim() && animes.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No hay resultados para "{searchQuery}"</h3>
          <p className="text-muted-foreground">Intenta con otro término de búsqueda o revisa la ortografía.</p>
        </div>
      ) : (
        <>
          {title === "Resultados de Búsqueda" || title === "Directorio" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 px-4">
              {animes.map((anime) => (
                <Link key={anime.id} href={`/anime/${anime.id}`}>
                  <Card className="anime-card cursor-pointer group">
                    <CardContent className="p-0">
                      <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                        <Image
                          src={anime.image || "/placeholder.svg"}
                          alt={anime.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          unoptimized
                        />
                        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-[#5271ff] hover:bg-[#4461ee]">
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="text-xs">
                            {anime.year}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {anime.title}
                        </h3>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{anime.score}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3 text-[#5271ff]" />
                            <span>{formatViews(anime.views || 0)}</span>
                          </div>
                        </div>

                        {!hideGenres && (
                          <div className="flex flex-wrap gap-1">
                            {anime.genres.slice(0, 3).map((genre) => (
                              <Badge key={genre} variant="outline" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 px-4 pb-2" style={{ width: "max-content" }}>
                {animes.map((anime) => (
                  <Link key={anime.id} href={`/anime/${anime.id}`} className="flex-shrink-0">
                    <Card className="anime-card cursor-pointer group w-[160px]">
                      <CardContent className="p-0">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                          <Image
                            src={anime.image || "/placeholder.svg"}
                            alt={anime.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-[#5271ff] hover:bg-[#4461ee]">
                                <Play className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs">
                              {anime.year}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#5271ff] transition-colors">
                            {anime.title}
                          </h3>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            {title === "Animes Más Populares" && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{anime.score}</span>
                              </div>
                            )}
                            {title === "Animes Más Vistos" && (
                              <div className="flex items-center space-x-1">
                                <Eye className="h-3 w-3 text-[#5271ff]" />
                                <span>{formatViews(anime.views || 0)}</span>
                              </div>
                            )}
                          </div>

                          {!hideGenres && (
                            <div className="flex flex-wrap gap-1">
                              {anime.genres.slice(0, 2).map((genre) => (
                                <Badge key={genre} variant="outline" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {title === "Directorio" && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 px-4 py-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex space-x-1">
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "bg-[#5271ff] hover:bg-[#4461ee]" : ""}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  )
}
