"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"

interface Anime {
  id: number
  title: string
  image: string
  created_at: string
  genres?: string[]
  description?: string
  rating?: number
  views?: number
  score?: number
  synopsis?: string
  year?: number
  episodes?: number
  status?: string
  type?: string
  language?: string
  episodes_links?: any
}

type CategoryType = "recent" | "spanish" | "episodes" | "episodes_spanish" | "all"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [animes, setAnimes] = useState<Anime[]>([])
  const [selectedAnimes, setSelectedAnimes] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("recent")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedEpisodes, setSelectedEpisodes] = useState<{ [key: number]: string }>({})

  const handleLogin = () => {
    if (username === "anyorver" && password === "anyorver12345") {
      setIsAuthenticated(true)
      loadAnimes()
    } else {
      toast({
        title: "Error",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      })
    }
  }

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`
    }
    return views.toString()
  }

  const loadAnimes = async (page = 1) => {
    setLoading(true)
    try {
      let url = "/api/anime"
      const limit = 50 // Mostrar 50 animes por página

      switch (selectedCategory) {
        case "recent":
          url += `?sort=recent&limit=${limit}&page=${page}`
          break
        case "spanish":
          url += `?language=latino&limit=${limit}&page=${page}`
          break
        case "episodes":
          url += `?sort=recent&has_episodes=true&limit=${limit}&page=${page}`
          break
        case "episodes_spanish":
          url += `?language=latino&has_episodes=true&limit=${limit}&page=${page}`
          break
        case "all":
          url += `?directory=true&page=${page}&limit=${limit}`
          break
      }

      const response = await fetch(url)
      const result = await response.json()
      console.log("[v0] Animes data received:", result.data?.[0])
      setAnimes(result.data || [])
      if (result.pagination) {
        setTotalPages(result.pagination.totalPages)
      } else {
        setTotalPages(Math.ceil((result.total || 0) / limit))
      }
      setCurrentPage(page)
      setSelectedAnimes([]) // Reset selection when changing category or page
      setSelectedEpisodes({}) // Reset episode selection
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar animes",
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleAnimeSelect = (animeId: number, checked: boolean) => {
    if (checked) {
      setSelectedAnimes([...selectedAnimes, animeId])
    } else {
      setSelectedAnimes(selectedAnimes.filter((id) => id !== animeId))
      // Remove episode selection if anime is deselected
      const newSelectedEpisodes = { ...selectedEpisodes }
      delete newSelectedEpisodes[animeId]
      setSelectedEpisodes(newSelectedEpisodes)
    }
  }

  const handleEpisodeSelect = (animeId: number, episode: string) => {
    setSelectedEpisodes({
      ...selectedEpisodes,
      [animeId]: episode,
    })
  }

  const handleSelectAll = () => {
    if (selectedAnimes.length === animes.length) {
      setSelectedAnimes([])
      setSelectedEpisodes({})
    } else {
      setSelectedAnimes([...animes].reverse().map((anime) => anime.id))
    }
  }

  const sendToDiscordSimple = async () => {
    if (selectedAnimes.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un anime",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    let successCount = 0
    let errorCount = 0

    try {
      const selectedAnimeTitles = selectedAnimes
        .map((animeId) => animes.find((anime) => anime.id === animeId))
        .filter((anime) => anime !== undefined)
        .map((anime) => {
          if (
            (selectedCategory === "episodes" || selectedCategory === "episodes_spanish") &&
            selectedEpisodes[anime.id]
          ) {
            return `${anime.title} - Episodio ${selectedEpisodes[anime.id]}`
          }
          return anime.title
        })

      const webhookUrl =
        "https://discord.com/api/webhooks/1387187719993819248/ydp-EpLRLwueGbhhv3Xqj-I_1Z5RwlmwISAc7Ht0NDjCNWW7zPE6w3aBf4MdHde3MK4V"

      const message = getCategoryMessage(selectedCategory, selectedAnimeTitles)

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
        }),
      })

      if (response.ok) {
        successCount = selectedAnimes.length
        toast({
          title: "✅ Mensaje enviado",
          description: `${successCount} animes enviados correctamente a Discord`,
        })
        setSelectedAnimes([])
        setSelectedEpisodes({})
      } else {
        throw new Error("Error al enviar webhook")
      }
    } catch (error) {
      errorCount = selectedAnimes.length
      toast({
        title: "❌ Error al enviar",
        description: `No se pudo enviar el mensaje a Discord. Verifica la conexión.`,
        variant: "destructive",
      })
    }
    setSending(false)
  }

  const sendToDiscordEmbed = async () => {
    if (selectedAnimes.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un anime",
        variant: "destructive",
      })
      return
    }

    setSending(true)
    let successCount = 0
    let errorCount = 0

    try {
      const selectedAnimesData = selectedAnimes
        .map((animeId) => animes.find((anime) => anime.id === animeId))
        .filter((anime) => anime !== undefined)

      const webhookUrl =
        "https://discord.com/api/webhooks/1410373339909722212/27hsdh3sXsNqFY4nggRi1tbN7OdGmbizvpT0T_Dgcu86y083JJhnmSjAJ9iDaH-jIEP_"

      for (const anime of selectedAnimesData) {
        try {
          console.log("[v0] Sending anime data:", anime)

          const embed = {
            title: `${anime.title} en LD Animes`,
            description: anime.description || anime.synopsis || "Sin descripción disponible",
            color: 0x5271ff,
            image: {
              url: anime.image || "",
            },
            fields: [
              {
                name: "Géneros",
                value: anime.genres?.join(", ") || "No especificado",
                inline: true,
              },
              {
                name: "Calificación",
                value: anime.rating ? `⭐ ${anime.rating}/10` : anime.score ? `⭐ ${anime.score}/10` : "Sin calificar",
                inline: true,
              },
              {
                name: "Vistas",
                value: anime.views ? `👁️ ${formatViews(anime.views)}` : "👁️ 0",
                inline: true,
              },
              {
                name: "Año",
                value: anime.year ? `📅 ${anime.year}` : "No especificado",
                inline: true,
              },
              {
                name: "Episodios",
                value: anime.episodes ? `📺 ${anime.episodes}` : "No especificado",
                inline: true,
              },
              {
                name: "Estado",
                value: anime.status ? `📊 ${anime.status}` : "No especificado",
                inline: true,
              },
              {
                name: "Tipo",
                value: anime.type ? `🎬 ${anime.type}` : "No especificado",
                inline: true,
              },
              {
                name: "Idioma",
                value:
                  anime.language === "latino"
                    ? "🌐 Japonés, Latino"
                    : anime.language
                      ? `🌐 ${anime.language}`
                      : "🌐 Japonés",
                inline: true,
              },
            ],
            timestamp: new Date().toISOString(),
          }

          const roleTag = "<@&1410392368154411008>"
          const customMessage = `${anime.title} ya está disponible en LD Animes ${roleTag}`

          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: customMessage,
              embeds: [embed],
            }),
          })

          if (response.ok) {
            successCount++
          } else {
            errorCount++
          }

          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
          errorCount++
        }
      }

      if (successCount > 0 && errorCount === 0) {
        toast({
          title: "✅ Todos los embeds enviados",
          description: `${successCount} animes enviados correctamente a Discord`,
        })
      } else if (successCount > 0 && errorCount > 0) {
        toast({
          title: "⚠️ Envío parcial",
          description: `${successCount} enviados, ${errorCount} fallaron`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "❌ Error total",
          description: `No se pudo enviar ningún embed a Discord`,
          variant: "destructive",
        })
      }

      setSelectedAnimes([])
      setSelectedEpisodes({})
    } catch (error) {
      toast({
        title: "❌ Error al enviar",
        description: "Error general al enviar mensajes embed a Discord",
        variant: "destructive",
      })
    }
    setSending(false)
  }

  const getCategoryMessage = (category: CategoryType, titles: string[]): string => {
    const roleTag = "<@&1299981011370643500>"

    switch (category) {
      case "recent":
        return `**Nuevos animes agregados**\n\n${titles.map((title) => `• ${title}`).join("\n")}\n\n${roleTag}`
      case "spanish":
        return `**Nuevos animes en latino agregados**\n\n${titles.map((title) => `• ${title}`).join("\n")}\n\n${roleTag}`
      case "episodes":
        return `**Nuevos Episodios En Emision agregados**\n\n${titles.map((title) => `• ${title}`).join("\n")}\n\n${roleTag}`
      case "episodes_spanish":
        return `**Nuevos episodios en latino agregados**\n\n${titles.map((title) => `• ${title}`).join("\n")}\n\n${roleTag}`
      case "all":
        return `**Nuevos animes agregados**\n\n${titles.map((title) => `• ${title}`).join("\n")}\n\n${roleTag}`
      default:
        return `**Nuevos animes agregados**\n\n${titles.map((title) => `• ${title}`).join("\n")}\n\n${roleTag}`
    }
  }

  const getEmbedMessage = (category: CategoryType): string => {
    const roleTag = "<@&1410392368154411008>"

    switch (category) {
      case "recent":
        return `**Nuevo anime agregado** ${roleTag}`
      case "spanish":
        return `**Nuevo anime en latino agregado** ${roleTag}`
      case "episodes":
        return `**Nuevo episodio agregado** ${roleTag}`
      case "episodes_spanish":
        return `**Nuevo episodio en latino agregado** ${roleTag}`
      case "all":
        return `**Nuevo anime agregado** ${roleTag}`
      default:
        return `**Nuevo anime agregado** ${roleTag}`
    }
  }

  const getCategoryDisplayName = (category: CategoryType): string => {
    switch (category) {
      case "recent":
        return "Animes Recientes"
      case "spanish":
        return "Latino"
      case "episodes":
        return "Episodios Recientes"
      case "episodes_spanish":
        return "Episodios en Latino"
      case "all":
        return "Todos los Animes"
      default:
        return "Animes Recientes"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl md:text-2xl">Administración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-base"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className="text-base"
              />
            </div>
            <Button onClick={handleLogin} className="w-full text-base py-2 bg-[#5271ff] hover:bg-[#4461ee]">
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-2 md:p-4 pb-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Panel de Administración</h1>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline" className="text-sm md:text-base">
            Cerrar Sesión
          </Button>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">Seleccionar Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <Select
                value={selectedCategory}
                onValueChange={(value: CategoryType) => {
                  setSelectedCategory(value)
                  setSelectedAnimes([])
                  setSelectedEpisodes({})
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Animes Recientes</SelectItem>
                  <SelectItem value="spanish">Latino</SelectItem>
                  <SelectItem value="episodes">Episodios Recientes</SelectItem>
                  <SelectItem value="episodes_spanish">Episodios en Latino</SelectItem>
                  <SelectItem value="all">Todos los Animes</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => loadAnimes(1)} className="bg-[#5271ff] hover:bg-[#4461ee]" disabled={loading}>
                {loading ? "Cargando..." : "Cargar"}
              </Button>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  onClick={() => loadAnimes(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  variant="outline"
                  size="sm"
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  onClick={() => loadAnimes(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  variant="outline"
                  size="sm"
                >
                  Siguiente
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="principal" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="principal" className="text-sm md:text-base">
              Principal
            </TabsTrigger>
            <TabsTrigger
              value="beta"
              className="text-sm md:text-base"
              disabled={selectedCategory !== "recent" && selectedCategory !== "all"}
            >
              Beta{" "}
              <Badge variant="secondary" className="ml-1 text-xs">
                Embed
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="principal">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">
                  Envío Simple - {getCategoryDisplayName(selectedCategory)}
                </CardTitle>
                {(selectedCategory === "episodes" || selectedCategory === "episodes_spanish") && (
                  <p className="text-sm text-muted-foreground">Selecciona animes y episodios específicos para enviar</p>
                )}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                  <Button
                    onClick={() => loadAnimes(currentPage)}
                    disabled={loading}
                    variant="outline"
                    className="text-sm bg-transparent"
                  >
                    {loading ? "Cargando..." : "Recargar"}
                  </Button>
                  <Button onClick={handleSelectAll} variant="outline" className="text-sm bg-transparent">
                    {selectedAnimes.length === animes.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
                  </Button>
                  <Button
                    onClick={sendToDiscordSimple}
                    disabled={sending || selectedAnimes.length === 0}
                    className="bg-[#5271ff] hover:bg-[#4461ee] text-sm"
                  >
                    {sending ? "Enviando..." : `Enviar Simple (${selectedAnimes.length})`}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Cargando animes...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {animes.map((anime) => (
                      <div
                        key={anime.id}
                        className="flex flex-col space-y-2 p-3 border border-border rounded-lg hover:bg-accent"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={selectedAnimes.includes(anime.id)}
                            onCheckedChange={(checked) => handleAnimeSelect(anime.id, checked as boolean)}
                          />
                          <img
                            src={anime.image || "/placeholder.svg"}
                            alt={anime.title}
                            className="w-10 h-14 md:w-12 md:h-16 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-xs md:text-sm truncate">{anime.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {new Date(anime.created_at).toLocaleDateString()}
                            </p>
                            {(selectedCategory === "spanish" || selectedCategory === "episodes_spanish") && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Latino
                              </Badge>
                            )}
                            {(selectedCategory === "episodes" || selectedCategory === "episodes_spanish") && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {anime.episodes ? `${anime.episodes} eps` : "Episodios"}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {(selectedCategory === "episodes" || selectedCategory === "episodes_spanish") && (
                          <div className="ml-8">
                            <Select
                              value={selectedEpisodes[anime.id] || ""}
                              onValueChange={(value) => handleEpisodeSelect(anime.id, value)}
                              disabled={!selectedAnimes.includes(anime.id)}
                            >
                              <SelectTrigger className="w-full text-xs">
                                <SelectValue
                                  placeholder={
                                    selectedAnimes.includes(anime.id)
                                      ? "Seleccionar episodio"
                                      : "Selecciona el anime primero"
                                  }
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: anime.episodes || 24 }, (_, i) => i + 1).map((ep) => (
                                  <SelectItem key={ep} value={ep.toString()}>
                                    Episodio {ep}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beta">
            {selectedCategory !== "recent" && selectedCategory !== "all" ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    La opción Beta (Embed) solo está disponible para "Animes Recientes" y "Todos los Animes"
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    Envío Embed - {getCategoryDisplayName(selectedCategory)} (Beta)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Envía mensajes detallados con embed por cada anime seleccionado
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                    <Button
                      onClick={() => loadAnimes(currentPage)}
                      disabled={loading}
                      variant="outline"
                      className="text-sm bg-transparent"
                    >
                      {loading ? "Cargando..." : "Recargar"}
                    </Button>
                    <Button onClick={handleSelectAll} variant="outline" className="text-sm bg-transparent">
                      {selectedAnimes.length === animes.length ? "Deseleccionar Todo" : "Seleccionar Todo"}
                    </Button>
                    <Button
                      onClick={sendToDiscordEmbed}
                      disabled={sending || selectedAnimes.length === 0}
                      className="bg-[#5271ff] hover:bg-[#4461ee] text-sm"
                    >
                      {sending ? "Enviando..." : `Enviar Embed (${selectedAnimes.length})`}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">Cargando animes...</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                      {animes.map((anime) => (
                        <div
                          key={anime.id}
                          className="flex flex-col space-y-2 p-3 border border-border rounded-lg hover:bg-accent"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedAnimes.includes(anime.id)}
                              onCheckedChange={(checked) => handleAnimeSelect(anime.id, checked as boolean)}
                            />
                            <img
                              src={anime.image || "/placeholder.svg"}
                              alt={anime.title}
                              className="w-10 h-14 md:w-12 md:h-16 object-cover rounded flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-xs md:text-sm truncate">{anime.title}</h3>
                              <p className="text-xs text-muted-foreground">
                                {new Date(anime.created_at).toLocaleDateString()}
                              </p>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  Embed
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
