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

## Cuentas y roles (Supabase)

1. Crear un proyecto en https://supabase.com (plan gratis).
2. SQL Editor → pegar `supabase/01-usuarios-y-roles.sql` → Run.
3. Authentication → URL Configuration:
   - Site URL: `https://mishon.com.ar`
   - Redirect URLs: `https://mishon.com.ar/**` y `http://localhost:3000/**`
4. Settings → API: copiar la URL y la clave `anon` a `.env.local` (y a Vercel → Settings → Environment Variables):

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

5. Registrarse en `/registrarme` y, en el SQL Editor, hacerse admin:
   `update public.perfiles set rol = 'admin' where email = 'TU_MAIL';`

Roles: **cliente** (todos arrancan así), **logística** (pedidos y envíos, sin precios),
**equipo** (todo el negocio, menos cambiar roles) y **admin** (todo). Los roles se cambian
en `/gestion/usuarios`. El panel `/admin` sigue siendo aparte, para editar los textos del sitio.

## Lista de espera y mails (Resend)

1. En Supabase, SQL Editor → pegar `supabase/02-lista-de-espera.sql` → Run.
2. Crear cuenta en https://resend.com, agregar el dominio `mishon.com.ar` (Domains → Add domain)
   y cargar en el DNS del dominio los registros que muestra. Esperar a que diga "Verified".
3. Resend → API Keys → Create API key. Cargarla en `.env.local` y en Vercel:

   ```
   RESEND_API_KEY=...
   MAIL_REMITENTE=Mishón <hola@mishon.com.ar>
   ```

4. Para que los mails de Supabase (confirmar cuenta, recuperar contraseña) salgan desde Mishón:
   - Supabase → Authentication → Emails → SMTP Settings → activar "custom SMTP":
     host `smtp.resend.com`, puerto `465`, usuario `resend`, contraseña: la API key de Resend,
     remitente `hola@mishon.com.ar`, nombre `Mishón`.
   - Supabase → Authentication → Emails → Templates: en "Confirm signup" pegar
     `supabase/mails/confirmar-cuenta.html` y en "Reset password" pegar `supabase/mails/recuperar-clave.html`.

El formulario "Avisame primero" guarda el mail y manda la bienvenida. El mail de lanzamiento se
edita, se prueba y se envía desde `/gestion/mails`.

## Pendiente

- Productos (de a 250 g), precios y stock, cargables desde `/gestion/ventas`.
- Carrito y checkout con Mercado Pago Checkout Pro (credenciales de prueba primero).
- Pedidos y envíos en CABA/zona, en `/gestion/pedidos` y `/gestion/envios`.
