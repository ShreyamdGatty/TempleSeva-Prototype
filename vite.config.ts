import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

const srcImage = 'C:/Users/SEEMA/.gemini/antigravity-ide/brain/93ba6c5c-6439-45fb-b97f-740f81358c91/.user_uploaded/media_1792398749229.png'
const destImage = path.resolve(__dirname, 'public/home-top-temple.png')

try {
  if (fs.existsSync(srcImage)) {
    fs.copyFileSync(srcImage, destImage)
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