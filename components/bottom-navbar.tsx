"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, List, User } from "lucide-react"

export function BottomNavbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/buscador", label: "Buscar", icon: Search },
    { href: "/directorio", label: "Directorio", icon: List },
    { href: "/cuenta", label: "Cuenta", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 min-w-0 flex-1 ${
                isActive ? "text-[#5271ff]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "text-[#5271ff]" : ""}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
