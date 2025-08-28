"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, RefreshCw } from "lucide-react"

export function AdBlockerDetector() {
  const [isBlocked, setIsBlocked] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const detectAdBlocker = async () => {
      try {
        // Marcar que estamos usando el bloqueador interno de la app
        window.ldAnimesInternalAdBlocker = true

        const testExternalAds = async () => {
          const tests: Promise<boolean>[] = []

          // Test 1: Intentar cargar Google AdSense (bloqueadores externos lo bloquean)
          tests.push(
            new Promise((resolve) => {
              const script = document.createElement("script")
              script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
              script.onload = () => resolve(false) // No bloqueado
              script.onerror = () => resolve(true) // Bloqueado
              script.style.display = "none"
              document.head.appendChild(script)

              // Limpiar después de la prueba
              setTimeout(() => {
                if (document.head.contains(script)) {
                  document.head.removeChild(script)
                }
              }, 1000)
            }),
          )

          // Test 2: Verificar si window.adsbygoogle está disponible
          tests.push(
            new Promise((resolve) => {
              setTimeout(() => {
                resolve(typeof window.adsbygoogle === "undefined")
              }, 500)
            }),
          )

          // Test 3: Intentar hacer un fetch a un dominio de anuncios conocido (modo no-cors para evitar errores de CORS directos)
          tests.push(
            new Promise(async (resolve) => {
              try {
                // Usamos HEAD para una solicitud ligera y no-cors para que no falle por CORS si el bloqueador no interviene
                // Si el fetch falla (ej. por un bloqueador de red), el catch se activará.
                await fetch("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", {
                  method: "HEAD",
                  mode: "no-cors",
                })
                resolve(false) // No bloqueado (la solicitud se completó o fue opaca)
              } catch (error) {
                // Fetch falló, probablemente debido a un bloqueador de anuncios
                resolve(true) // Bloqueado
              }
            }),
          )

          // Test 4: Intentar crear elementos de anuncios específicos que solo bloqueadores externos bloquean
          const externalAdTest = new Promise((resolve) => {
            const testDiv = document.createElement("div")
            // Usar una combinación de clases comunes y una más genérica
            testDiv.className = "ad-container ad-banner-unit x-ad-block-test"
            testDiv.style.position = "absolute"
            testDiv.style.left = "-10000px"
            testDiv.style.width = "1px" // Dimensiones mínimas para activar algunos bloqueadores
            testDiv.style.height = "1px"
            testDiv.innerHTML = "Test Ad Content"

            document.body.appendChild(testDiv)

            setTimeout(() => {
              const isBlocked =
                testDiv.offsetHeight === 0 ||
                testDiv.offsetWidth === 0 ||
                window.getComputedStyle(testDiv).display === "none" ||
                window.getComputedStyle(testDiv).visibility === "hidden" // Añadir visibilidad

              if (document.body.contains(testDiv)) {
                document.body.removeChild(testDiv)
              }
              resolve(isBlocked)
            }, 200)
          })
          tests.push(externalAdTest)

          // Ejecutar todas las pruebas
          const results = await Promise.all(tests)
          const blockedCount = results.filter(Boolean).length

          // Considerar bloqueado si al menos 2 de las 4 pruebas fallan
          if (blockedCount >= 2) {
            setIsBlocked(true)
          } else {
            setIsBlocked(false)
            // Guardar verificación exitosa por 24 horas
            localStorage.setItem("adBlockerVerified", Date.now().toString())
          }

          setIsChecking(false)
        }

        // Verificar si el usuario ya fue verificado recientemente (24 horas)
        const lastVerified = localStorage.getItem("adBlockerVerified")
        const isRecentlyVerified = lastVerified && Date.now() - Number.parseInt(lastVerified) < 24 * 60 * 60 * 1000

        if (isRecentlyVerified) {
          setIsBlocked(false)
          setIsChecking(false)
          return
        }

        // Esperar un poco antes de detectar para no interferir con la carga inicial
        setTimeout(testExternalAds, 1000)
      } catch (error) {
        // En caso de error inesperado en la detección, asumir que no hay bloqueador externo
        console.error("Error general en la detección de AdBlocker:", error)
        setIsBlocked(false)
        setIsChecking(false)
      }
    }

    detectAdBlocker()
  }, [])

  const handleRefresh = () => {
    setIsChecking(true)
    setIsBlocked(false)
    // Limpiar verificación anterior
    localStorage.removeItem("adBlockerVerified")
    window.location.reload()
  }

  if (isChecking) {
    return null // No mostrar nada mientras se verifica
  }

  if (!isBlocked) {
    return null // No mostrar nada si no hay bloqueador externo
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background border border-border shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Shield className="h-16 w-16 text-[#5271ff] mx-auto mb-4" />
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">🚫 Bloqueador Detectado</h2>
              <div className="h-1 bg-[#5271ff] rounded-full"></div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <p className="text-lg font-semibold text-foreground">Hemos detectado un bloqueador de anuncios</p>
            <p className="text-sm text-muted-foreground">Por favor, desactívelo para apoyar la aplicación</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRefresh}
              className="w-full bg-[#5271ff] hover:bg-[#4461ee] text-white font-bold py-3 rounded-lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar de nuevo
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Los anuncios nos ayudan a mantener este servicio gratuito
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
