# EyS · Ejes y Suspensiones — Sitio web

Sitio de una sola página (one-page), estático, sin frameworks ni dependencias.
Funciona en cualquier hosting: solo hay que subir los archivos.

---

## 📁 Estructura

```
PAGINA EYS/
├── index.html              ← todo el contenido de la página
├── servidor-local.ps1      ← para verla en la PC antes de publicar
├── LEEME.md                ← este archivo
└── assets/
    ├── css/styles.css      ← todos los estilos
    ├── js/main.js          ← animaciones, filtros, galería, formulario
    └── img/                ← todas las fotos (las de la web anterior)
```

---

## ▶️ Cómo verla en tu PC

Clic derecho sobre **`servidor-local.ps1`** → *Ejecutar con PowerShell*.
Se abre sola en `http://localhost:8765/`. Para cerrarla: `Ctrl + C` en la ventana negra.

> **Importante:** abrir `index.html` con doble clic también funciona en la mayoría de
> los navegadores, pero algunos bloquean el CSS y el JS por seguridad y se ve "rota".
> Por eso conviene usar el servidor local para previsualizar.

---

## 🌐 Cómo publicarla

Subí **todo el contenido de la carpeta** (index.html + carpeta `assets/`) a la raíz
del hosting, por FTP o desde el panel de control. No hace falta compilar nada.

Opciones gratuitas si querés probar antes: Netlify Drop, Cloudflare Pages o GitHub Pages
(en todas se arrastra la carpeta y listo).

---

## ✏️ Cómo cambiar los datos

Todo el texto está en **`index.html`**. Buscá y reemplazá:

| Qué                | Dónde buscar en `index.html`      | Valor actual                     |
|--------------------|-----------------------------------|----------------------------------|
| WhatsApp           | `5493416855469`                   | +54 9 341 685-5469               |
| Teléfono fijo      | `+543414983900`                   | 0341 498-3900                    |
| Email              | `info@ejesysuspensiones.com.ar`   | —                                |
| Dirección          | `Bv. San Diego 2103`              | Villa Gobernador Gálvez, Santa Fe |
| Horarios           | sección `<div class="hours">`     | Lun a Vie 8:00–17:00             |

⚠️ **El WhatsApp aparece en varios lugares** (menú, botón flotante, contacto, footer,
CTA final y en `main.js`). Si lo cambiás, usá *Reemplazar todo* con el número
`5493416855469` en `index.html` **y** en `assets/js/main.js`.

### Horarios de atención
Los horarios que figuran son un valor por defecto (la web anterior no los publicaba).
Revisalos y ajustalos en la sección `<div class="hours">` de `index.html`.

---

## 🖼️ Cómo cambiar o agregar fotos

1. Poné la foto nueva en `assets/img/`.
2. En `index.html`, cambiá el nombre del archivo en el `src` de la `<img>`
   **y** en el `data-img` del botón que la envuelve (es el que abre la galería ampliada).

Ejemplo — para agregar un trabajo nuevo, copiá un bloque `<article class="work">` completo
y cambiá foto, cliente, título y descripción. El atributo `data-cat` define en qué filtro
aparece: `eje`, `chasis` o `susp`.

**Consejo:** guardá las fotos a un ancho máximo de ~1600 px y en JPG de buena calidad.
Las actuales pesan entre 300 KB y 2 MB; comprimirlas (por ejemplo en squoosh.app) hace
que la página cargue bastante más rápido.

---

## 🎨 Cómo cambiar los colores

Todo está al principio de `assets/css/styles.css`, en el bloque `:root`:

```css
--red:   #d9261c;   /* rojo del logo EyS — color principal */
--ink:   #0e1319;   /* gris casi negro de los fondos oscuros */
--wsp:   #25d366;   /* verde de WhatsApp */
```

Cambiando esas tres líneas cambia toda la paleta del sitio.

---

## 📬 Sobre el formulario de contacto

Un sitio estático no puede enviar mails por sí solo (hace falta un servidor).
Por eso el formulario **valida los datos y arma el mensaje**, y después:

- **"Enviar por WhatsApp"** → abre WhatsApp con la consulta ya redactada.
- **"Enviar por email"** → abre el programa de correo con el mensaje listo.

Funciona bien y no depende de ningún servicio externo. Si más adelante querés que
el mensaje llegue directo a la casilla sin abrir nada, se puede conectar en 5 minutos
a un servicio gratuito tipo **Formspree**, **Web3Forms** o **Formsubmit**: es agregar
un `action` al `<form>` en `index.html`.

---

## ✅ Qué incluye

- Diseño responsive verificado a 1280 px, 768 px y 375 px (sin scroll horizontal).
- Animaciones de aparición al hacer scroll, contadores, parallax en la portada,
  menú lateral en móvil, galería ampliable con teclado y swipe.
- Respeta la preferencia del sistema "reducir movimiento" (accesibilidad).
- Si el visitante tiene JavaScript desactivado, **se ve todo el contenido igual**.
- SEO: meta tags, Open Graph para compartir en redes, y datos estructurados
  `LocalBusiness` de Schema.org (para que Google muestre dirección y teléfono).
- Estilos de impresión (si alguien imprime la página, sale legible).

---

## 📋 Contenido

Todos los textos, trabajos, productos, clientes y datos de contacto se tomaron
del sitio anterior (`ejesysuspensiones.com.ar`), igual que las fotos.
