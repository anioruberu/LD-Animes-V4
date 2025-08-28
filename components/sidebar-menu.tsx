"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Menu, X, Shield, Lock, FileText, ChevronDown, ChevronRight } from "lucide-react"
import { DMCAModal } from "@/components/dmca-modal"
import { PrivacyPolicyModal } from "@/components/privacy-policy-modal"
import { TermsModal } from "@/components/terms-modal"

export function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAnimeRequestModal, setShowAnimeRequestModal] = useState(false)
  const [showDMCAModal, setShowDMCAModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showWebSubmenu, setShowWebSubmenu] = useState(false)
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

  const openAnimeRequest = () => {
    setShowAnimeRequestModal(true)
    setIsOpen(false)
  }

  const openDMCA = () => {
    setShowDMCAModal(true)
    setIsOpen(false)
  }

  const openPrivacy = () => {
    setShowPrivacyModal(true)
    setIsOpen(false)
  }

  const openTerms = () => {
    setShowTermsModal(true)
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const toggleWebSubmenu = () => {
    setShowWebSubmenu(!showWebSubmenu)
  }

  useEffect(() => {
    const anyModalOpen = isOpen || showAnimeRequestModal || showDMCAModal || showPrivacyModal || showTermsModal

    if (anyModalOpen) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"
      document.body.style.overflow = "hidden"
    } else {
      const scrollY = document.body.style.top
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0") * -1)
      }
    }

    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
    }
  }, [isOpen, showAnimeRequestModal, showDMCAModal, showPrivacyModal, showTermsModal])

  return (
    <>
      {notification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg z-[9999] border border-gray-700">
          {notification}
        </div>
      )}

      <div className="fixed top-4 left-4 z-[70]">
        <Button
          onClick={toggleMenu}
          size="icon"
          className="bg-background/90 backdrop-blur-sm border border-border hover:bg-background/95 text-foreground shadow-lg transition-colors duration-200"
          style={{
            position: "fixed",
            top: "1rem",
            left: "1rem",
            zIndex: 70,
            transform: "translate3d(0, 0, 0)",
            willChange: "auto",
            backfaceVisibility: "hidden",
          }}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9997] transition-all duration-300"
          onClick={closeMenu}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
          }}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-80 bg-background border-r border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-[9998] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          position: "fixed",
          height: "100vh",
          maxHeight: "100vh",
          overflowY: "auto",
          overflowX: "hidden",
          scrollBehavior: "smooth",
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Menu className="h-6 w-6 text-[#5271ff]" />
            <h2 className="text-xl font-bold text-[#5271ff]">MENÚ</h2>
          </div>
          <Button
            onClick={closeMenu}
            size="icon"
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6 pb-20">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Síguenos</h3>
            <div className="space-y-2">
              <a
                href="https://www.tiktok.com/@ld.animes"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                onClick={closeMenu}
              >
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fab fa-tiktok text-white text-sm"></i>
                </div>
                <span className="font-medium">TikTok</span>
              </a>

              <a
                href="https://www.youtube.com/@ld.animes.oficial"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                onClick={closeMenu}
              >
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fab fa-youtube text-white text-sm"></i>
                </div>
                <span className="font-medium">YouTube</span>
              </a>

              <a
                href="https://discord.gg/cS5skF7Yn5"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                onClick={closeMenu}
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fab fa-discord text-white text-sm"></i>
                </div>
                <span className="font-medium">Discord</span>
              </a>

              <div>
                <button
                  onClick={toggleWebSubmenu}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group w-full text-left"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i className="fas fa-globe text-white text-sm"></i>
                  </div>
                  <span className="font-medium flex-1">Página Web</span>
                  {showWebSubmenu ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {showWebSubmenu && (
                  <div className="ml-11 mt-2 space-y-1">
                    <a
                      href="http://ldanimes.online/"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
                      onClick={closeMenu}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Página Principal</span>
                    </a>
                    <a
                      href="https://ldanimes.rf.gd/?i=1"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-sm"
                      onClick={closeMenu}
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Página Secundaria</span>
                    </a>
                  </div>
                )}
              </div>

              <a
                href="https://ko-fi.com/ldanimes"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                onClick={closeMenu}
              >
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fas fa-heart text-white text-sm"></i>
                </div>
                <span className="font-medium">Ko-fi</span>
              </a>
            </div>
          </div>

          <div className="border-t border-border"></div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Solicitudes</h3>
            <button
              onClick={openAnimeRequest}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group w-full text-left"
            >
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-search-plus text-white text-sm"></i>
              </div>
              <span className="font-medium">Solicitar Anime</span>
            </button>
          </div>

          <div className="border-t border-border"></div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Legal</h3>
            <div className="space-y-2">
              <button
                onClick={openDMCA}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group w-full text-left"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">DMCA</span>
              </button>

              <button
                onClick={openPrivacy}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group w-full text-left"
              >
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Lock className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">Política de Privacidad</span>
              </button>

              <button
                onClick={openTerms}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group w-full text-left"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium">Términos y Condiciones</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAnimeRequestModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999]">
          <Card className="w-full max-w-2xl bg-background border-border max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <i className="fas fa-search-plus text-green-500 text-xl"></i>
                  </div>
                  <h2 className="text-2xl font-bold">Solicitar Anime</h2>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-muted-foreground mb-6">
                Completa el formulario para solicitar que agreguemos tu anime favorito a nuestra biblioteca.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nombre del anime <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="anime_name"
                    required
                    placeholder="Escribe el nombre completo del anime que quieres solicitar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Breve descripción del anime <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    name="anime_description"
                    required
                    placeholder="Describe brevemente de qué trata el anime..."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ¿Qué tipo de contenido es? <span className="text-red-500">*</span>
                  </label>
                  <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de contenido" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Géneros (selecciona hasta 4) <span className="text-red-500">*</span>
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {genres.map((genre) => (
                        <label
                          key={genre}
                          className="flex items-center gap-2 cursor-pointer hover:bg-muted p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={selectedGenres.includes(genre)}
                            onChange={(e) => handleGenreChange(genre, e.target.checked)}
                            disabled={!selectedGenres.includes(genre) && selectedGenres.length >= 4}
                            className="w-4 h-4 text-[#5271ff] bg-background border-border rounded"
                          />
                          <span className="text-sm">{genre}</span>
                        </label>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {selectedGenres.length} de 4 géneros seleccionados
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Número de episodios <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="episode_count"
                    type="number"
                    required
                    min="1"
                    max="9999"
                    placeholder="Ej: 12, 24, 100..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_adult"
                      value="Sí"
                      className="w-4 h-4 text-red-500 bg-background border-border rounded"
                    />
                    <span className="text-sm font-medium">¿Es contenido +18?</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1 bg-transparent"
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

      <DMCAModal isOpen={showDMCAModal} onClose={() => setShowDMCAModal(false)} />
      <PrivacyPolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet" />
    </>
  )
}
