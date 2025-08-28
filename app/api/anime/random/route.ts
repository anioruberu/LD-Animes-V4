import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: animes, error } = await supabase
      .from("animes")
      .select("*")
      .order("id", { ascending: false })
      .limit(1000) // Obtener una muestra grande para mejor aleatoriedad

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: "Database error" }, { status: 500 })
    }

    if (animes && animes.length > 0) {
      // Seleccionar un anime aleatorio de la lista
      const randomIndex = Math.floor(Math.random() * animes.length)
      const randomAnime = animes[randomIndex]

      // Transformar para mantener compatibilidad con el frontend
      const transformedAnime = {
        ...randomAnime,
        episodesLinks: randomAnime.episodes_links || {
          subtitulado: [],
          "español latino": [],
        },
      }

      return NextResponse.json({ success: true, anime: transformedAnime })
    }

    return NextResponse.json({ success: false, message: "No anime found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching random anime:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
