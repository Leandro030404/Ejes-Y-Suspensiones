# EyS · Ejes y Suspensiones — Contexto del proyecto

Sitio web de **EyS - Ejes y Suspensiones**, taller de Villa Gobernador Gálvez (Santa Fe)
que fabrica ejes autodireccionales, suspensiones neumáticas y ejes trunnion, y hace
modificaciones certificadas en unidades de carga.

El usuario (Leandro) **no es programador**. Escribile en español rioplatense, explicá
el *por qué* de cada cosa, y evitá jerga técnica sin traducir.

---

## Estado actual

| | |
|---|---|
| Sitio en vivo | https://ejesysuspensiones.com.ar |
| Repositorio | https://github.com/Leandro030404/Ejes-Y-Suspensiones |
| Hosting | GitHub Pages (rama `main`, raíz) |
| DNS | Cloudflare (solo DNS, sin proxy) |
| Correo | Google Workspace (`info@ejesysuspensiones.com.ar`) |
| Carpeta local | `C:\Users\leand\OneDrive\Escritorio\PAGINA EYS` |

**El sitio está terminado y funcionando.** 11 páginas, sin dependencias externas.

### Datos de contacto (unificados con la ficha de Google — no cambiar sin avisar)

- Dirección: **Av.** San Diego 2103, Villa Gobernador Gálvez, Santa Fe
- Teléfono / WhatsApp: **0341 685-5469** → `+5493416855469`
- Email: info@ejesysuspensiones.com.ar
- Horario: Lunes a viernes de 8 a 15. Sábados y domingos cerrado.
- El fijo 0341 498-3900 **fue removido** del sitio a pedido del usuario.

---

## Estructura

```
index.html                    portada (one-page)
404.html
favicon.ico + PNGs            en la raíz (Google los exige ahí)
robots.txt, sitemap.xml
servidor-local.ps1            servidor de previsualización
LEEME.md                      manual para el usuario
CLAUDE.md                     este archivo

assets/css/styles.css         todo el CSS, con @font-face al inicio
assets/js/main.js             sin dependencias
assets/fonts/                 6 woff2 propios (Barlow Condensed + Inter, subset latin)
assets/img/                   fotos + versiones -800 para móvil, cada una en
                              .jpg (respaldo) y .webp (lo que baja el navegador)

tercer-eje/                   \
escalabilidad/                 |
cambio-chasis-tractor/         |
carrocerias/                   |
freno-abs/                     > 10 páginas de servicio
ejes-autodireccionales/        |
ejes-trunnion/                 |
suspensiones-neumaticas/       |
trenes-rodantes-agricolas/     |
componentes/                  /

_originales/                  NO versionado (gitignore). Fotos en alta,
                              avatares de Gmail, y los archivos de texto
                              con los pasos de Google Ads y Perfil de Empresa.
```

---

## Reglas del proyecto

1. **Sin frameworks, sin build.** HTML/CSS/JS plano. No agregar dependencias.
2. **Cero recursos externos, con UNA excepción.** Las tipografías se sirven localmente;
   no volver a Google Fonts. La única excepción autorizada es la etiqueta de Google Ads
   (`googletagmanager.com`), que se sumó el 23/08/2026 para medir conversiones. Es
   inevitable: sin ese script no hay medición posible.
3. **No inventar datos.** Todo el contenido sale del sitio original. Nunca inventar
   plazos de entrega, precios ni especificaciones técnicas. Si falta un dato, pedirlo.
4. **Verificar antes de decir que está hecho.** Levantar el servidor local, medir, y
   además comprobar en vivo después del push (GitHub Pages tarda 1-3 min).
5. **Commits en español**, sin tildes en el mensaje (rompen el heredoc de PowerShell).

---

## Trampas ya encontradas (no repetirlas)

**PowerShell 5.1 lee los `.ps1` como ANSI.** Si el script tiene acentos, hay que
guardarlo con BOM UTF-8 antes de ejecutarlo o salen "GÃ¡lvez". Patrón usado:
```powershell
$t=[System.IO.File]::ReadAllText($f,(New-Object System.Text.UTF8Encoding($false)))
[System.IO.File]::WriteAllText($f,$t,(New-Object System.Text.UTF8Encoding($true)))
```

**`url()` dentro de una variable CSS se resuelve respecto de la hoja de estilos**,
no de la página. Por eso las rutas en `--foto` son absolutas (`/assets/img/...`).

**`backdrop-filter` en un elemento lo convierte en bloque contenedor** de sus
descendientes `position:fixed`. Estaba en `.header` y encerraba al menú móvil en
66px de alto. Ahora el desenfoque vive en `.header::before`.

**`[ordered]@{}` con claves numéricas indexa por posición, no por clave.** Eso mezcló
los nombres de las imágenes una vez. Usar array de hashtables.

**Un elemento no puede tener dos atributos `style`** — el navegador ignora el segundo.

**El panel de previsualización corre en segundo plano**, así que no dispara
IntersectionObserver, animaciones ni scroll. Para medir hay que anular transiciones
o forzar los estados a mano. Las capturas de pantalla no funcionan.

**Envolver un `<img>` en `<picture>` rompe los selectores de hijo directo.** Al pasar
a WebP se metió un `<picture>` entre el contenedor y la foto, y `.media--wide > img.is-wide`
dejó de aplicar (las 4 panorámicas quedaban recortadas). Se cambió a selector de
descendiente. Era el único `>` sobre `img` en toda la hoja — si se agrega otro, ojo.

**El panel de previsualización no decodifica las imágenes.** Corre en segundo plano,
así que `naturalWidth` da **0** aunque la foto esté perfecta. No es un error del
sitio: para comprobar de verdad hay que cargarlas a mano con `new Image()`, o pedir
el archivo con `fetch` y decodificarlo con `createImageBitmap`.

**`servidor-local.ps1` atiende de a una petición por vez.** Con 21 fotos en la
portada se satura y las peticiones quedan colgadas. Para medir conviene levantar un
servidor de Node en la carpeta temporal; el `.ps1` sigue sirviendo para que el
usuario mire el sitio.

**`.mini-gallery__item::after` y `.product__media::after` ya están ocupados** (borde
de hover y degradado). Para capas nuevas usar `::before`.

---

## Decisiones tomadas

- **Portada one-page + 10 páginas de servicio.** La portada convierte; las páginas
  internas posicionan en Google.
- **Formulario sin backend**: valida y abre WhatsApp o el cliente de correo.
- **Los enlaces de WhatsApp piden datos** (24/08/2026). El mensaje precargado ya no es
  solo "Hola, quisiera consultar por X": suma una linea `Unidad (marca, modelo y año):`
  para que el primer mensaje ya sirva. Los genericos ademas piden `Trabajo que necesito:`.
  **No volver a los saludos vacios** — el taller perdia tiempo preguntando lo basico.
  El formulario de la portada tiene el campo `unidad` (opcional) con el mismo fin.
  Son 55 enlaces; se editan con un script, no a mano.
- **Fotos en WebP** (24/08/2026). Las 41 imágenes están duplicadas en `.webp` y se
  sirven con `<picture>`: el navegador baja la webp y, si es muy viejo y no la
  entiende, cae sola en el `.jpg`. Son 28% menos de bytes (4,67 → 3,36 MB en la
  portada) sin diferencia visible. Las webp se generan con `sharp` (calidad 80),
  que **no** es dependencia del sitio: se usa una sola vez desde una carpeta aparte.
  El visor de fotos ampliadas usa webp con respaldo por `onerror` en `main.js`.
- **El formulario está en las 11 páginas** (24/08/2026), no solo en la portada. El
  que llega desde un anuncio a una página de servicio ya no tiene que volver al
  inicio para escribir. En cada página el desplegable "Motivo" viene con su trabajo
  ya elegido. El JS es el mismo (`#contactForm`), no hubo que tocarlo.
  El desplegable pasó de 8 a **11 motivos**: uno por página de servicio, más
  "Consulta general". Antes tres trabajos no tenían opción propia.
- **Portada: bloque de opiniones + preguntas frecuentes** (24/08/2026). El bloque de
  opiniones muestra la puntuación y enlaza a la ficha; la puntuación y la cantidad
  **están escritas a mano en el HTML**, hay que actualizarlas cuando cambien.
  Las preguntas frecuentes de la portada llevan su `FAQPage` en datos estructurados,
  igual que las 10 internas.
- **4 fotos son panorámicas** (hasta 3,6:1) y no entran en los recuadros. Se muestran
  completas con un fondo desenfocado de la propia foto (clase `media--wide` + `--foto`).
- **Sin `latin-ext`** en las tipografías: el español entra completo en `latin`.
- Los horarios y los datos de contacto **coinciden exactamente** con el Perfil de
  Empresa de Google. Si se cambia uno, cambiar el otro.

---

## Fuera del sitio

### Perfil de Empresa de Google
Ficha: https://maps.app.goo.gl/zkaP3enqU7rfY4Uk7
Nombre "EyS Ejes y Suspensiones", categoría "Taller de camiones", 4,9 con 15 reseñas.
El perfil lo administra la cuenta personal (`leandrobertainariver@gmail.com`).
Textos preparados en `_originales/perfil-google.txt`.

### Google Ads (cuenta 158-004-2792) — reordenada el 24/08/2026

Estado actual, **ARS 4.000/día en total**:

1. **"Maximo rendimiento - Sitio Web"** — ARS 2.500/día. Creada el 24/08 apuntando
   a `https://ejesysuspensiones.com.ar/`. Maximizar conversiones, Argentina con
   "Presencia". En aprendizaje: **no tocarla los primeros 14 días.**
2. **"Búsqueda - Sitio Web"** — ARS 1.500/día. **Gasta casi cero** (3 impresiones en
   dos semanas): el mercado de búsqueda es chico, no le falta presupuesto.
   Ver [[eys-mercado-busqueda-chico]].
3. **"Ejes Y Suspensiones"** — **DETENIDA**. Era la vieja de Máximo rendimiento que
   apuntaba a `business.google.com` sin campo "URL final". Gastó ARS 32.066 en
   14 días con 0 conversiones. No se eliminó, quedó pausada.

**Lo que se aprendió:** una campaña de Máximo rendimiento creada normalmente **sí**
tiene campo "URL final". La vieja no lo tenía porque Google la había armado desde el
Perfil de Empresa. No hizo falta llamar a soporte: se resolvió creando una nueva.

**Trampa:** Google autogenera los textos del anuncio a partir del sitio y **inventa
términos**. Había puesto "Ejes de pivote de alta calidad" — expresión que EyS no usa.
Revisar título por título antes de publicar.

Todos los textos, palabras clave, negativas y el detalle de lo hecho están en
`_originales/campana-google-ads.txt` (Partes 9 y 10).

Referencia: 11 al 20 de agosto de 2026, ~ARS 38.000, 450+ clics, **1 sola consulta**
(cotización de USD 10.000, sin cerrar). Ojo: durante esos días la ficha decía
"Taller de automóviles", así que esos números están contaminados.

### Medición de conversiones (instalada el 23/08/2026)

Etiqueta de Google: **AW-18384322870** (también figura como GT-WF7L533N).
Va en el `<head>` de las 11 páginas.

Tres acciones de conversión, todas de tipo "evento manual" y marcadas como
**principales** (sirven para optimizar, no solo para mirar):

| Acción en Google Ads | Qué mide | Etiqueta |
|---|---|---|
| `Clic en WhatsApp` | clic en cualquier botón de WhatsApp | `Ce0DCLWOyeYcELaCqr5E` |
| `Clic en telefono` | clic en cualquier botón de teléfono | `qlJcCLiOyeYcELaCqr5E` |
| `Enviar formulario de clientes potenciales` | envío del formulario de la portada | `KAwDCPnq1-YcELaCqr5E` |

El envío del formulario cuenta **solo** como formulario, no también como WhatsApp,
aunque termine abriendo WhatsApp: sería contar dos veces a la misma persona.

El código vive al final de `assets/js/main.js`. Es **un solo oyente delegado**:
cubre los 66 enlaces de WhatsApp y los 3 de teléfono sin tocar el HTML botón por
botón. El formulario llama a `window.eysConversion('whatsapp')` a mano, porque
abre WhatsApp con `window.open` y no pasa por un enlace.

**Trampa:** las etiquetas se leen mal a ojo — la `l` minúscula y la `I` mayúscula
son idénticas en la tipografía de Google Ads, y el `0` con la `O` también. Si hay
que volver a sacarlas, usar el botón "Copiar" de Google Ads, nunca transcribirlas.

**Ojo con el número de teléfono:** Google ofrece medir las llamadas de verdad,
pero eso reemplaza el número del sitio por uno de reenvío de Google. El usuario
lo rechazó explícitamente. Medimos el clic, no la llamada.

**No se pudo:** el objetivo "Contacto" no se podía marcar como predeterminado de
la cuenta mientras su única acción venía del Perfil de Empresa (fuente "Otros",
que Google no deja usar para optimizar). Se destrabó solo al crear estas dos
acciones del sitio.

### Search Console
Verificado con `google6f4817e7bc103d04.html` en la raíz. **No borrar ese archivo.**
Sitemap enviado. Falta reenviarlo tras sumar las 5 páginas nuevas.

---

## Pendientes

**Del usuario:**
- [x] ~~Plazo del tercer eje~~ → **10 a 15 días hábiles** (dato del 24/08/2026).
      Ya está en /tercer-eje/ y en los textos de Ads.
- [ ] Plazos de entrega de los otros 9 trabajos → para sumarlos a sus páginas
- [ ] **3 o 4 textos de reseñas de Google** (nombre + comentario) → el bloque de
      opiniones ya está en la portada, pero solo con la puntuación y el enlace.
      Con los textos se suman las tarjetas. **No inventarlos**: tienen que ser
      los de la ficha, copiados tal cual.
- [ ] Fotos antes/después de la misma unidad → para armar un deslizador
- [ ] Llegar a 30 reseñas en Google (**hoy 20, con 5,0** — subieron desde 15)
- [x] ~~Llamar a soporte por el destino de la campaña~~ → resuelto creando una campaña nueva (24/08/2026)
- [ ] Agregar "reparaciones" como palabra clave negativa de cuenta
- [ ] A los 14 días (7 de septiembre): mirar conversiones de la campaña nueva
- [ ] Reenviar el sitemap en Search Console

**Ofrecido y no hecho:**
- [ ] Artículos sobre homologación y normativa. El usuario tiene que validar la
      parte normativa; no inventarla.

---

## Cómo trabajar acá

```bash
# previsualizar
powershell -ExecutionPolicy Bypass -File "servidor-local.ps1"

# publicar
git add -A && git commit -m "mensaje" && git push
```

GitHub Pages tarda 1 a 3 minutos. Después del push, verificar en vivo con `curl`
y avisar al usuario que recargue con Ctrl+F5 (el navegador cachea).
