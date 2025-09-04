"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DisqusComments } from "@/components/disqus-comments"
import {
  Star,
  Heart,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Eye,
  Languages,
  Flag,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Wifi,
  WifiOff,
  Play,
  Plus,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

// Eliminar la propiedad 'thumbnail' de la interfaz Episode
interface Episode {
  id: number
  number: number
}

interface AnimeDetails {
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
  views: number
  studio: string
  duration: string
  episodeList: Episode[] // Esto se generará en base al conteo de 'episodes'
  // Añadir la propiedad episodesLinks
  episodesLinks: {
    subtitulado: string[]
    "español latino": string[]
  }
}

export default function AnimePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [anime, setAnime] = useState<AnimeDetails | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [selectedLanguage, setSelectedLanguage] = useState("subtitulado")
  const [notification, setNotification] = useState("")
  const [showReportModal, setShowReportModal] = useState(false)
  const [reportProblem, setReportProblem] = useState("")
  const [reportExplanation, setReportExplanation] = useState("")
  const [isSubmittingReport, setIsSubmittingReport] = useState(false)
  const [showFullSynopsis, setShowFullSynopsis] = useState(false)
  const [recommendedAnimes, setRecommendedAnimes] = useState<AnimeDetails[]>([])

  const [scrollPosition, setScrollPosition] = useState(0)

  // NUEVO: Estado para controlar la visibilidad del overlay del episodio
  const [showEpisodeOverlay, setShowEpisodeOverlay] = useState(true)

  // Estados para las listas
  const [isFavorite, setIsFavorite] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isWatching, setIsWatching] = useState(false)

  // Estados para el reproductor
  const [videoStatus, setVideoStatus] = useState<"loading" | "loaded" | "error" | "reconnected">("loading")
  const [isOnline, setIsOnline] = useState(true)
  const [videoMessage, setVideoMessage] = useState("")
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  const reportOptions = [
    "Problema con subtítulos",
    "Episodio incorrecto o repetido",
    "Problema con audio",
    "Episodio caído",
  ]

  // Función para manejar el regreso
  const handleGoBack = () => {
    // Intentar usar el historial del navegador primero
    if (window.history.length > 1) {
      router.back()
    } else {
      // Si no hay historial, ir a la página de inicio
      router.push("/")
    }
  }

  // Detectar conexión a internet
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (videoStatus === "error") {
        setVideoStatus("reconnected")
        setVideoMessage("Reconectado")
        setTimeout(() => {
          setVideoMessage("")
          setVideoStatus("loading")
          // Intentar recargar el video
          setTimeout(() => {
            setVideoStatus("loaded")
          }, 2000)
        }, 2000)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setVideoStatus("error")
      setVideoMessage("Error de conexión o error del video, reportarlo.")
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [videoStatus])

  // Función para obtener animes recomendados
  const fetchRecommendedAnimes = async (currentAnimeGenres: string[], currentAnimeId: number) => {
    try {
      const response = await fetch("/api/anime")
      const data = await response.json()

      // Filtrar animes que tengan al menos un género en común
      const recommended = data.data
        .filter(
          (anime: AnimeDetails) =>
            anime.id !== currentAnimeId && // Excluir el anime actual
            anime.genres.some((genre) => currentAnimeGenres.includes(genre)),
        )
        .sort((a: AnimeDetails, b: AnimeDetails) => {
          // Ordenar por número de géneros en común (más relevantes primero)
          const aCommonGenres = a.genres.filter((genre) => currentAnimeGenres.includes(genre)).length
          const bCommonGenres = b.genres.filter((genre) => currentAnimeGenres.includes(genre)).length
          return bCommonGenres - aCommonGenres
        })
        .slice(0, 6) // Mostrar solo 6 recomendaciones

      setRecommendedAnimes(recommended)
    } catch (error) {
      console.error("Error fetching recommended animes:", error)
      setRecommendedAnimes([])
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []) // Removido params.id para que siempre resetee al montar

  // 1) Cargar datos del anime (solo cambia con el id)
  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`/api/anime?id=${params.id}`)
        if (!response.ok) {
          throw new Error("Anime not found")
        }
        const data = await response.json()
        const fetchedAnime: AnimeDetails = data.data

        // Generar la lista de episodios sin thumbnails
        fetchedAnime.episodeList = Array.from({ length: fetchedAnime.episodes }, (_, i) => ({
          id: i + 1,
          number: i + 1,
        }))

        setAnime(fetchedAnime)

        // Obtener animes recomendados
        fetchRecommendedAnimes(fetchedAnime.genres, fetchedAnime.id)

        // Actualizar flags de listas (solo una vez)
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        const watching = JSON.parse(localStorage.getItem("watching") || "[]")
        const completed = JSON.parse(localStorage.getItem("completed") || "[]")

        setIsFavorite(favorites.some((i: any) => i.id === fetchedAnime.id))
        setIsWatching(watching.some((i: any) => i.id === fetchedAnime.id))
        setIsCompleted(completed.some((i: any) => i.id === fetchedAnime.id))
      } catch (error) {
        console.error("Error fetching anime details:", error)
        setAnime(null) // Set anime to null on error to show loading/error state
      }
    }
    fetchAnimeDetails()
  }, [params.id])

  // 2) Detectar ?episode= en la URL UNA sola vez
  const handledEpisodeRef = useRef(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!anime || handledEpisodeRef.current) return
    const ep = Number(searchParams.get("episode") || 1)
    if (ep >= 1 && ep <= anime.episodes) {
      setCurrentEpisode(ep)

      // Seleccionar automáticamente un idioma disponible
      const hasSubtitulado = anime.episodesLinks.subtitulado && anime.episodesLinks.subtitulado[ep - 1]
      const hasLatino = anime.episodesLinks["español latino"] && anime.episodesLinks["español latino"][ep - 1]

      if (hasSubtitulado && !hasLatino) {
        setSelectedLanguage("subtitulado")
      } else if (hasLatino && !hasSubtitulado) {
        setSelectedLanguage("latino")
      } else if (hasSubtitulado) {
        setSelectedLanguage("subtitulado") // Preferir subtitulado por defecto
      }

      addToHistory(ep)
    }
    handledEpisodeRef.current = true
  }, [anime, searchParams])

  // Manejar cambio de episodio y idioma con reconexión automática
  useEffect(() => {
    if (anime) {
      setVideoStatus("loading")
      setVideoMessage("Cargando vídeo...")
      setReconnectAttempts(0)

      // Simular tiempo de carga
      const timer = setTimeout(() => {
        const currentLink =
          selectedLanguage === "subtitulado"
            ? anime.episodesLinks.subtitulado[currentEpisode - 1]
            : anime.episodesLinks["español latino"][currentEpisode - 1]

        if (currentLink && isOnline) {
          setVideoStatus("loaded")
          setVideoMessage("")
        } else {
          setVideoStatus("error")
          setVideoMessage("Error de conexión o error del video, reportarlo.")

          // Intentar reconectar automáticamente
          if (reconnectAttempts < 3) {
            setTimeout(() => {
              setReconnectAttempts((prev) => prev + 1)
              setVideoStatus("loading")
              setVideoMessage("Intentando reconectar...")
            }, 3000)
          }
        }
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [currentEpisode, selectedLanguage, anime, isOnline, reconnectAttempts])

  // NUEVO: Efecto para mostrar y ocultar el overlay del episodio
  useEffect(() => {
    if (videoStatus === "loaded") {
      setShowEpisodeOverlay(true) // Mostrar el overlay solo cuando el video esté cargado
      const timer = setTimeout(() => {
        setShowEpisodeOverlay(false) // Ocultar después de 3 segundos
      }, 3000) // 3 segundos

      return () => clearTimeout(timer) // Limpiar el temporizador
    } else {
      setShowEpisodeOverlay(false) // Asegurarse de que esté oculto si no está cargado
    }
  }, [currentEpisode, selectedLanguage, videoStatus]) // Añadir videoStatus a las dependencias

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        // Entering fullscreen - save current scroll position
        setScrollPosition(window.scrollY)
      } else {
        // Exiting fullscreen - restore scroll position after a brief delay
        setTimeout(() => {
          window.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          })
        }, 100)
      }
    }

    // Add event listeners for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
    document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    document.addEventListener("MSFullscreenChange", handleFullscreenChange)

    return () => {
      // Cleanup event listeners
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange)
    }
  }, [scrollPosition])

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  const toggleFavorite = () => {
    if (!anime) return

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const animeData = {
      id: anime.id,
      name: anime.title,
      image: anime.image,
      url: `/anime/${anime.id}`,
    }

    if (isFavorite) {
      const newFavorites = favorites.filter((item: any) => item.id !== anime.id)
      localStorage.setItem("favorites", JSON.stringify(newFavorites))
      setIsFavorite(false)
      showNotification("Eliminado de favoritos")
    } else {
      favorites.push(animeData)
      localStorage.setItem("favorites", JSON.stringify(favorites))
      setIsFavorite(true)
      showNotification("Agregado a favoritos")
    }
  }

  const toggleCompleted = () => {
    if (!anime) return

    const completed = JSON.parse(localStorage.getItem("completed") || "[]")
    const animeData = {
      id: anime.id,
      name: anime.title,
      image: anime.image,
      url: `/anime/${anime.id}`,
    }

    if (isCompleted) {
      const newCompleted = completed.filter((item: any) => item.id !== anime.id)
      localStorage.setItem("completed", JSON.stringify(newCompleted))
      setIsCompleted(false)
      showNotification("Eliminado de terminados")
    } else {
      completed.push(animeData)
      localStorage.setItem("completed", JSON.stringify(completed))
      setIsCompleted(true)
      showNotification("Agregado a terminados")
    }
  }

  const toggleWatching = () => {
    if (!anime) return

    const watching = JSON.parse(localStorage.getItem("watching") || "[]")
    const animeData = {
      id: anime.id,
      name: anime.title,
      image: anime.image,
      url: `/anime/${anime.id}`,
    }

    if (isWatching) {
      const newWatching = watching.filter((item: any) => item.id !== anime.id)
      localStorage.setItem("watching", JSON.stringify(newWatching))
      setIsWatching(false)
      showNotification("Eliminado de viendo")
    } else {
      watching.push(animeData)
      localStorage.setItem("watching", JSON.stringify(watching))
      setIsWatching(true)
      showNotification("Agregado a viendo")
    }
  }

  const addToHistory = (episodeNumber: number) => {
    if (!anime) return

    const history = JSON.parse(localStorage.getItem("history") || "[]")
    const now = new Date()
    const historyItem = {
      id: Date.now(), // Usar Date.now() para un ID único para cada entrada de historial
      name: anime.title,
      image: anime.image,
      episode: episodeNumber,
      date: now.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      time: now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      url: `/anime/${anime.id}`,
    }

    // Buscar si el mismo anime y episodio ya existen en el historial
    const existingIndex = history.findIndex((item: any) => item.name === anime.title && item.episode === episodeNumber)

    if (existingIndex !== -1) {
      // Si existe, eliminar la entrada antigua
      history.splice(existingIndex, 1)
    }

    // Añadir la nueva entrada al principio del historial
    history.unshift(historyItem)

    // Limitar el historial a 50 elementos
    if (history.length > 50) {
      history.splice(50)
    }

    localStorage.setItem("history", JSON.stringify(history))
  }

  const handleEpisodeChange = (newEpisode: number) => {
    if (newEpisode >= 1 && newEpisode <= (anime?.episodes || 1)) {
      setCurrentEpisode(newEpisode)
      addToHistory(newEpisode)
    }
  }

  const handleReportSubmit = async () => {
    if (!anime || !reportProblem) return

    setIsSubmittingReport(true)

    const formData = new FormData()
    formData.append("anime", anime.title)
    formData.append("episode", currentEpisode.toString())
    formData.append("problem", reportProblem)
    formData.append("explanation", reportExplanation)
    formData.append("language", selectedLanguage === "subtitulado" ? "Subtitulado" : "Español Latino")

    try {
      const response = await fetch("https://formspree.io/f/mrbkyeva", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        showNotification("Reporte enviado correctamente")
        setShowReportModal(false)
        setReportProblem("")
        setReportExplanation("")
      } else {
        throw new Error("Error en el envío")
      }
    } catch (error) {
      showNotification("Error al enviar el reporte")
    }

    setIsSubmittingReport(false)
  }

  const openReportModal = () => {
    setReportProblem("")
    setReportExplanation("")
    setShowReportModal(true)
  }

  // Componente para mostrar mensajes del video (sin parpadeo)
  const VideoMessage = ({ message, type }: { message: string; type: "loading" | "error" | "reconnected" }) => {
    if (!message) return null

    const getIcon = () => {
      switch (type) {
        case "loading":
          return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        case "error":
          return <WifiOff className="h-8 w-8 text-red-400" />
        case "reconnected":
          return <Wifi className="h-8 w-8 text-green-400" />
        default:
          return null
      }
    }

    const getTextColor = () => {
      switch (type) {
        case "loading":
          return "text-blue-400"
        case "error":
          return "text-red-400"
        case "reconnected":
          return "text-green-400"
        default:
          return "text-white"
      }
    }

    return (
      <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10">
        <div className="text-center space-y-4 animate-fadeInUp">
          <div className="flex justify-center">{getIcon()}</div>
          <p className={`text-white font-bold text-lg ${getTextColor()}`}>{message}</p>
        </div>
      </div>
    )
  }

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  if (!anime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-muted rounded-lg" />
              <div className="h-6 bg-muted rounded w-2/3" />
            </div>
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-muted rounded-lg" />
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-24">
      {/* Notificación */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg z-50 border border-gray-700">
          {notification}
        </div>
      )}

      <div className="space-y-8">
        {/* Botón de regreso */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Regresar</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del anime */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                    <Image
                      src={anime.image || "/placeholder.svg"}
                      alt={anime.title}
                      fill
                      className="object-cover"
                      unoptimized // Añadido para evitar problemas con imágenes externas
                    />
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold">{anime.title}</h1>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{anime.score}</span>
                      </div>
                      <Badge
                        variant={
                          anime.status === "En Emisión"
                            ? "success"
                            : anime.status === "Finalizado"
                              ? "destructive"
                              : anime.status === "En Pause"
                                ? "warning"
                                : anime.status === "Próximamente" // Agregado estado "Próximamente" con color amarillo
                                  ? "yellow"
                                  : "secondary"
                        }
                      >
                        {anime.status}
                      </Badge>
                      <Badge variant="outline">{anime.type}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {anime.genres.map((genre) => (
                        <Link key={genre} href={`/genero/${encodeURIComponent(genre)}`}>
                          <Badge
                            variant="outline"
                            className="text-xs hover:bg-[#5271ff] hover:text-white cursor-pointer transition-colors"
                          >
                            {genre}
                          </Badge>
                        </Link>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Año:</span>
                        <span>{anime.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vistas:</span>
                        <span>{formatViews(anime.views || 0)}</span>
                      </div>
                    </div>

                    {/* Botones de gestión */}
                    <div className="space-y-3">
                      <Button
                        onClick={toggleFavorite}
                        className={`w-full ${isFavorite ? "bg-red-600 hover:bg-red-700 text-white" : "bg-white hover:bg-gray-100 text-black border border-gray-300"}`}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-white text-white" : "text-red-600"}`} />
                        {isFavorite ? "Quitar de Favoritos" : "Añadir a Favoritos"}
                      </Button>

                      <Button
                        onClick={toggleCompleted}
                        className={`w-full ${isCompleted ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-white hover:bg-gray-100 text-black border border-gray-300"}`}
                      >
                        <Bookmark
                          className={`h-4 w-4 mr-2 ${isCompleted ? "fill-white text-white" : "text-yellow-600"}`}
                        />
                        {isCompleted ? "Quitar de Terminados" : "Añadir a Terminados"}
                      </Button>

                      <Button
                        onClick={toggleWatching}
                        className={`w-full ${isWatching ? "bg-green-600 hover:bg-green-700 text-white" : "bg-white hover:bg-gray-100 text-black border border-gray-300"}`}
                      >
                        <Eye className={`h-4 w-4 mr-2 ${isWatching ? "fill-white text-white" : "text-green-600"}`} />
                        {isWatching ? "Quitar de Viendo" : "Añadir a Viendo"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sinopsis */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">Sinopsis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {showFullSynopsis ? anime.synopsis : `${anime.synopsis.substring(0, 250)}...`}
                </p>
                {anime.synopsis.length > 250 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFullSynopsis(!showFullSynopsis)}
                    className="w-full mt-4 text-[#5271ff] hover:bg-transparent hover:text-[#4461ee]"
                  >
                    {showFullSynopsis ? (
                      <>
                        Mostrar menos <ChevronUp className="ml-1 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Mostrar más <ChevronDown className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reproductor y episodios */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selector de idioma - Solo mostrar idiomas disponibles */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Episodio {currentEpisode}</h2>
              <div className="flex items-center space-x-2">
                <Languages className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Solo mostrar subtitulado si hay enlaces disponibles */}
                    {anime.episodesLinks.subtitulado &&
                      anime.episodesLinks.subtitulado.length > 0 &&
                      anime.episodesLinks.subtitulado[currentEpisode - 1] && (
                        <SelectItem value="subtitulado">Subtitulado</SelectItem>
                      )}
                    {/* Solo mostrar español latino si hay enlaces disponibles */}
                    {anime.episodesLinks["español latino"] &&
                      anime.episodesLinks["español latino"].length > 0 &&
                      anime.episodesLinks["español latino"][currentEpisode - 1] && (
                        <SelectItem value="latino">Español Latino</SelectItem>
                      )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sección de Subtitulado */}
            {selectedLanguage === "subtitulado" && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Subtitulado</h3>
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    {/* Mensajes de estado del video */}
                    <VideoMessage message={videoMessage} type={videoStatus} />

                    {/* Iframe del video */}
                    {anime.episodesLinks.subtitulado[currentEpisode - 1] && videoStatus === "loaded" ? (
                      <iframe
                        src={anime.episodesLinks.subtitulado[currentEpisode - 1]}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                      ></iframe>
                    ) : (
                      videoStatus !== "loading" &&
                      videoStatus !== "error" &&
                      videoStatus !== "reconnected" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                          <p>No hay enlace disponible para este episodio en subtitulado.</p>
                        </div>
                      )
                    )}

                    {/* NUEVO: Overlay de episodio y idioma */}
                    <div
                      className={`absolute bottom-4 left-4 right-4 transition-opacity duration-500 z-10 ${
                        showEpisodeOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="bg-black/80 rounded p-2 text-white text-sm">
                        <div className="flex items-center justify-between">
                          <span>Episodio {currentEpisode} - Subtitulado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sección de Español Latino */}
            {selectedLanguage === "latino" && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Español Latino</h3>
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    {/* Mensajes de estado del video */}
                    <VideoMessage message={videoMessage} type={videoStatus} />

                    {/* Iframe del video */}
                    {anime.episodesLinks["español latino"][currentEpisode - 1] && videoStatus === "loaded" ? (
                      <iframe
                        src={anime.episodesLinks["español latino"][currentEpisode - 1]}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                      ></iframe>
                    ) : (
                      videoStatus !== "loading" &&
                      videoStatus !== "error" &&
                      videoStatus !== "reconnected" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white">
                          <p>No hay enlace disponible para este episodio en español latino.</p>
                        </div>
                      )
                    )}

                    {/* NUEVO: Overlay de episodio y idioma */}
                    <div
                      className={`absolute bottom-4 left-4 right-4 transition-opacity duration-500 z-10 ${
                        showEpisodeOverlay ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="bg-black/80 rounded p-2 text-white text-sm">
                        <div className="flex items-center justify-between">
                          <span>Episodio {currentEpisode} - Español Latino</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botón de reportar episodio */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={openReportModal}
                className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
              >
                <Flag className="h-4 w-4 mr-2" />
                Reportar episodio
              </Button>
            </div>

            {/* Controles de episodio */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={currentEpisode === 1}
                onClick={() => handleEpisodeChange(currentEpisode - 1)}
                className={currentEpisode === 1 ? "opacity-50 cursor-not-allowed" : ""}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Episodio {currentEpisode} de {anime.episodes}
              </span>
              <Button
                variant="outline"
                disabled={currentEpisode === anime.episodes}
                onClick={() => handleEpisodeChange(currentEpisode + 1)}
                className={currentEpisode === anime.episodes ? "opacity-50 cursor-not-allowed" : ""}
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Lista de episodios */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Episodios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {anime.episodeList.map((episode) => (
                    <Card
                      key={episode.id}
                      className={`cursor-pointer transition-colors ${
                        currentEpisode === episode.number ? "ring-2 ring-[#5271ff]" : ""
                      }`}
                      onClick={() => handleEpisodeChange(episode.number)}
                    >
                      <CardContent className="p-3">
                        <div className="flex space-x-3">
                          {/* Modificar para no usar Image, solo el número de episodio */}
                          <div className="relative w-20 h-12 rounded overflow-hidden bg-muted flex items-center justify-center text-sm font-semibold">
                            Ep {episode.number}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">Episodio {episode.number}</h4>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sección de Animes Recomendados */}
        {recommendedAnimes.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white px-4">También puedes ver</h2>
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 px-4 pb-2" style={{ width: "max-content" }}>
                {recommendedAnimes.map((recommendedAnime) => (
                  <Link key={recommendedAnime.id} href={`/anime/${recommendedAnime.id}`} className="flex-shrink-0">
                    <Card className="anime-card cursor-pointer group w-[160px]">
                      <CardContent className="p-0">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                          <Image
                            src={recommendedAnime.image || "/placeholder.svg"}
                            alt={recommendedAnime.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-[#5271ff] hover:bg-[#4461ee]">
                                <Play className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="text-xs">
                              {recommendedAnime.year}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-3 space-y-2">
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#5271ff] transition-colors">
                            {recommendedAnime.title}
                          </h3>

                          <div className="flex flex-wrap gap-1">
                            {recommendedAnime.genres.slice(0, 2).map((genre) => (
                              <Link key={genre} href={`/genero/${encodeURIComponent(genre)}`}>
                                <Badge
                                  variant="outline"
                                  className="text-xs hover:bg-[#5271ff] hover:text-white cursor-pointer transition-colors"
                                >
                                  {genre}
                                </Badge>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sección de Comentarios */}
        {anime && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Comentarios</h2>
            <DisqusComments
              identifier={`anime-${anime.id}`}
              title={anime.title}
              url={`${typeof window !== "undefined" ? window.location.origin : ""}/anime/${anime.id}`}
            />
          </div>
        )}

        {/* Modal de Reportar Episodio */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md bg-gray-900 text-white border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Reportar episodio</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setShowReportModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-300 mb-2">
                      <strong>{anime.title}</strong> - Episodio {currentEpisode} (
                      {selectedLanguage === "subtitulado" ? "Subtitulado" : "Español Latino"})
                    </p>
                  </div>

                  <div>
                    <Select value={reportProblem} onValueChange={setReportProblem}>
                      <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-white">
                        <SelectValue placeholder="Selecciona el problema" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {reportOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-gray-700">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-300 mb-2 block">
                      Deja una explicación (opcional y recuerda que tener una cuenta te notificará cuando sea
                      solucionado)
                    </label>
                    <Textarea
                      value={reportExplanation}
                      onChange={(e) => setReportExplanation(e.target.value)}
                      placeholder="Describe el problema con más detalle..."
                      className="min-h-[100px] bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowReportModal(false)}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                      disabled={isSubmittingReport}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleReportSubmit}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={!reportProblem || isSubmittingReport}
                    >
                      {isSubmittingReport ? "Enviando..." : "Enviar reporte"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
