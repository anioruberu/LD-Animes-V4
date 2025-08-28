"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Play, Star, Trash2 } from "lucide-react"
import Image from "next/image"

interface FavoriteItem {
  id: number
  title: string
  image: string
  score: number
  progress: string
  addedDate: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 1,
      title: "Ataque a los Titanes",
      image: "/placeholder.svg?height=300&width=200",
      score: 9.0,
      progress: "87/87 episodios",
      addedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Demon Slayer",
      image: "/placeholder.svg?height=300&width=200",
      score: 8.7,
      progress: "26/26 episodios",
      addedDate: "2024-01-20",
    },
    {
      id: 3,
      title: "My Hero Academia",
      image: "/placeholder.svg?height=300&width=200",
      score: 8.5,
      progress: "138/138 episodios",
      addedDate: "2024-01-25",
    },
    {
      id: 4,
      title: "One Punch Man",
      image: "/placeholder.svg?height=300&width=200",
      score: 8.8,
      progress: "24/24 episodios",
      addedDate: "2024-01-30",
    },
  ])

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <Heart className="h-8 w-8 text-[#5271ff] fill-[#5271ff]" />
            Mis Animes Favoritos
          </h1>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>{favorites.length} Animes</span>
          </div>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aún no tienes favoritos</h3>
            <p className="text-muted-foreground">¡Comienza agregando animes a tus favoritos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <Card key={item.id} className="anime-card group">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-[#5271ff] hover:bg-[#4461ee]">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => removeFavorite(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge variant="destructive" className="text-xs">
                        ANIME
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.score}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Agregado {new Date(item.addedDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground">Progreso: {item.progress}</div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-[#5271ff]`}
                          style={{
                            width: `${Math.random() * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
