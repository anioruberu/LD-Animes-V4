import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const query = searchParams.get("q")
  const genre = searchParams.get("genre")
  const status = searchParams.get("status")
  const type = searchParams.get("type")
  const language = searchParams.get("language")
  const sort = searchParams.get("sort")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "24")
  const isDirectory = searchParams.get("directory") === "true"

  try {
    // Fetch single anime by ID
    if (id) {
      const { data: anime, error } = await supabase.from("animes").select("*").eq("id", id).single()

      if (error || !anime) {
        return new NextResponse("Anime not found", { status: 404 })
      }

      // Transformar para mantener compatibilidad con el frontend
      const transformedAnime = {
        ...anime,
        episodesLinks: anime.episodes_links || {
          subtitulado: [],
          "español latino": [],
        },
      }

      return NextResponse.json({ data: transformedAnime })
    }

    // Build query
    let queryBuilder = supabase.from("animes").select("*")

    // Apply filters
    if (query) {
      queryBuilder = queryBuilder.ilike("title", `%${query}%`)
    }

    if (genre && genre !== "all") {
      // Normalizar el género para la búsqueda
      const genreToSearch = genre
      queryBuilder = queryBuilder.contains("genres", [genreToSearch])
    }

    if (status && status !== "all") {
      const statusMap: { [key: string]: string } = {
        "en-emision": "En Emisión",
        finalizado: "Finalizado",
        proximamente: "Próximamente",
      }
      queryBuilder = queryBuilder.eq("status", statusMap[status] || status)
    }

    if (type && type !== "all") {
      queryBuilder = queryBuilder.ilike("type", type)
    }

    if (language && language !== "all") {
      queryBuilder = queryBuilder.eq("language", language)
    }

    let totalCount = 0

    // Para directorio, primero obtenemos el conteo total
    if (isDirectory) {
      const { count } = await supabase.from("animes").select("*", { count: "exact", head: true })
      totalCount = count || 0
    }

    // Apply sorting and limits
    if (sort === "recent") {
      // Animes recientes (ordenados por fecha de creación)
      queryBuilder = queryBuilder.order("created_at", { ascending: false }).limit(20)
    } else if (sort === "most-viewed") {
      // Animes más vistos
      queryBuilder = queryBuilder.order("views", { ascending: false }).limit(20)
    } else if (sort === "most-popular") {
      // Animes más populares (por puntuación)
      queryBuilder = queryBuilder.order("score", { ascending: false }).limit(20)
    } else if (sort === "latino") {
      // Animes con enlaces en español latino
      queryBuilder = queryBuilder.not("episodes_links->español latino", "is", null).limit(20)
    } else if (isDirectory) {
      const offset = (page - 1) * limit
      queryBuilder = queryBuilder.order("created_at", { ascending: false }).range(offset, offset + limit - 1)
    } else {
      // Default: ordenar por ID (más recientes primero)
      queryBuilder = queryBuilder.order("id", { ascending: false }).limit(50)
    }

    const { data: animes, error } = await queryBuilder

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Transformar datos para mantener compatibilidad con el frontend
    const transformedAnimes = animes?.map((anime) => ({
      ...anime,
      episodesLinks: anime.episodes_links || {
        subtitulado: [],
        "español latino": [],
      },
    }))

    const totalPages = isDirectory ? Math.ceil(totalCount / limit) : 1
    const totalItems = isDirectory ? totalCount : animes?.length || 0

    return NextResponse.json({
      data: transformedAnimes || [],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
