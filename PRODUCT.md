# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primarios, confirmados por Leandro (04/09/2026):**

1. **Dueño de un camión.** Transportista individual, una o dos unidades. Decide él mismo,
   mira el precio de cerca y necesita la unidad de vuelta rápido porque mientras está en
   el taller no factura.
2. **Responsable de flota.** Empresa de transporte con varias unidades. Compra repetido,
   y le pesan más el papel legal y el plazo que el precio.

Los dos llegan casi siempre **desde el celular** y muchas veces desde un anuncio de Google
que los deposita en una página de servicio, no en la portada.

**Secundarios** (el sitio los atiende, pero no son la prioridad): productores y
contratistas agrícolas (trenes rodantes, carretones, equipos sin aire comprimido), y otros
talleres o carroceros que tercerizan fabricación de ejes, suspensiones y componentes.

## Product Purpose

El sitio no vende: **consigue que la persona escriba al taller**, sobre todo por WhatsApp.

El éxito no es la cantidad de mensajes sino que lleguen **completos**: con el trabajo que
necesita y la unidad (marca, modelo y año). Un "hola" pelado obliga al taller a gastar el
primer intercambio preguntando lo básico, y muchos se caen ahí.

Un dato que condiciona todo: **el taller atiende de lunes a viernes de 8 a 15**. Las
tardes, las noches y los fines de semana el sitio recibe visitas sin nadie del otro lado.

## Positioning

Leandro no eligió un solo diferenciador porque **las cuatro cosas se sostienen entre sí**,
y esa cadena es lo que un competidor no puede copiar entero:

- **Fabricación propia.** No revenden: fabrican los ejes y las suspensiones. Continuadores
  de la fabricación de Tafor S.A.
- **Homologación.** Habilitados por CENT, CNTSV y AITA. Otro taller puede hacer el trabajo;
  sin papeles, la unidad queda irregular.
- **Trabajos que el taller común rechaza.** Carretones de gran porte, ejes trunnion, trocha
  variable, ejes autodireccionales a medida.
- **Veinte años y la reputación.** Desde 2005, 5,0 en Google.

Fabricar propio es lo que permite homologar, y homologar es lo que habilita los trabajos
raros. Soldar lo puede hacer cualquiera; la cadena completa, no.

**Decisión abierta:** cuál de las cuatro encabeza cuando hay lugar para **una sola** frase
—un título de anuncio, el encabezado de la portada—. No está resuelta y no debe inventarse.

## Operating Context

- **El trabajo es físico y local.** La unidad tiene que llegar hasta Av. San Diego 2103,
  Villa Gobernador Gálvez, Santa Fe. Nada se resuelve a distancia.
- **El presupuesto se hace viendo el vehículo.** No hay lista de precios ni cotización
  automática posible: depende de la unidad y del estado en que llega.
- **Tráfico pago.** Google Ads (cuenta 158-004-2792) manda visitantes directo a las páginas
  de servicio. Las tres conversiones que se miden son clic en WhatsApp, clic en teléfono y
  envío del formulario.
- **La ficha de Google es la otra mitad.** Los datos de contacto y el horario del sitio
  están unificados con el Perfil de Empresa; si cambia uno, cambia el otro.

## Capabilities and Constraints

- **Sitio estático, sin backend.** 11 páginas (una portada de una sola página y 10 de
  servicio), HTML/CSS/JS plano, publicado en GitHub Pages desde la rama `main`.
- **Sin frameworks ni dependencias.** Regla del proyecto, no una limitación técnica.
- **Cero recursos externos, con dos excepciones autorizadas:** la etiqueta de Google Ads y
  el asistente del sitio, que habla con un intermediario propio en Cloudflare.
- **El formulario no tiene servidor:** valida y abre WhatsApp o el cliente de correo.
- **Sin JavaScript el sitio sigue sirviendo:** los enlaces de WhatsApp funcionan igual.
- **Plazos: solo uno confirmado.** Tercer eje, 10 a 15 días hábiles. De los otros nueve
  trabajos **no se sabe** y no se puede inventar. Es un dato pendiente de Leandro.
- **Precios: ninguno publicado, por decisión.** El orientativo del tercer eje existe
  (USD 9.800) pero se decidió el 04/09/2026 **no mostrarlo**: con el número a la vista,
  parte de los interesados se autodescarta sin llegar a escribir.
- **El fijo 0341 498-3900 fue removido** del sitio a pedido de Leandro.

## Brand Commitments

- **Español rioplatense**, de vos. Tono de taller: claro y directo, sin lenguaje
  publicitario ni jerga técnica sin traducir.
- **Solo fotos reales de trabajos propios.** 41 imágenes del taller y de unidades que EyS
  intervino. Nada de bancos de imágenes ni fotos generadas: el sitio muestra lo que
  hicieron, y eso es el argumento.
- **Las reseñas van textuales**, con las erratas de quien las escribió. El texto es de los
  clientes, no del sitio.
- **Los datos de contacto no se cambian** sin permiso explícito: están unificados con la
  ficha de Google.
- **No inventar datos.** Ni plazos, ni precios, ni especificaciones, ni capacidades de
  carga, ni normativa. Si falta un dato, se pide.

## Evidence on Hand

- **41 fotos propias** en `assets/img/` (más los originales en alta en `_originales/`, sin
  versionar): taller, unidades intervenidas, ejes, suspensiones y componentes.
- **Reseñas de Google: 20, con 5,0.** Cuatro están citadas textuales en la portada
  (Fernando Ferreyra, Compras Marcelini, Guillermo Bagneres y Jorgelina T.). **No se marcan
  como datos estructurados**: Google penaliza republicar como propias las reseñas de su
  propia ficha.
- **Habilitaciones CENT, CNTSV y AITA**, nombradas en las 11 páginas.
- **Continuidad de Tafor S.A.** en la fabricación de suspensiones neumáticas.
- **Cuatro números verificables**, hoy en la portada: 20+ años de trayectoria, 2.580 mm de
  trocha máxima fabricada, 19° de giro en ejes autodireccionales, 3 habilitaciones
  nacionales.
- **Un desarrollo adoptado por la industria minera de Chile** (ejes trunnion).

**Lo que NO existe y no debe fabricarse:** casos de estudio, testimonios más allá de las
reseñas reales, cifras de producción, listas de clientes, fotos antes/después de la misma
unidad (pedidas a Leandro, todavía no entregadas) y los plazos de los otros nueve trabajos.

## Product Principles

1. **El mensaje completo vale más que el mensaje rápido.** Todo camino hacia el contacto
   tiene que llegar al taller con el trabajo y la unidad ya escritos. Sumar un paso que
   mejore el mensaje es una ganancia, no una fricción.
2. **Un dato que no se tiene se dice, no se estima.** Un plazo o una capacidad de carga
   inventados terminan en una unidad mal cargada o en un cliente enojado, y llevan el
   nombre del taller.
3. **La prueba es el trabajo hecho.** Fotos propias, reseñas textuales, habilitaciones
   reales. Nada prestado, nada genérico.
4. **El sitio trabaja cuando el taller está cerrado.** La mayor parte de las visitas cae
   fuera de las 8 a 15; lo que se construya tiene que servir sin nadie del otro lado.
5. **Primero el celular, y muchas veces desde un anuncio.** El visitante típico aterriza
   en una página interna, no en la portada, y tiene que poder resolver ahí mismo.

## Accessibility & Inclusion

No hay un estándar exigido por contrato. Lo que sí es un hecho del público:

- **Móvil primero.** La mayoría entra desde el celular, a veces desde el taller o la ruta,
  con conexión irregular.
- **El camino al contacto no puede depender de JavaScript.** Sin JS, los enlaces de
  WhatsApp siguen funcionando.
- **Se respeta `prefers-reduced-motion`**, que en Windows viene activado de fábrica en
  muchos equipos.
- **El visitante no es técnico.** Ni el cliente ni Leandro: los textos se escriben para que
  los entienda alguien que maneja un camión, no un ingeniero.
