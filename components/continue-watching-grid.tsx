"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Play, X, AlertTriangle } from "lucide-react" // Importar X y AlertTriangle
import Image from "next/image"
import Link from "next/link"

interface HistoryItem {
  id: number
  name: string
  image: string
  episode: number
  date: string
  time: string
  url: string
}

export function ContinueWatchingGrid() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false) // Estado para el modal de confirmación
  const [itemToDeleteId, setItemToDeleteId] = useState<number | null>(null) // ID del elemento a borrar

  useEffect(() => {
    // Cargar historial desde localStorage
    const savedHistory = localStorage.getItem("history")
    if (savedHistory) {
      setHistoryItems(JSON.parse(savedHistory))
    }
  }, [])

  const showNotification = (message: string) => {
    // Implementar notificación si es necesario, o usar un hook global
    console.log(message) // Por ahora, solo loguear
  }

  const confirmDeleteItem = (id: number) => {
    setItemToDeleteId(id)
    setShowDeleteConfirm(true)
  }

  const handleRemoveFromHistory = () => {
    if (itemToDeleteId !== null) {
      const newHistory = historyItems.filter((item) => item.id !== itemToDeleteId)
      setHistoryItems(newHistory)
      localStorage.setItem("history", JSON.stringify(newHistory))
      showNotification("Episodio eliminado del historial")
      setShowDeleteConfirm(false)
      setItemToDeleteId(null)
    }
  }

  // Si no hay elementos en el historial, no renderizar nada
  if (historyItems.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <History className="h-6 w-6 text-blue-500" />
          Seguir Viendo
        </h2>
      </div>

      {/* La estructura de scroll horizontal ya está implementada aquí */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-4 pb-2" style={{ width: "max-content" }}>
          {historyItems.map((item) => (
            <div key={item.id} className="flex-shrink-0">
              <Card className="anime-card cursor-pointer group w-[200px]">
                {" "}
                {/* Aumentado el ancho para horizontal */}
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    {" "}
                    {/* Cambiado a aspect-video */}
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
                    {/* Botón de eliminar con confirmación */}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
                      onClick={(e) => {
                        e.preventDefault() // Prevenir la navegación del Link
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
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
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
                    setItemToDeleteId(null)
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button onClick={handleRemoveFromHistory} variant="destructive" className="flex-1">
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  )
}
