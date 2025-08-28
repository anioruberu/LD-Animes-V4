"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"
import Image from "next/image"

interface AvatarSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectAvatar: (avatar: string) => void
  currentAvatar: string
}

interface AvatarCategory {
  name: string
  avatars: string[]
  loading: boolean
  isGif: boolean // Nuevo: para saber si la categoría devuelve GIFs
}

export function AvatarSelector({ isOpen, onClose, onSelectAvatar, currentAvatar }: AvatarSelectorProps) {
  const [categories, setCategories] = useState<AvatarCategory[]>([])
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Obtener mes actual para cache
  const getCurrentMonth = () => {
    const now = new Date()
    return `${now.getFullYear()}-${now.getMonth()}`
  }

  // Categorías de avatares con APIs
  const avatarCategories = [
    {
      name: "Waifu",
      endpoint: "https://api.waifu.pics/sfw/waifu",
      count: 8,
      isCustom: false,
      isGif: false,
    },
    {
      name: "Neko",
      endpoint: "https://api.waifu.pics/sfw/neko",
      count: 8,
      isCustom: false,
      isGif: false,
    },
    {
      name: "Shinobu",
      endpoint: "https://api.waifu.pics/sfw/shinobu",
      count: 8,
      isCustom: false,
      isGif: false,
    },
    {
      name: "Awoo",
      endpoint: "https://api.waifu.pics/sfw/awoo",
      count: 8,
      isCustom: false,
      isGif: false,
    },
    // Nuevas categorías de imágenes de Waifu.pics (no GIFs)
    {
      name: "Pat",
      endpoint: "https://api.waifu.pics/sfw/pat",
      count: 8,
      isCustom: false,
      isGif: false,
    },
    {
      name: "Lick",
      endpoint: "https://api.waifu.pics/sfw/lick",
      count: 8,
      isCustom: false,
      isGif: false,
    },
    {
      name: "NekosBest", // Para imágenes de chicas anime
      endpoint: "https://nekos.best/api/v2/neko",
      count: 8,
      isCustom: true, // Se manejará de forma personalizada
      isGif: false,
    },
    {
      name: "AniList", // Revertido a nombre original
      endpoint: "https://graphql.anilist.co/",
      count: 8,
      isCustom: true,
      isGif: false,
    },
    {
      name: "Jikan", // Revertido a nombre original
      endpoint: "https://api.jikan.moe/v4/random/characters",
      count: 8,
      isCustom: true,
      isGif: false,
    },
    {
      name: "MyAnimeList", // Revertido a nombre original
      endpoint: "https://api.jikan.moe/v4/top/characters",
      count: 8,
      isCustom: true,
      isGif: false,
    },
    {
      name: "Jikan Top Anime", // Nueva: Imágenes de animes populares
      endpoint: "https://api.jikan.moe/v4/top/anime",
      count: 8,
      isCustom: true,
      isGif: false,
    },
    {
      name: "Dance GIFs", // GIFs de waifu.pics
      endpoint: "https://api.waifu.pics/sfw/dance",
      count: 8,
      isCustom: false,
      isGif: true, // Es un GIF
    },
    {
      name: "Hug GIFs", // GIFs de waifu.pics
      endpoint: "https://api.waifu.pics/sfw/hug",
      count: 8,
      isCustom: false,
      isGif: true, // Es un GIF
    },
    // Nuevas categorías de GIFs de Waifu.pics (movidas al final y corregido isGif)
    {
      name: "Cringe", // Renombrado para claridad
      endpoint: "https://api.waifu.pics/sfw/cringe",
      count: 8,
      isCustom: false,
      isGif: true,
    },
    {
      name: "Blush", // Renombrado para claridad
      endpoint: "https://api.waifu.pics/sfw/blush",
      count: 8,
      isCustom: false,
      isGif: true,
    },
    {
      name: "Happy GIFs",
      endpoint: "https://api.waifu.pics/sfw/happy",
      count: 8,
      isCustom: false,
      isGif: true,
    },
    {
      name: "Wink GIFs",
      endpoint: "https://api.waifu.pics/sfw/wink",
      count: 8,
      isCustom: false,
      isGif: true,
    },
  ]

  // Cargar desde cache local
  const loadFromCache = (categoryName: string) => {
    const currentMonth = getCurrentMonth()
    const cacheKey = `avatars_${categoryName}_${currentMonth}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      return JSON.parse(cached)
    }
    return null
  }

  // Guardar en cache local
  const saveToCache = (categoryName: string, avatars: string[]) => {
    const currentMonth = getCurrentMonth()
    const cacheKey = `avatars_${categoryName}_${currentMonth}`
    localStorage.setItem(cacheKey, JSON.stringify(avatars))
  }

  // Limpiar cache de meses anteriores
  const cleanOldCache = () => {
    const currentMonth = getCurrentMonth()
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("avatars_"))
    keys.forEach((key) => {
      if (!key.includes(currentMonth)) {
        localStorage.removeItem(key)
      }
    })
  }

  // Funciones para APIs personalizadas
  const fetchCustomAPI = async (category: any) => {
    const avatars: string[] = []

    try {
      switch (category.name) {
        case "AniList":
          const query = `
          query {
            Page(page: 1, perPage: ${category.count}) {
              characters(sort: FAVOURITES_DESC) {
                image {
                  large
                }
              }
            }
          }
        `
          const aniListResponse = await fetch("https://graphql.anilist.co/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
          })
          const aniListData = await aniListResponse.json()
          if (aniListData.data?.Page?.characters) {
            aniListData.data.Page.characters.forEach((char: any) => {
              if (char.image?.large) avatars.push(char.image.large)
            })
          }
          break

        case "Jikan":
          for (let i = 0; i < Math.min(category.count, 4); i++) {
            // Limitar a 4 para evitar rate limiting excesivo
            try {
              const response = await fetch("https://api.jikan.moe/v4/random/characters")
              const data = await response.json()
              if (data.data?.images?.jpg?.image_url) {
                avatars.push(data.data.images.jpg.image_url)
              }
              await new Promise((resolve) => setTimeout(resolve, 500)) // Pequeño retraso para evitar rate limiting
            } catch (error) {
              console.error(`Error fetching Jikan random character ${i}:`, error)
            }
          }
          break

        case "MyAnimeList":
          try {
            const myAnimeListResponse = await fetch("https://api.jikan.moe/v4/top/characters?limit=8")
            const myAnimeListData = await myAnimeListResponse.json()
            if (myAnimeListData.data) {
              myAnimeListData.data.forEach((char: any) => {
                if (char.images?.jpg?.image_url) avatars.push(char.images.jpg.image_url)
              })
            }
          } catch (error) {
            console.error("Error fetching MyAnimeList top characters:", error)
          }
          break

        case "NekosBest":
          try {
            const nekosBestResponse = await fetch(`${category.endpoint}?amount=${category.count}`)
            const nekosBestData = await nekosBestResponse.json()
            if (nekosBestData.results) {
              nekosBestData.results.forEach((item: any) => {
                if (item.url) avatars.push(item.url)
              })
            }
          } catch (error) {
            console.error("Error fetching NekosBest avatars:", error)
          }
          break

        case "OtakuGIFs":
          for (let i = 0; i < category.count; i++) {
            try {
              const otakuGifsResponse = await fetch(category.endpoint)
              const otakuGifsData = await otakuGifsResponse.json()
              if (otakuGifsData.url) {
                avatars.push(otakuGifsData.url)
              } else {
                console.warn(`OtakuGIFs API returned no URL for item ${i}:`, otakuGifsData)
              }
              await new Promise((resolve) => setTimeout(resolve, 300)) // Pequeño retraso
            } catch (error) {
              console.error(`Error fetching OtakuGIFs avatar ${i}:`, error)
            }
          }
          break

        case "Jikan Top Anime": // Nueva API para imágenes de anime
          try {
            const jikanAnimeResponse = await fetch(`${category.endpoint}?limit=${category.count}`)
            const jikanAnimeData = await jikanAnimeResponse.json()
            if (jikanAnimeData.data) {
              jikanAnimeData.data.forEach((animeItem: any) => {
                if (animeItem.images?.jpg?.image_url) avatars.push(animeItem.images.jpg.image_url)
              })
            }
          } catch (error) {
            console.error("Error fetching Jikan Top Anime images:", error)
          }
          break

        default:
          break
      }
    } catch (error) {
      console.error(`Error loading ${category.name} avatars:`, error)
    }

    return avatars
  }

  // Cargar avatares de las APIs
  const loadAvatars = async () => {
    setLoading(true)
    cleanOldCache() // Limpiar cache viejo

    const initialCategories: AvatarCategory[] = avatarCategories.map((cat) => ({
      name: cat.name,
      avatars: [],
      loading: true,
      isGif: cat.isGif, // Mantener la propiedad isGif
    }))
    setCategories(initialCategories)

    // Cargar cada categoría
    for (let i = 0; i < avatarCategories.length; i++) {
      const category = avatarCategories[i]

      // Intentar cargar desde cache primero
      const cachedAvatars = loadFromCache(category.name)
      if (cachedAvatars && cachedAvatars.length > 0) {
        setCategories((prev) =>
          prev.map((cat, index) => (index === i ? { ...cat, avatars: cachedAvatars, loading: false } : cat)),
        )
        continue
      }

      let avatars: string[] = []

      try {
        if (category.isCustom) {
          avatars = await fetchCustomAPI(category)
        } else {
          // APIs estándar de waifu.pics
          const promises = Array.from({ length: category.count }, () =>
            fetch(category.endpoint).then((res) => res.json()),
          )

          const results = await Promise.all(promises)
          results.forEach((result) => {
            if (result.url) {
              avatars.push(result.url)
            } else {
              console.warn(`Waifu.pics API (${category.name}) returned no URL for an item:`, result)
            }
          })
        }

        // Guardar en cache
        if (avatars.length > 0) {
          saveToCache(category.name, avatars)
        }

        // Actualizar la categoría específica
        setCategories((prev) => prev.map((cat, index) => (index === i ? { ...cat, avatars, loading: false } : cat)))
      } catch (error) {
        console.error(`Error loading ${category.name} avatars:`, error)
        setCategories((prev) => prev.map((cat, index) => (index === i ? { ...cat, loading: false } : cat)))
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentAvatar) // Actualizar avatar seleccionado cuando se abre
      loadAvatars()
    }
  }, [isOpen, currentAvatar])

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
  }

  const handleSave = () => {
    onSelectAvatar(selectedAvatar)
    onClose()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999]">
      <Card className="w-full max-w-4xl bg-background border-border max-h-[90vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">Editar imagen de perfil</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={loadAvatars}
              disabled={loading}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>

          {/* Avatar actual con icono de lápiz */}
          <div className="p-6 text-center bg-gradient-to-b from-background to-muted/20">
            <div className="relative w-24 h-24 mx-auto mb-4">
              {/* Usar <img> para GIFs y Image para imágenes estáticas */}
              {selectedAvatar.endsWith(".gif") || selectedAvatar.startsWith("data:image/gif") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedAvatar || "/placeholder.svg"}
                  alt="Avatar actual"
                  className="rounded-full object-cover border-4 border-[#5271ff] w-full h-full"
                  onError={(e) => {
                    console.error(`Error al cargar GIF de avatar: ${selectedAvatar}`, e)
                    e.currentTarget.src = "/placeholder.svg" // Fallback a placeholder
                  }}
                />
              ) : (
                <Image
                  src={selectedAvatar || "/placeholder.svg"}
                  alt="Avatar actual"
                  fill
                  className="rounded-full object-cover border-4 border-[#5271ff]"
                  unoptimized
                  onError={(e) => {
                    console.error(`Error al cargar imagen de avatar: ${selectedAvatar}`, e)
                    e.currentTarget.src = "/placeholder.svg" // Fallback a placeholder
                  }}
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">Avatar seleccionado</p>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          </div>

          {/* Contenido scrolleable */}
          <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto p-4 pb-24 space-y-6">
            {/* Categorías de avatares con scroll horizontal */}
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>

                {category.loading ? (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="flex-shrink-0 w-16 h-16 bg-muted rounded-full animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 pb-2" style={{ width: "max-content" }}>
                      {category.avatars.map((avatar, avatarIndex) => (
                        <button
                          key={avatarIndex}
                          onClick={() => handleAvatarSelect(avatar)}
                          className={`flex-shrink-0 relative w-16 h-16 rounded-full overflow-hidden border-3 transition-all hover:scale-105 ${
                            selectedAvatar === avatar
                              ? "border-[#5271ff] shadow-lg shadow-[#5271ff]/50"
                              : "border-transparent hover:border-muted-foreground"
                          }`}
                        >
                          {category.isGif ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatar || "/placeholder.svg"}
                              alt={`${category.name} avatar ${avatarIndex + 1}`}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                console.error(`Error al cargar GIF de ${category.name}: ${avatar}`, e)
                                e.currentTarget.src = "/placeholder.svg" // Fallback a placeholder
                              }}
                            />
                          ) : (
                            <Image
                              src={avatar || "/placeholder.svg"}
                              alt={`${category.name} avatar ${avatarIndex + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                              onError={(e) => {
                                console.error(`Error al cargar imagen de ${category.name}: ${avatar}`, e)
                                e.currentTarget.src = "/placeholder.svg" // Fallback a placeholder
                              }}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-[#5271ff]" />
                <p className="text-sm text-muted-foreground">Cargando avatares...</p>
              </div>
            )}
          </div>

          {/* Footer con botón guardar */}
          <div className="p-4 border-t border-border bg-background sticky bottom-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={onClose} variant="outline" className="w-full sm:w-auto sm:flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="w-full sm:w-auto sm:flex-1 bg-[#5271ff] hover:bg-[#4461ee] text-white font-medium py-3 sm:py-2"
                disabled={!selectedAvatar}
              >
                Guardar cambios
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
