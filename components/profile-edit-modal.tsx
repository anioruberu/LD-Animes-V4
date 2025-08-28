"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentUsername: string
  onSave: (username: string) => void
}

export function ProfileEditModal({ isOpen, onClose, currentUsername, onSave }: ProfileEditModalProps) {
  const [tempUsername, setTempUsername] = useState("")

  // Actualizar el username temporal cuando se abre el modal o cambia el username actual
  useEffect(() => {
    if (isOpen) {
      setTempUsername(currentUsername)
    }
  }, [isOpen, currentUsername])

  const handleSave = () => {
    if (!tempUsername.trim()) {
      return
    }
    onSave(tempUsername.trim())
    onClose()
  }

  const handleClose = () => {
    // Resetear al valor original al cerrar
    setTempUsername(currentUsername)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Editar Perfil</h3>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de usuario</label>
              <Input
                placeholder="Nombre de usuario"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                maxLength={20}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground text-right mt-1">
                {tempUsername.length}/20 caracteres
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-[#5271ff] hover:bg-[#4461ee]"
                disabled={!tempUsername.trim() || tempUsername.trim() === currentUsername}
              >
                Guardar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
