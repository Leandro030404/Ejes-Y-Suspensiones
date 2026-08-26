# REGLAS DE CONVIVENCIA — obligatorias para CLAUDE y para GEMINI

Los dos agentes trabajan sobre **la misma carpeta y la misma copia de los archivos**.
No hay ramas separadas: cambiar de rama le cambiaría los archivos al otro en medio de su
trabajo. Git acá sirve como **historial para poder volver atrás**, no como separador.

---

## 1. Un archivo, un dueño por vez

Antes de editar un archivo, creá su lock:

```
.agentes/locks/<ruta-con-guiones>.lock      ej: index-html.lock, assets-js-main-js.lock
```

Adentro va una línea: `CLAUDE|GEMINI · G-00X · YYYY-MM-DD HH:MM`

- Si el lock **ya existe y es del otro agente**: NO edites ese archivo. Anotalo en la
  BITÁCORA y pasá a otro ticket.
- **Borrá tus locks apenas terminás el ticket.** Un lock olvidado traba al otro.
- Un lock de más de 2 horas se considera vencido: avisale a Leandro antes de pisarlo.

## 2. Git

- Se trabaja **siempre sobre `main`**. Nadie crea ramas ni cambia de rama.
- **PROHIBIDO**, sin excepción: `git checkout` / `git switch` de rama, `git stash`,
  `git reset --hard`, `git rebase`, `git push --force`, borrar ramas.
  Todos esos comandos cambian los archivos que el otro agente tiene abiertos.
- **Nunca `git add -A` ni `git add .`** — te llevarías puesto el trabajo a medio hacer del
  otro. Siempre `git add` con los archivos exactos de tu ticket.
- Un commit por ticket, mensaje `[G-00X] qué se hizo`, **en español y sin tildes**
  (las tildes rompen el heredoc de PowerShell).
- **El `git push` lo hace SOLO Claude**, después de revisar. Publicar dispara GitHub Pages.

## 3. Antes y después de cada ticket

**Antes:** leer las últimas 20 líneas de `BITACORA.md` y mirar `locks/`.
**Después:** borrar tus locks → anotar en `BITACORA.md` → mover el ticket a `## HECHO`
en `TABLERO.md` → commit con los archivos de tu ticket.

Formato de la bitácora, una línea por movimiento:

```
[YYYY-MM-DD HH:MM] [CLAUDE|GEMINI] G-00X qué se hizo | archivos tocados
```

## 4. Reglas del proyecto que no se negocian

Están en `CLAUDE.md`, pero las repito porque son las que más se rompen:

1. **Sin frameworks, sin build, sin dependencias nuevas.** HTML/CSS/JS plano.
2. **Cero recursos externos.** Única excepción autorizada: la etiqueta de Google Ads
   (`googletagmanager.com`). Las tipografías se sirven locales, no volver a Google Fonts.
3. **No inventar datos.** Ni plazos, ni precios, ni especificaciones, ni métricas.
   Si falta un dato, se pide. En un informe, lo que no está se escribe "sin dato".
4. **Verificar antes de decir que está hecho.** Levantar el servidor local y mirarlo.
5. Los datos de contacto están unificados con la ficha de Google: **no se cambian**
   sin permiso explícito de Leandro.
6. **No borrar archivos ni carpetas** sin confirmación de Leandro.
   Nunca borrar `google6f4817e7bc103d04.html` (verifica Search Console).
7. No trabajar fuera de `C:\Users\leand\OneDrive\Escritorio\PAGINA EYS`.

## 5. Google Ads

- Ninguna IA entra a la cuenta de Google Ads. **Proponemos, Leandro ejecuta.**
- No se tocan las etiquetas de conversión ni los IDs sin avisar: si se rompe la medición,
  se optimiza a ciegas.
- Un cambio por landing por vez. Si se cambian cinco cosas juntas, después no se sabe cuál
  funcionó.

## 6. Si algo está ambiguo

No adivines. Escribilo en `TABLERO.md` bajo `## DUDAS PARA LEANDRO` y seguí con otro ticket.
