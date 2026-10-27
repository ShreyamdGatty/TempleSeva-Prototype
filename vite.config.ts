import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const srcImage = 'C:/Users/SEEMA/.gemini/antigravity-ide/brain/93ba6c5c-6439-45fb-b97f-740f81358c91/.user_uploaded/media_1792398749229.png'
const destImage = path.resolve(__dirname, 'public/home-top-temple.png')
const srcQrImage = 'C:/Users/SEEMA/.gemini/antigravity-ide/brain/3132f448-0f4d-44cc-84f6-0e8e4784cbdc/temple_qr_scan_1793087463651.jpg'
const destQrImage = path.resolve(__dirname, 'public/visit-temple-qr.jpg')

const srcGoldenTempleNoClouds = 'C:/Users/SEEMA/.gemini/antigravity-ide/brain/3132f448-0f4d-44cc-84f6-0e8e4784cbdc/golden_temple_no_clouds_1793096091366.jpg'
const destGoldenTempleHero = path.resolve(__dirname, 'public/golden-temple-hero.jpg')
const srcGoldenTempleRaw = 'C:/Users/SEEMA/.gemini/antigravity-ide/brain/3132f448-0f4d-44cc-84f6-0e8e4784cbdc/.user_uploaded/media_1793095949091.png'
const destGoldenTempleRaw = path.resolve(__dirname, 'public/golden-temple-raw.png')

try {
  if (fs.existsSync(srcImage)) {
    fs.copyFileSync(srcImage, destImage)
  }
  if (fs.existsSync(srcQrImage)) {
    fs.copyFileSync(srcQrImage, destQrImage)
  }
  if (fs.existsSync(srcGoldenTempleNoClouds)) {
    fs.copyFileSync(srcGoldenTempleNoClouds, destGoldenTempleHero)
  }
  if (fs.existsSync(srcGoldenTempleRaw)) {
    fs.copyFileSync(srcGoldenTempleRaw, destGoldenTempleRaw)
  }
} catch (e) {
  console.error('Error copying temple image:', e)
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})