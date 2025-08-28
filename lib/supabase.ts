import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ajpjndeuxxyhwybfeymb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcGpuZGV1eHh5aHd5YmZleW1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NTkyMjQsImV4cCI6MjA3MDAzNTIyNH0.nYL8jV23kVjoXWkMlPu8oaE8LpvqOdfJtrLZZJiZfco'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos TypeScript para la base de datos
export type Database = {
  public: {
    Tables: {
      animes: {
        Row: {
          id: number
          title: string
          image: string | null
          score: number | null
          year: number | null
          status: string | null
          type: string | null
          episodes: number | null
          genres: string[] | null
          synopsis: string | null
          views: number | null
          language: string | null
          episodes_links: {
            subtitulado?: string[]
            "español latino"?: string[]
          } | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          title: string
          image?: string | null
          score?: number | null
          year?: number | null
          status?: string | null
          type?: string | null
          episodes?: number | null
          genres?: string[] | null
          synopsis?: string | null
          views?: number | null
          language?: string | null
          episodes_links?: {
            subtitulado?: string[]
            "español latino"?: string[]
          } | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          image?: string | null
          score?: number | null
          year?: number | null
          status?: string | null
          type?: string | null
          episodes?: number | null
          genres?: string[] | null
          synopsis?: string | null
          views?: number | null
          language?: string | null
          episodes_links?: {
            subtitulado?: string[]
            "español latino"?: string[]
          } | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}

export type Anime = Database['public']['Tables']['animes']['Row']
