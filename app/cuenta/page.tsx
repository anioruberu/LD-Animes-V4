"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Eye, History, Bookmark, Crown, Edit, X, Trash2, AlertTriangle, Pencil, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SidebarMenu } from "@/components/sidebar-menu"
import { AvatarSelector } from "@/components/avatar-selector"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { SubscriptionModal } from "@/components/subscription-modal"
import { WelcomeModal } from "@/components/welcome-modal"

interface UserProfile {
  username: string
  avatar: string
  isFirstTime: boolean
}

interface AnimeItem {
  id: number
  name: string
  image: string
  url: string
}

interface HistoryItem {
  id: number
  name: string
  image: string
  episode: number
  date: string
  time: string
  url: string
}

export default function CuentaPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: "Usuario",
    avatar: "",
    isFirstTime: true,
  })

  const [favorites, setFavorites] = useState<AnimeItem[]>([])
  const [watching, setWatching] = useState<AnimeItem[]>([])
  const [completed, setCompleted] = useState<AnimeItem[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])

  const [currentSection, setCurrentSection] = useState<"favorites" | "watching" | "completed" | "history">("favorites")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<number | null>(null)
  const [notification, setNotification] = useState("")
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)
  const [showProfileEditModal, setShowProfileEditModal] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null) // Ref para el input de archivo

  const defaultAvatars = [
    "https://ldanimes.rf.gd/Perfil/Perfil%201.jpg",
    "https://ldanimes.rf.gd/Perfil/Perfil%202.jpg",
    "https://ldanimes.rf.gd/Perfil/Perfil%203.jpg",
    "https://ldanimes.rf.gd/Perfil/Perfil%204.png",
  ]

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(""), 3000)
  }

  useEffect(() => {
    // Cargar datos del localStorage
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserProfile(profile)
      // Si es primera vez, mostrar modal de bienvenida
      if (profile.isFirstTime) {
        setShowWelcomeModal(true)
      }
    } else {
      // Si no hay perfil guardado, es primera vez
      setShowWelcomeModal(true)
    }

    // Cargar listas de animes
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))

    const savedWatching = localStorage.getItem("watching")
    if (savedWatching) setWatching(JSON.parse(savedWatching))

    const savedCompleted = localStorage.getItem("completed")
    if (savedCompleted) setCompleted(JSON.parse(savedCompleted))

    const savedHistory = localStorage.getItem("history")
    if (savedHistory) setHistory(JSON.parse(savedHistory))
  }, [])

  const confirmDeleteItem = (id: number) => {
    setItemToDelete(id)
    setShowDeleteConfirm(true)
  }

  const removeFromHistory = () => {
    if (itemToDelete) {
      const newHistory = history.filter((item) => item.id !== itemToDelete)
      setHistory(newHistory)
      localStorage.setItem("history", JSON.stringify(newHistory))
      showNotification("Elemento eliminado del historial")
      setShowDeleteConfirm(false)
      setItemToDelete(null)
    }
  }

  const confirmClearAll = () => {
    setShowClearAllConfirm(true)
  }

  const clearAllHistory = () => {
    setHistory([])
    localStorage.setItem("history", JSON.stringify([]))
    showNotification("Historial borrado completamente")
    setShowClearAllConfirm(false)
  }

  const renderAnimeGrid = (items: AnimeItem[]) => {
    if (items.length === 0) {
      let icon: React.ReactNode
      let message: string
      if (currentSection === "favorites") {
        icon = <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        message = "No tienes animes en favoritos"
      } else if (currentSection === "watching") {
        icon = <Eye className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        message = "No tienes animes viendo"
      } else {
        // completed
        icon = <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        message = "No tienes animes terminados"
      }
      return (
        <div className="col-span-full text-center py-12">
          {icon}
          <p className="text-muted-foreground">{message}</p>
        </div>
      )
    }

    return items.map((item) => (
      <Link key={item.id} href={item.url}>
        <div className="space-y-2 cursor-pointer group">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized
            />
          </div>
          <h3 className="text-sm font-medium truncate group-hover:text-[#5271ff]">{item.name}</h3>
        </div>
      </Link>
    ))
  }

  const renderHistory = () => {
    if (history.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Tu historial está vacío</p>
        </div>
      )
    }

    return history.map((item) => (
      <div key={item.id}>
        <Card className="anime-card cursor-pointer group">
          <CardContent className="p-0">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Link href={`${item.url}?episode=${item.episode}`} className="flex items-center justify-center">
                  <Button size="sm" className="bg-[#5271ff] hover:bg-[#4461ee]">
                    <Play className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Ep. {item.episode}
              </div>
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
                onClick={(e) => {
                  e.preventDefault()
                  confirmDeleteItem(item.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#5271ff] transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {item.date} a las {item.time}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    ))
  }

  const handleAvatarSelect = (avatar: string) => {
    const newProfile = {
      ...userProfile,
      avatar: avatar,
    }
    setUserProfile(newProfile)
    localStorage.setItem("userProfile", JSON.stringify(newProfile))
    showNotification("Avatar actualizado correctamente")
  }

  const handleProfileSave = (username: string) => {
    const newProfile = {
      ...userProfile,
      username: username,
    }
    setUserProfile(newProfile)
    localStorage.setItem("userProfile", JSON.stringify(newProfile))
    showNotification("Perfil actualizado correctamente")
  }

  const handleWelcomeComplete = (username: string, avatar: string) => {
    const newProfile = {
      username: username,
      avatar: avatar,
      isFirstTime: false,
    }
    setUserProfile(newProfile)
    localStorage.setItem("userProfile", JSON.stringify(newProfile))
    setShowWelcomeModal(false)
    showNotification("¡Perfil creado exitosamente!")
  }

  // Nueva función para manejar la subida de imagen personalizada desde la página de cuenta
  const handleCustomAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newProfile = {
          ...userProfile,
          avatar: reader.result as string,
        }
        setUserProfile(newProfile)
        localStorage.setItem("userProfile", JSON.stringify(newProfile))
        showNotification("Imagen de perfil actualizada")
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="pt-16 pb-24">
      {/* Notificación */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-lg z-50 border border-gray-700">
          {notification}
        </div>
      )}

      {/* Header del perfil */}
      <div className="bg-background border-b-2 border-border p-6 text-center relative">
        <div className="absolute top-4 left-4 flex gap-2">
          <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setShowProfileEditModal(true)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full text-yellow-500 hover:text-yellow-600"
            onClick={() => setShowSubscriptionModal(true)}
          >
            <Crown className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative w-24 h-24 mx-auto mb-4">
          <Avatar className="h-24 w-24 border-4 border-[#5271ff]">
            {userProfile.avatar &&
            (userProfile.avatar.endsWith(".gif") || userProfile.avatar.startsWith("data:image/gif")) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={userProfile.avatar || "/placeholder.svg"}
                alt="Avatar de usuario"
                className="rounded-full object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.src = defaultAvatars[0]
                }}
              />
            ) : (
              <AvatarImage
                src={userProfile.avatar || defaultAvatars[0]}
                className="object-cover"
                onError={() => {
                  // Fallback silencioso sin console.error
                }}
              />
            )}
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          {/* Icono de lápiz para subir imagen */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-[#5271ff] text-white rounded-full p-2 border-2 border-background shadow-md hover:bg-[#4461ee] transition-colors"
            aria-label="Subir imagen de perfil"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleCustomAvatarUpload}
            className="hidden"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4">{userProfile.username}</h1>

        {/* El botón "Cambiar Imagen" ahora abre el selector de avatares predefinidos */}
        <Button onClick={() => setShowAvatarSelector(true)} className="bg-[#5271ff] hover:bg-[#4461ee] rounded-full">
          Seleccionar Avatar
        </Button>
      </div>

      {/* Contadores */}
      <div className="flex justify-around py-4 border-b">
        <div className="text-center">
          <div className="text-2xl font-bold">{favorites.length}</div>
          <div className="text-sm text-muted-foreground">Favoritos</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{watching.length}</div>
          <div className="text-sm text-muted-foreground">Viendo</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{completed.length}</div>
          <div className="text-sm text-muted-foreground">Terminados</div>
        </div>
      </div>

      {/* Botones de categoría */}
      <div className="flex justify-center gap-4 py-4 border-b">
        <Button
          size="icon"
          variant={currentSection === "favorites" ? "default" : "outline"}
          className={`h-12 w-12 rounded-lg ${currentSection === "favorites" ? "bg-[#5271ff] border-2 border-yellow-500" : ""}`}
          onClick={() => setCurrentSection("favorites")}
        >
          <Heart className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant={currentSection === "watching" ? "default" : "outline"}
          className={`h-12 w-12 rounded-lg ${currentSection === "watching" ? "bg-[#5271ff] border-2 border-yellow-500" : ""}`}
          onClick={() => setCurrentSection("watching")}
        >
          <Eye className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant={currentSection === "completed" ? "default" : "outline"}
          className={`h-12 w-12 rounded-lg ${currentSection === "completed" ? "bg-[#5271ff] border-2 border-yellow-500" : ""}`}
          onClick={() => setCurrentSection("completed")}
        >
          <Bookmark className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant={currentSection === "history" ? "default" : "outline"}
          className={`h-12 w-12 rounded-lg ${currentSection === "history" ? "bg-[#5271ff] border-2 border-yellow-500" : ""}`}
          onClick={() => setCurrentSection("history")}
        >
          <History className="h-5 w-5" />
        </Button>
      </div>

      {/* Contenido de secciones */}
      <div className="p-4">
        <div className="border-b mb-4">
          <h2 className="text-2xl font-bold py-4">
            {currentSection === "favorites" && "Favoritos"}
            {currentSection === "watching" && "Viendo"}
            {currentSection === "completed" && "Terminados"}
            {currentSection === "history" && "Historial"}
          </h2>
        </div>

        {/* Botón de borrar historial - solo aparece cuando hay elementos */}
        {currentSection === "history" && history.length > 0 && (
          <div className="mb-4 text-center">
            <Button variant="destructive" className="mb-4" onClick={confirmClearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Borrar Todo
            </Button>
          </div>
        )}

        <div
          className={`grid gap-4 ${
            currentSection === "history"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6" // Changed to responsive grid instead of single column
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
          }`}
        >
          {currentSection === "favorites" && renderAnimeGrid(favorites)}
          {currentSection === "watching" && renderAnimeGrid(watching)}
          {currentSection === "completed" && renderAnimeGrid(completed)}
          {currentSection === "history" && renderHistory()}
        </div>
      </div>

      {/* Modal de confirmación para borrar elemento individual */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">¿Eliminar episodio?</h3>
              <p className="text-center text-muted-foreground mb-6">
                Esta acción eliminará este episodio de tu historial. No se puede deshacer.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setItemToDelete(null)
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button onClick={removeFromHistory} variant="destructive" className="flex-1">
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de confirmación para borrar todo */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <AlertTriangle className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">¿Borrar todo el historial?</h3>
              <p className="text-center text-muted-foreground mb-6">
                Esta acción eliminará completamente tu historial de episodios vistos. No se puede deshacer.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowClearAllConfirm(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={clearAllHistory} variant="destructive" className="flex-1">
                  Borrar Todo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de editar perfil básico */}
      <ProfileEditModal
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        currentUsername={userProfile.username}
        onSave={handleProfileSave}
      />

      {/* Selector de avatares avanzado */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelectAvatar={handleAvatarSelect}
        currentAvatar={userProfile.avatar}
      />

      {/* Modal de suscripción */}
      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} />

      {/* Modal de bienvenida para nuevos usuarios */}
      <WelcomeModal isOpen={showWelcomeModal} onComplete={handleWelcomeComplete} />

      <SidebarMenu />
    </div>
  )
}
