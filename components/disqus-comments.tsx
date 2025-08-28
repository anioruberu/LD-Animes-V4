"use client"

import { useEffect } from "react"

interface DisqusCommentsProps {
  identifier: string
  title: string
  url: string
}

export function DisqusComments({ identifier, title, url }: DisqusCommentsProps) {
  useEffect(() => {
    // Reset Disqus if it already exists
    if (window.DISQUS) {
      window.DISQUS.reset({
        reload: true,
        config: function () {
          this.page.identifier = identifier
          this.page.url = url
          this.page.title = title
        },
      })
    } else {
      // Configure Disqus
      window.disqus_config = function () {
        this.page.url = url
        this.page.identifier = identifier
        this.page.title = title
      }

      // Load Disqus script
      const script = document.createElement("script")
      script.src = "https://ld-animes.disqus.com/embed.js"
      script.setAttribute("data-timestamp", Date.now().toString())
      document.body.appendChild(script)
    }
  }, [identifier, title, url])

  return (
    <div className="mt-8">
      <div id="disqus_thread"></div>
      <noscript>
        Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
      </noscript>
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    DISQUS: any
    disqus_config: () => void
  }
}
