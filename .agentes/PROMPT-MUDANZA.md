# Mudar el proyecto fuera de OneDrive — prompt para la pestaña Code

**Por qué:** el proyecto vive en `OneDrive\Escritorio\PAGINA EYS`. Con dos agentes escribiendo
casi al mismo tiempo, OneDrive puede generar archivos "en conflicto" o trabar un archivo justo
cuando alguien lo guarda. Y no aporta seguridad: el respaldo real es GitHub.

**Ojo con esto:** la carpeta no se puede mover mientras Claude Code o Antigravity estén
trabajando adentro (Windows la tiene tomada). Por eso va en tres etapas.

---

## ETAPA 1 — Pegar esto en la pestaña Code, con la carpeta actual abierta

```
Vamos a mudar este proyecto fuera de OneDrive, de
  C:\Users\leand\OneDrive\Escritorio\PAGINA EYS
a
  C:\proyectos\PAGINA EYS

Esta etapa es solo de preparacion: NO muevas la carpeta todavia, Windows no te va a dejar
porque estas parado adentro.

Hace esto, en este orden:

1. Respaldo primero. Verifica con `git status` que no quede nada sin commitear y con
   `git log origin/main..HEAD` que no quede nada sin subir. Si falta algo, commitealo y
   subilo. Esto es lo que nos cubre si la mudanza sale mal.

2. Avisame de lo que NO esta respaldado. La carpeta `_originales` (unos 5,5 MB: fotos en
   alta y los archivos de texto de Google Ads y del Perfil de Empresa) esta en .gitignore,
   asi que NO esta en GitHub. Confirmame que existe y decime cuantos archivos tiene, para
   verificar despues de la mudanza que llegaron todos.

3. Actualiza las rutas. La ruta vieja aparece 6 veces en 5 archivos: CLAUDE.md,
   .agentes\CONTEXTO.md, .agentes\REGLAS.md, .agentes\PROMPT-CLAUDE.md y
   .agentes\PROMPT-GEMINI.md. Reemplazala por la nueva en todos. No toques nada mas.

4. Revisa si `servidor-local.ps1` tiene rutas absolutas. Si las tiene, arreglalas; si usa
   rutas relativas, decilo y no lo toques.

5. Commit con mensaje "Actualiza las rutas para la mudanza fuera de OneDrive" y push.

6. Cuando termines, mostrame el comando exacto de PowerShell que tengo que correr yo para
   mover la carpeta, y decime que tengo que cerrar antes.

Y de aca en adelante, en esta y en todas las sesiones de este proyecto, trabaja en MODO
ECONOMICO. Esta escrito completo en CLAUDE.md, seccion "Modo economico". Lo esencial:
no leas archivos enteros si alcanza con un grep y un rango de lineas; no pegues el
contenido de los archivos en el chat; no narres lo que vas a hacer, hacelo y conta el
resultado; junta todos los cambios de un archivo en un solo pase; no re-verifiques lo ya
verificado; respuestas cortas (que se hizo, si funciono, que falta); y antes de una
exploracion larga avisame y espera el OK.
```

---

## ETAPA 2 — La hacés vos, con todo cerrado

1. Cerrá la terminal de Antigravity.
2. Cerrá la pestaña Code / cualquier ventana parada en esa carpeta.
3. Abrí una PowerShell **nueva** y, sin entrar a la carpeta, corré lo que te dio Code
   (va a ser algo como):

```powershell
New-Item -ItemType Directory -Force -Path "C:\proyectos" | Out-Null
Move-Item "C:\Users\leand\OneDrive\Escritorio\PAGINA EYS" "C:\proyectos\PAGINA EYS"
```

> OneDrive va a ver que la carpeta ya no está y la va a sacar de la nube. Es lo esperado:
> el respaldo es GitHub. Por eso la Etapa 1 empieza subiendo todo.

---

## ETAPA 3 — Volvé a abrir Code, ahora en `C:\proyectos\PAGINA EYS`

```
Ya mude el proyecto a C:\proyectos\PAGINA EYS. Verifica que quedo todo bien:

1. `git status` y `git remote -v` funcionan y apuntan al repositorio de siempre.
2. `_originales` llego completa (comparala con la cantidad de archivos que me dijiste antes).
3. Levanta el servidor local y confirma que la portada abre.
4. Ya no queda ninguna mencion a OneDrive en CLAUDE.md ni en .agentes.
5. Anota la mudanza en .agentes\BITACORA.md.

Decime en 3 lineas si quedo todo bien o que falta.
```

Después: en la terminal de Antigravity, `cd "C:\proyectos\PAGINA EYS"` y arrancalo de nuevo
con `agy`.
