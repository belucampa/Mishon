# Molida

Landing de pre-lanzamiento, armada en Next.js + Tailwind.

## Poner en marcha en tu compu

```bash
npm install
npm run dev
```

Después abrís http://localhost:3000

## Subir a GitHub

```bash
git init
git add .
git commit -m "primer commit: landing migrada a Next.js"
git branch -M main
git remote add origin <URL-de-tu-repo-vacío-en-GitHub>
git push -u origin main
```

## Pendiente

- Conectar el formulario de la landing a Supabase (tabla de waitlist).
- Diseñar el esquema de productos/stock en Supabase.
- Integrar MercadoPago (Checkout Pro, modo sandbox primero).
- Comprar y conectar el dominio una vez confirmado el registro de marca.
