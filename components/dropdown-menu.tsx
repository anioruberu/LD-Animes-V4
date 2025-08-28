"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Menu, X } from "lucide-react"

export function DropdownMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAnimeRequestModal, setShowAnimeRequestModal] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedContentType, setSelectedContentType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState("")

  const genres = [
    "Acción",
    "Artes marciales",
    "Aventuras",
    "Ciencia ficción",
    "Comedia",
    "Deportes",
    "Detectives",
    "Drama",
    "Ecchi",
    "Espacio",
    "Escolar",
    "Fantasía",
    "Gore",
    "Harem",
    "Hentai",
    "Historia",
    "Horror",
    "Isekai",
    "Josei",
    "Juegos",
    "Mahou shoujo",
    "Mecha",
    "Militar",
    "Misterio",
    "Mitológico",
    "Música",
    "Parodia",
    "Psicológico",
    "Recuerdos de la vida",
    "Romance",
    "Samurais",
    "Sinen",
    "Shoujo",
    "Shoujo ai",
    "Shounen",
    "Shounen ai",
    "Sobrenatural",
    "Súper poderes",
    "Suspenso",
    "Vampiros",
  ]

  const contentTypes = ["TV", "Película", "OVA", "ONA", "Especial"]

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 5000)
  }

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked && selectedGenres.length < 4) {
      setSelectedGenres([...selectedGenres, genre])
    } else if (!checked) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))
    }
  }

  const closeModal = () => {
    setShowAnimeRequestModal(false)
    setSelectedGenres([])
    setSelectedContentType("")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (selectedGenres.length === 0) {
      showNotification("Por favor selecciona al menos un género")
      return
    }

    if (!selectedContentType) {
      showNotification("Por favor selecciona el tipo de contenido")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.set("genres", selectedGenres.join(", "))
      formData.set("content_type", selectedContentType)

      const response = await fetch("https://formspree.io/f/xwpbrvaq", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        showNotification("¡Solicitud enviada exitosamente! Revisaremos tu petición pronto.")
        closeModal()
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error("Error en el envío")
      }
    } catch (error) {
      showNotification("Error al enviar la solicitud. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const openAnimeRequest = () => {
    setShowAnimeRequestModal(true)
    closeMenu()
  }

  return (
    <>
      {/* Notificación */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg z-[9999] border border-gray-700">
          {notification}
        </div>
      )}

      {/* Botón del menú desplegable */}
      <div
        className="fixed top-4 left-4 z-[99999]"
        style={{
          position: "fixed !important",
          top: "16px !important",
          left: "16px !important",
          zIndex: 99999,
        }}
      >
        <Button
          onClick={toggleMenu}
          size="icon"
          className="bg-[#5271ff]/90 backdrop-blur-sm hover:bg-[#4461ee]/90 text-white rounded-lg shadow-lg transition-all duration-200"
          style={{
            position: "relative",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Overlay del menú */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMenu} />}

      {/* Menú desplegable */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white transform transition-transform duration-300 z-50 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Header del menú */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#5271ff]">LD Animes</h2>
            <Button onClick={closeMenu} size="icon" variant="ghost" className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Enlaces de redes sociales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-300">Síguenos</h3>

            <a
              href="https://www.tiktok.com/@ld.animes"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fab fa-tiktok text-white text-lg"></i>
              </div>
              <span className="font-medium">TikTok</span>
            </a>

            <a
              href="https://www.youtube.com/@ld.animes.oficial"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fab fa-youtube text-white text-lg"></i>
              </div>
              <span className="font-medium">YouTube</span>
            </a>

            <a
              href="https://discord.gg/cS5skF7Yn5"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fab fa-discord text-white text-lg"></i>
              </div>
              <span className="font-medium">Discord</span>
            </a>

            <a
              href="https://ldanimes.rf.gd/?i=1"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-globe text-white text-lg"></i>
              </div>
              <span className="font-medium">Página Web Oficial</span>
            </a>

            <a
              href="https://ko-fi.com/ldanimes"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
              onClick={closeMenu}
            >
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-heart text-white text-lg"></i>
              </div>
              <span className="font-medium">Donaciones</span>
            </a>

            {/* Separador */}
            <div className="border-t border-gray-700 my-6"></div>

            {/* Solicitar Anime */}
            <button
              onClick={openAnimeRequest}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors group w-full text-left"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-search-plus text-white text-lg"></i>
              </div>
              <span className="font-medium">Solicitar Anime</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Solicitar Anime */}
      {showAnimeRequestModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999]">
          <Card className="w-full max-w-2xl bg-gray-900 text-white border-gray-700 max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-search-plus text-green-400 text-xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold">Solicitar Anime</h2>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-gray-300 mb-6">
                Completa el formulario para solicitar que agreguemos tu anime favorito a nuestra biblioteca.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre del anime <span className="text-red-400">*</span>
                  </label>
                  <Input
                    name="anime_name"
                    required
                    placeholder="Escribe el nombre completo del anime que quieres solicitar"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Breve descripción del anime <span className="text-red-400">*</span>
                  </label>
                  <Textarea
                    name="anime_description"
                    required
                    placeholder="Describe brevemente de qué trata el anime..."
                    className="bg-gray-800 border-gray-600 text-white min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ¿Qué tipo de contenido es? <span className="text-red-400">*</span>
                  </label>
                  <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Selecciona el tipo de contenido" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {contentTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-white hover:bg-gray-700">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Géneros (selecciona hasta 4) <span className="text-red-400">*</span>
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-600 rounded-lg p-4 bg-gray-800">
                    <div className="grid grid-cols-2 gap-2">
                      {genres.map((genre) => (
                        <label
                          key={genre}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGenres.includes(genre)}
                            onChange={(e) => handleGenreChange(genre, e.target.checked)}
                            disabled={!selectedGenres.includes(genre) && selectedGenres.length >= 4}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                          />
                          <span className="text-sm">{genre}</span>
                        </label>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">{selectedGenres.length} de 4 géneros seleccionados</div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Número de episodios <span className="text-red-400">*</span>
                  </label>
                  <Input
                    name="episode_count"
                    type="number"
                    required
                    min="1"
                    max="9999"
                    placeholder="Ej: 12, 24, 100..."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_adult"
                      value="Sí"
                      className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded"
                    />
                    <span className="text-sm font-medium">¿Es contenido +18?</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Enviar Solicitud
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Font Awesome para los iconos */}
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
    </>
  )
}
