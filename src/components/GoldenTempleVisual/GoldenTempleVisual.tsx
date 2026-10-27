import { useEffect, useRef, useState } from 'react'

interface GoldenTempleVisualProps {
  className?: string
}

export const GoldenTempleVisual = ({ className = '' }: GoldenTempleVisualProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Client-side background removal to remove dark background & guarantee 100% clean temple
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = '/golden-temple-hero.jpg'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        setCutoutUrl('/golden-temple-hero.jpg')
        setIsLoaded(true)
        return
      }

      ctx.drawImage(img, 0, 0)
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        // Background is dark brown/charcoal (R < 60, G < 48, B < 45).
        // Smoothly fade out edges to create an ultra-clean, transparent cutout
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]

          // Dark background detection threshold
          if (r < 58 && g < 48 && b < 44) {
            data[i + 3] = 0 // fully transparent
          } else if (r < 80 && g < 62 && b < 52) {
            // Feathered soft edge transition
            const alphaFactor = Math.max(0, Math.min(1, (r - 58) / 22))
            data[i + 3] = Math.round(data[i + 3] * alphaFactor)
          }
        }

        ctx.putImageData(imageData, 0, 0)
        const url = canvas.toDataURL('image/png')
        setCutoutUrl(url)
      } catch {
        // Fallback to direct image if canvas security restricts
        setCutoutUrl('/golden-temple-hero.jpg')
      }
      setIsLoaded(true)
    }

    img.onerror = () => {
      setCutoutUrl('/golden-temple-hero.jpg')
      setIsLoaded(true)
    }
  }, [])

  return (
    <div className={`relative flex items-center justify-center pt-6 lg:pt-0 ${className}`}>
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── 1. Sacred Golden Aura & Radiance Layer ── */}
      <div className="absolute -inset-10 rounded-full bg-gradient-to-tr from-[#df5619]/35 via-[#f59e0b]/35 to-[#d4a64a]/25 blur-3xl -z-10 pointer-events-none animate-pulse" />
      <div className="absolute h-[520px] w-[520px] rounded-full bg-amber-400/20 blur-2xl -z-10 pointer-events-none" />

      {/* ── 2. Rotating Sacred Mandala Rings (Animation Effect) ── */}
      <div
        className="absolute h-[580px] w-[580px] max-w-full rounded-full border border-dashed border-[#d4a64a]/45 -z-10 pointer-events-none animate-spin-slow select-none"
        style={{ animationDuration: '45s' }}
      />
      <div
        className="absolute h-[460px] w-[460px] max-w-full rounded-full border border-[#c1440e]/30 -z-10 pointer-events-none animate-spin-slow select-none"
        style={{ animationDuration: '30s', animationDirection: 'reverse' }}
      />

      {/* ── 3. Main Temple Animated Container (Large & Majestic) ── */}
      <div className="relative w-full max-w-[580px] lg:max-w-[680px] flex items-center justify-center">
        {/* Floating Animation Wrapper */}
        <div className="relative w-full group cursor-pointer transition-transform duration-700 hover:scale-105 flex items-center justify-center">
          {/* Saffron/Gold Radiant Drop Shadow Effect */}
          <div className="w-full flex items-center justify-center transition-all duration-700 ease-out">
            <img
              src={cutoutUrl || '/golden-temple-hero.jpg'}
              alt="Sacred Golden Temple Sanctum"
              className={`w-full h-auto max-h-[560px] sm:max-h-[600px] lg:max-h-[660px] object-contain select-none pointer-events-none filter transition-all duration-1000 ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              style={{
                animation: 'divineFloat 6s ease-in-out infinite',
                filter:
                  'drop-shadow(0 0 25px rgba(245, 158, 11, 0.45)) drop-shadow(0 20px 40px rgba(112, 26, 35, 0.35))',
              }}
            />
          </div>

          {/* Floating Auspicious Light Ray Sheen */}
          <div
            className="absolute -inset-4 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl bg-gradient-to-r from-transparent via-[#f59e0b]/25 to-transparent"
            style={{ animation: 'shimmerSweep 4s infinite linear' }}
          />
        </div>

      </div>

      {/* Embedded CSS Keyframe Animations for Divine Float & Aura */}
      <style>{`
        @keyframes divineFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(0.4deg);
          }
        }
        @keyframes shimmerSweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
