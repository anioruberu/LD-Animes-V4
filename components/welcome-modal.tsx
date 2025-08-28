"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Camera } from 'lucide-react'
import { AvatarSelector } from "@/components/avatar-selector"

interface WelcomeModalProps {
  isOpen: boolean
  onComplete: (username: string, avatar: string) => void
}

export function WelcomeModal({ isOpen, onComplete }: WelcomeModalProps) {
  const [step, setStep] = useState(1)
  const [username, setUsername] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState("")
  const [showAvatarSelector, setShowAvatarSelector] = useState(false)

  const defaultAvatars = [
    "https://ldanimes.rf.gd/Perfil/Perfil%201.jpg",
    "https://ldanimes.rf.gd/Perfil/Perfil%202.jpg",
    "https://ldanimes.rf.gd/Perfil/Perfil%203.jpg",
    "https://ldanimes.rf.gd/Perfil/Perfil%204.png",
  ]

  // Bloquear scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      // Establecer avatar por defecto si no hay uno seleccionado
      if (!selectedAvatar) {
        setSelectedAvatar(defaultAvatars[0])
      }
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleContinue = () => {
    if (step === 1 && username.trim()) {
      setStep(2)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setStep(1)
    }
  }

  const handleComplete = () => {
    if (username.trim() && selectedAvatar) {
      onComplete(username.trim(), selectedAvatar)
    }
  }

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
    setShowAvatarSelector(false)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-background border-border shadow-2xl">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-[#5271ff]">¡Bienvenido a LD Animes!</h1>
                  <p className="text-muted-foreground">Configura tu perfil para comenzar</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-left block">
                      Nombre de usuario
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Ingresa tu nombre de usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.slice(0, 20))}
                      className="text-center"
                      maxLength={20}
                    />
                    <p className="text-xs text-muted-foreground text-right">{username.length}/20 caracteres</p>
                  </div>

                  <Button
                    onClick={handleContinue}
                    disabled={!username.trim()}
                    className="w-full bg-[#5271ff] hover:bg-[#4461ee] text-white"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-semibold">Elige tu avatar</h2>
                  <div className="w-10" /> {/* Spacer */}
                </div>

                <div className="space-y-4">
                  <div className="relative w-24 h-24 mx-auto">
                    <Avatar className="w-24 h-24 border-4 border-[#5271ff]">
                      <AvatarImage src={selectedAvatar || defaultAvatars[0]} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </div>

                  <Button
                    onClick={() => setShowAvatarSelector(true)}
                    className="w-full bg-[#5271ff] hover:bg-[#4461ee] text-white"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Seleccionar Imagen
                  </Button>

                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" onClick={handleBack} className="flex-1 bg-transparent">
                      Atrás
                    </Button>
                    <Button
                      onClick={handleComplete}
                      disabled={!selectedAvatar}
                      className="flex-1 bg-[#5271ff] hover:bg-[#4461ee] text-white"
                    >
                      Completar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selector de avatares */}
      <AvatarSelector
        isOpen={showAvatarSelector}
        onClose={() => setShowAvatarSelector(false)}
        onSelectAvatar={handleAvatarSelect}
        currentAvatar={selectedAvatar || defaultAvatars[0]}
      />
    </>
  )
}
