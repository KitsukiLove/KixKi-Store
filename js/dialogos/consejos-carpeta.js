/*
  Consejos por carpeta (ADV): lo que dice Kixki al pedirle ayuda sobre cada carpeta.
*/

import { L } from "./ayudas.js";
/* ===================================  ETAPA 4: consejos por carpeta (ADV)  ===================================
   «Pedir ayuda a Kixki» (consejos.js): Kixki salta a la carpeta y da UN consejo, distinto cada vez.
   - ADV.<id de carpeta>: consejos escritos a mano (nombran apps reales de apps.json: si renombras o mueves una app, revisa su consejo).
   - ADV.gen: consejos con variables {carpeta} {n} {a1} {t1} {a2} {t2} (apps reales de esa carpeta, con su etiqueta; las que llevan {a2} o {n} solo salen si hay ≥ 2 apps).
   - ADV.tipw: relevo del aviso que lleva una app ({a1} = la app, {tip} = su aviso).
   - ADV.favs0 / favsN, news0 / newsN, packs: carpetas especiales (cambian con lo que tengas guardado, lo nuevo y los packs).
   - ADV.hintPC / hintMob: consejos de Kixki que enseñan la función (se mezclan con sus consejos de siempre). */
export const ADV = {};

export function iniciar() {
  ADV.tiendas = L(`
Para empezar sin Play Store: F-Droid para apps libres y Droid-ify como cliente cómodo. Pareja ideal. 🐑 || To start without Play Store: F-Droid for free apps and Droid-ify as a comfy client. An ideal pair. 🐑
¿Apps de Play sin darle tu cuenta a Google? Aurora Store descarga del catálogo de Play sin iniciar sesión. 🔓 || Play apps without handing Google your account? Aurora Store downloads from the Play catalog without signing in. 🔓
Si un APK te da dudas, pásalo por Universal Installer: lo revisa con VirusTotal y te enseña los permisos. 🛡️ || If an APK makes you doubt, run it through Universal Installer: it checks it with VirusTotal and shows its permissions. 🛡️
Cuando una app solo vive en GitHub, busca su APK en «Releases». Komi Store los instala con un toque. 🐙 || When an app only lives on GitHub, look for its APK under “Releases”. Komi Store installs them with one tap. 🐙
LibreFind escanea tus apps, detecta las de código cerrado y te sugiere alternativas libres. Curiosidad con propósito. 🔎 || LibreFind scans your apps, spots the closed-source ones and suggests free alternatives. Curiosity with a purpose. 🔎
En IzzyOnDroid, revisa siempre las apps antes de instalarlas. Que sea libre no quita mirar la letra pequeña. 👀 || On IzzyOnDroid, always check apps before installing them. Being free doesn't excuse skipping the small print. 👀
ShizuCoreFetch instala y actualiza a nivel de sistema, pero necesita Shizuku en marcha. Empieza por «Importante». ⚙️ || ShizuCoreFetch installs and updates at system level, but it needs Shizuku running. Start with “Essential”. ⚙️
Tiendas hay muchas y no hace falta instalarlas todas. Elige una o dos y mantenlas al día. 🧺 || There are plenty of stores and you don't need them all. Pick one or two and keep them up to date. 🧺
`);
  ADV.importante = L(`
Shizuku primero: muchas apps de otras carpetas lo usan para funcionar sin root. Instálalo antes y todo irá mejor. 🧩 || Shizuku first: many apps from other folders use it to work without root. Install it first and everything runs better. 🧩
Con depuración inalámbrica (Android 11 o más) Shizuku se activa desde el propio móvil. Sin PC ni root. 📶 || With wireless debugging (Android 11 or newer) Shizuku starts from the phone itself. No PC, no root. 📶
ShizukuPlus usa otro paquete, así que convive con el Shizuku original. Si una app busca el original, prueba su modo de compatibilidad. 🐑 || ShizukuPlus uses a different package, so it lives alongside the original Shizuku. If an app looks for the original, try its compatibility mode. 🐑
Ojo: el desarrollador de Shizuku avisó que pausó el mantenimiento por ahora. Úsalo con la lana atenta. 👀 || Heads up: Shizuku's developer said maintenance is paused for now. Use it with your wool on alert. 👀
ShizukuPlus junta los modos root, ADB y Dhizuku y trae un «Service Doctor» por si algo falla. Buen botiquín. 🩺 || ShizukuPlus combines root, ADB and Dhizuku modes and brings a “Service Doctor” in case something fails. A good first-aid kit. 🩺
Esta carpeta es pequeña pero manda: lo que instales aquí hace que otras apps funcionen mejor. Léela con calma. 📖 || This folder is small but bossy: what you install here makes other apps work better. Read it calmly. 📖
`);
  ADV.control = L(`
Antes de quitar nada con Canta, busca la app en ADL. Mirar primero evita llorar después. 📖 || Before removing anything with Canta, look the app up in ADL. Looking first saves crying later. 📖
Canta clasifica cada app por riesgo: recomendada, avanzada, experta o insegura. Las inseguras, ni tocarlas. 🚦 || Canta ranks every app by risk: recommended, advanced, expert or unsafe. The unsafe ones, don't even touch. 🚦
App Manager detecta rastreadores y permisos, y también puede bloquear componentes. Eso último rompe apps: con cuidado. 🔬 || App Manager spots trackers and permissions, and can also block components. That last one can break apps: careful. 🔬
App Ops ajusta permisos con más detalle que los ajustes de Android. Necesita Shizuku: míralo en «Importante». 🎛️ || App Ops tweaks permissions in more detail than Android's settings. It needs Shizuku: check “Essential”. 🎛️
SD Maid SE limpia basura, restos de apps y duplicados. Antes de confirmar, revisa bien lo que vas a borrar. 🧹 || SD Maid SE clears junk, leftovers and duplicates. Before confirming, check carefully what you're about to delete. 🧹
Inure es muy completo y trae una prueba de 15 días; después se desbloquea con su versión completa. ⏳ || Inure is very complete and comes with a 15-day trial; after that you unlock it with the full version. ⏳
Orden sensato: ADL para informarte, Canta para quitar y App Manager si quieres mirar por dentro. 🗺️ || A sensible order: ADL to get informed, Canta to remove, and App Manager if you want to look inside. 🗺️
`);
  ADV.utilidad = L(`
scrcpy muestra y controla tu móvil desde la PC sin root. Eso sí: activa antes la depuración USB. 🖥️ || scrcpy shows and controls your phone from the PC without root. Just turn on USB debugging first. 🖥️
Termux: instálalo desde F-Droid y no mezcles fuentes, porque sus complementos exigen la misma firma. 💻 || Termux: install it from F-Droid and don't mix sources, because its add-ons require the same signature. 💻
Essentials es una navaja suiza: bloqueo de apps, luz nocturna por app, congelar apps… Pide permisos profundos, así que lee qué le das. 🔧 || Essentials is a Swiss army knife: app lock, per-app night light, freezing apps… It asks for deep permissions, so read what you grant. 🔧
AutoPie lanza scripts de shell y Python desde un acceso directo, un horario o al aparecer un archivo. Solo funciona en arm64. ⏰ || AutoPie runs shell and Python scripts from a shortcut, a schedule or when a file appears. It only works on arm64. ⏰
Plain maneja tu móvil desde el navegador de otro dispositivo por tu red local. Pide muchos permisos: dale solo los que uses. 🌐 || Plain controls your phone from another device's browser over your local network. It asks for many permissions: grant only what you use. 🌐
¿Primera vez con automatizaciones? AutoPie trae un Termux integrado: buen laboratorio para jugar. 🧪 || First time with automation? AutoPie ships with a built-in Termux: a good lab to play in. 🧪
`);
  ADV.pantalla = L(`
EnforceDoze fuerza el modo Doze en cuanto apagas la pantalla. Es un fork de ForceDoze, que ya no se mantiene. 🔋 || EnforceDoze forces Doze mode as soon as you turn the screen off. It's a fork of ForceDoze, which is no longer maintained. 🔋
No More Background te deja elegir qué apps corren en segundo plano. Se configura una vez y listo. ⚙️ || No More Background lets you choose which apps run in the background. You set it up once and you're done. ⚙️
BatStats enseña el consumo por app en mAh. Para verlo todo necesita Shizuku, root o permisos por ADB. 📊 || BatStats shows per-app consumption in mAh. To see it all it needs Shizuku, root or permissions through ADB. 📊
Extinguish apaga la pantalla de verdad y mantiene el móvil despierto, ideal para escuchar vídeos. Ten a mano cómo volver a encenderla. 💡 || Extinguish really turns the screen off and keeps the phone awake, great for listening to videos. Keep in mind how to turn it back on. 💡
Display Toggle apaga y enciende la pantalla sin bloquear el móvil ni parar las apps. Necesita Shizuku. 📴 || Display Toggle turns the screen off and on without locking the phone or stopping apps. It needs Shizuku. 📴
OrientationLock fuerza la orientación aunque una app no te deje girar la pantalla. Para los «¡gira, por favor!». 🔄 || OrientationLock forces the orientation even if an app won't let you rotate the screen. For those “please, rotate!” moments. 🔄
Para cuidar la batería: mide con BatStats y controla con No More Background. Primero datos, luego ajustes. 📈 || To look after your battery: measure with BatStats and control with No More Background. Data first, tweaks later. 📈
`);
  ADV.privacidad = L(`
Antes de confiar en una app, pásala por Exodus: te dice qué rastreadores y permisos lleva. 🕵️ || Before trusting an app, run it through Exodus: it tells you which trackers and permissions it carries. 🕵️
PrivacyFlip apaga Wi-Fi, Bluetooth, datos y ubicación al bloquear el móvil, y reactiva solo lo que elijas. 🔒 || PrivacyFlip turns off Wi-Fi, Bluetooth, data and location when you lock the phone, and re-enables only what you choose. 🔒
Bitwarden guarda tus contraseñas en una bóveda cifrada de extremo a extremo. Menos «contraseña123», por favor. 🗝️ || Bitwarden keeps your passwords in an end-to-end encrypted vault. Less “password123”, please. 🗝️
SnapSafe guarda las fotos cifradas y no tiene permiso de internet. Ojo: no entran en copias de seguridad, guarda aparte las que quieras conservar. 📷 || SnapSafe keeps photos encrypted and has no internet permission. Careful: they're not included in backups, so save the ones you want to keep elsewhere. 📷
Tarnhelm limpia el rastreo de los enlaces que compartes. Pide varios permisos: revísalos al instalar. 🔗 || Tarnhelm strips the tracking from the links you share. It asks for several permissions: check them when installing. 🔗
Fake Traveler cambia tu ubicación GPS, pero algunas apps lo detectan y pueden restringir tu cuenta. Con cuidado. 🗺️ || Fake Traveler changes your GPS location, but some apps detect it and may restrict your account. Careful. 🗺️
FireWall Blocks corta el Wi-Fi o los datos app por app. Perfecto para las que no tienen por qué hablar con internet. 🚧 || FireWall Blocks cuts Wi-Fi or mobile data app by app. Perfect for those that have no business talking to the internet. 🚧
`);
  ADV.mensajeria = L(`
Signal pide número de teléfono (luego puedes ocultarlo) y Session no pide ni número ni correo. Tú eliges. 💬 || Signal asks for a phone number (you can hide it later) and Session asks for neither number nor email. You choose. 💬
Si usas Session, anota tu frase de recuperación en un lugar seguro: sin ella la cuenta no se recupera. 📝 || If you use Session, write your recovery phrase down somewhere safe: without it the account can't be recovered. 📝
Molly es Signal con capas extra de seguridad: cifra la base de datos local con una frase y usa la misma red. 🔐 || Molly is Signal with extra layers of security: it encrypts the local database with a passphrase and uses the same network. 🔐
Element usa Matrix, una red abierta: puedes elegir tu servidor o montar el tuyo. Tus chats viven donde tú decidas. 🌐 || Element uses Matrix, an open network: you can pick your server or run your own. Your chats live where you decide. 🌐
Proton Mail y Tuta cifran tu correo de extremo a extremo; sus apps son de código abierto, pero el servicio lo pones en manos de la empresa. 📬 || Proton Mail and Tuta encrypt your email end to end; their apps are open source, but you trust the company with the service. 📬
`);
  ADV.sistemas = L(`
Aquí no hay apps: son sistemas operativos. Instalarlos borra lo que haya en el equipo, así que haz copia antes. 💿 || No apps here: these are operating systems. Installing one wipes what's on the device, so back up first. 💿
Linux Mint es la entrada más suave si vienes de Windows. Fedora va un poco más adelantada en novedades. 🐧 || Linux Mint is the gentlest way in if you come from Windows. Fedora is a bit ahead on new software. 🐧
GrapheneOS solo se instala en móviles Pixel. Si tienes otro móvil, mira LineageOS y su lista de modelos. 📱 || GrapheneOS only installs on Pixel phones. If you have another phone, look at LineageOS and its list of devices. 📱
LineageOS alarga la vida de un móvil viejo, pero desbloquear el bootloader borra todo. Sigue la guía de tu modelo. 🔓 || LineageOS extends the life of an old phone, but unlocking the bootloader wipes everything. Follow the guide for your model. 🔓
Qubes OS separa cada tarea en su propia máquina virtual. Es muy seguro, pero pide una computadora potente y paciencia. 🧱 || Qubes OS separates each task in its own virtual machine. It's very secure, but needs a powerful computer and patience. 🧱
`);
  ADV.fotos = L(`
Image Toolbox tiene más de 500 filtros, quita fondos y hasta hace OCR. Si te pierdes, empieza por recortar o convertir. 🖼️ || Image Toolbox has over 500 filters, removes backgrounds and even does OCR. If you get lost, start with cropping or converting. 🖼️
DeJPEG mejora fotos sin conexión con modelos que descargas una sola vez. Solo funciona en arm64. 🪄 || DeJPEG improves photos offline with models you download once. It only works on arm64. 🪄
Ente Photos cifra tus copias y álbumes de extremo a extremo. Necesita internet y una cuenta; el espacio gratis es limitado. ☁️ || Ente Photos encrypts your backups and albums end to end. It needs internet and an account; free space is limited. ☁️
TagSpaces organiza tus archivos con etiquetas, sin nube ni cuentas. Pide acceso a todo el almacenamiento porque es un gestor de archivos. 🏷️ || TagSpaces organizes your files with tags, no cloud, no accounts. It asks for access to all storage because it's a file manager. 🏷️
Gander abre PDF, Word, Excel, fotos, vídeo y más en una sola app, sin permisos ni internet. Pesa unos 15 MB. 📄 || Gander opens PDFs, Word, Excel, photos, video and more in one app, with no permissions or internet. It weighs about 15 MB. 📄
En Image Toolbox, la versión FOSS no lleva analíticas; la de Play sí. Tú decides cuál instalar. 🔍 || In Image Toolbox, the FOSS version has no analytics; the Play one does. You decide which to install. 🔍
`);
  ADV.internet = L(`
LocalSend manda archivos por tu Wi-Fi, sin internet ni cuentas. Eso sí: los dos dispositivos en la misma red. 📡 || LocalSend sends files over your Wi-Fi, no internet or accounts. Just keep both devices on the same network. 📡
LibreWolf es para computadora: no tiene versión oficial para Android. Para el móvil, mira Iceraven. 💻 || LibreWolf is for computers: it has no official Android version. For your phone, look at Iceraven. 💻
Iceraven añade about:config y suspende pestañas, pero sus APK llevan clave de depuración: trátalo como software alfa. 🦊 || Iceraven adds about:config and suspends tabs, but its APKs use a debug key: treat it as alpha software. 🦊
RedReader lee Reddit sin anuncios, con tu cuenta o sin ella. Ligero y libre. 📰 || RedReader reads Reddit with no ads, with or without your account. Light and free. 📰
¿Pasar archivos entre móvil y PC? LocalSend funciona en Android, iOS, Windows, macOS y Linux. 🔁 || Moving files between phone and PC? LocalSend works on Android, iOS, Windows, macOS and Linux. 🔁
Para navegar: Iceraven en el móvil y LibreWolf en la computadora. Los dos vienen de Firefox. 🌐 || For browsing: Iceraven on your phone and LibreWolf on your computer. Both come from Firefox. 🌐
`);
  ADV.dia = L(`
Obsidian guarda tus notas como archivos Markdown en tu móvil y enlaza tus ideas. La app es gratis, pero de código cerrado. 📝 || Obsidian keeps your notes as Markdown files on your phone and links your ideas. The app is free, but closed source. 📝
My Brain junta tareas, notas, diario con estado de ánimo y un chat de IA, todo local. Un segundo cerebro de verdad. 🧠 || My Brain brings together tasks, notes, a mood journal and an AI chat, all local. A real second brain. 🧠
Chrono tiene alarmas con retos, como resolver cálculos para apagarlas. Cuidado con madrugar en modo matemáticas. ⏰ || Chrono has alarms with challenges, like solving sums to turn them off. Careful with waking up in math mode. ⏰
LibreFit trae más de 800 ejercicios con instrucciones e imágenes, y gráficas de tu progreso. 💪 || LibreFit has over 800 exercises with instructions and images, plus charts of your progress. 💪
SwitchAI te deja elegir entre más de 40 asistentes de IA desde el gesto de asistente. Solo lanza las apps de IA que ya tengas instaladas. 🤖 || SwitchAI lets you pick from over 40 AI assistants from the assistant gesture. It only launches the AI apps you already have installed. 🤖
Euria es la IA suiza de Infomaniak: escribe, traduce y resume. Necesita internet y cuenta, y su servicio no es libre. 🇨🇭 || Euria is Infomaniak's Swiss AI: it writes, translates and summarizes. It needs internet and an account, and its service isn't free software. 🇨🇭
`);
  ADV.emulacion = L(`
Lemuroid cubre NES, SNES, Game Boy, N64, PSP y más. Escanea tus ROMs y guarda las partidas solo. Los juegos los pones tú. 🎮 || Lemuroid covers NES, SNES, Game Boy, N64, PSP and more. It scans your ROMs and saves your games by itself. You bring the games. 🎮
Recuerda: usa solo copias de juegos que sean tuyos. Los emuladores no traen juegos ni BIOS. 📀 || Remember: use only copies of games that are yours. Emulators don't come with games or BIOS. 📀
SeedlessDS está en beta temprana y solo funciona en arm64. Si falla, es cosa de la beta, no tuya. 🧪 || SeedlessDS is in early beta and only works on arm64. If it fails, blame the beta, not yourself. 🧪
DroidDeck pide una GPU Adreno 730 o superior; Mali, Xclipse y PowerVR no funcionan. Mira tu GPU antes de ilusionarte. 🔍 || DroidDeck needs an Adreno 730 GPU or better; Mali, Xclipse and PowerVR don't work. Check your GPU before getting excited. 🔍
CatSmoker optimiza juegos, pero falsear el dispositivo puede romper las reglas de algunos y causar baneos. El riesgo es tuyo. ⚠️ || CatSmoker optimizes games, but spoofing the device can break the rules of some games and get you banned. The risk is yours. ⚠️
Kimu X64 es una página para buscar juegos para tus emuladores. Toca «Créditos» para ir al canal de su creador. 🔗 || Kimu X64 is a page to find games for your emulators. Tap “Credits” to visit its creator's channel. 🔗
`);
  ADV.decoracion = L(`
GIF Live Wallpaper convierte un GIF en fondo animado. Es ligera, open source y está en F-Droid. 🌈 || GIF Live Wallpaper turns a GIF into an animated wallpaper. It's light, open source and on F-Droid. 🌈
Si los Widgets Pro no se actualizan, desactiva la optimización de batería para la app. 🔋 || If Widgets Pro doesn't update, turn off battery optimization for the app. 🔋
Photo Widget convierte fotos de tu galería en widgets, pero no funciona con GIFs. Para GIFs, mira Widgets Pro. 🖼️ || Photo Widget turns photos from your gallery into widgets, but it doesn't work with GIFs. For GIFs, look at Widgets Pro. 🖼️
L.L.E trae los efectos clásicos de la pantalla de bloqueo, como ondas de agua o burbujas. Está en beta y puede fallar. 🫧 || L.L.E brings classic lock screen effects like water ripples or bubbles. It's in beta and may fail. 🫧
Widgets Pro tiene estilo Nothing OS: reproductor de música, seguimiento del sol y más (Android 12+). ☀️ || Widgets Pro has a Nothing OS style: music player, sun tracker and more (Android 12+). ☀️
Combo bonito: un fondo animado con GIF Live Wallpaper y widgets a juego. Sin saturar, que la lana también necesita aire. ✨ || Pretty combo: an animated wallpaper with GIF Live Wallpaper and matching widgets. Don't overdo it, wool needs air too. ✨
`);
  ADV.musica = L(`
Poweramp tiene un ecualizador excelente, pero es de código cerrado y de pago tras la prueba. 🎚️ || Poweramp has an excellent equalizer, but it's closed source and paid after the trial. 🎚️
SpotiFLAC: primero, en la pestaña Tienda pega el enlace de «Extensión» y luego instala las extensiones. Sin ese paso, nada. 🧩 || SpotiFLAC: first, in the Store tab paste the “Extension” link and then install the extensions. Without that step, nothing works. 🧩
WEcho aplica efectos a todo el sonido del sistema, no solo a un reproductor. Solo funciona en arm64. 🎧 || WEcho applies effects to all system sound, not just one player. It only works on arm64. 🎧
ClassiPod reproduce tu música con el diseño del iPod Classic. Nostalgia con lana. 📻 || ClassiPod plays your music with the iPod Classic look. Nostalgia with wool. 📻
Helio sirve para crear música, no para reproducirla. Es un secuenciador libre para componer. 🎹 || Helio is for making music, not for playing it. It's a free sequencer for composing. 🎹
Ambient Music Mod trae el «Ahora suena» de los Pixel a otros Android. Con Shizuku, hay que volver a iniciarlo tras cada reinicio del móvil. 🎶 || Ambient Music Mod brings the Pixel's “Now Playing” to other Androids. With Shizuku, you must start it again after each phone reboot. 🎶
`);
  ADV.teclados = L(`
LeanType es un teclado open source basado en HeliBoard, con temas, teclado flotante y portapapeles con historial. 🧶 || LeanType is an open-source keyboard based on HeliBoard, with themes, a floating keyboard and clipboard history. 🧶
GifBoard busca GIFs desde el teclado, pero usa la búsqueda de imágenes de Google: depende de ese servicio. 🎞️ || GifBoard searches GIFs from the keyboard, but it uses Google image search: it depends on that service. 🎞️
Irregular Expressions es un teclado muy básico, pero con fuentes de texto para escribir con estilo y sin rastreadores. ✨ || Irregular Expressions is a very basic keyboard, but with text fonts to type in style and without trackers. ✨
Para cambiar de teclado: instálalo, actívalo en los ajustes de teclado y elígelo como predeterminado. 🔄 || To switch keyboards: install it, enable it in your keyboard settings and choose it as the default. 🔄
¿Privacidad al escribir? El núcleo de LeanType es offline; su IA es opcional y solo envía texto a proveedores externos si la usas. 🔐 || Privacy while typing? LeanType's core is offline; its AI is optional and only sends text to external providers if you use it. 🔐
Tres teclados, tres estilos: LeanType para todo, Irregular Expressions para fuentes y GifBoard para GIFs. 🎨 || Three keyboards, three styles: LeanType for everything, Irregular Expressions for fonts and GifBoard for GIFs. 🎨
`);
  /* carpetas especiales: cambian con lo que guardes, lo nuevo y los packs */
  ADV.favs0 = L(`
Aún no tienes favoritas. Toca la ☆ de una app y aparecerá aquí, a un toque. ⭐ || No favorites yet. Tap the ☆ on an app and it'll show up here, one tap away. ⭐
Favoritas está vacía. Guarda las apps que quieras instalar primero y hazte una lista a tu medida. 🧶 || Favorites is empty. Save the apps you want to install first and build a list that fits you. 🧶
Truco: abre cualquier carpeta y pulsa la ☆ de la app que te guste. Luego vuelve aquí. 🔖 || Trick: open any folder and tap the ☆ on the app you like. Then come back here. 🔖
Cuando guardes una, la verás aquí sin buscarla otra vez. Es un marcapáginas con lana. 📚 || Once you save one, you'll see it here without searching again. It's a bookmark with wool. 📚
Favoritas es tu rincón, y aún está vacío. ¡Mucho que llenar! Empieza por «Tiendas». 🧺 || Favorites is your corner, and it's still empty. Plenty to fill! Start with “Stores”. 🧺
`);
  ADV.favsN = L(`
«{a1}» está en tus favoritas. ¿Ya la instalaste? Para algo la guardaste. ⭐ || “{a1}” is in your favorites. Did you install it yet? You saved it for a reason. ⭐
Favoritas: {n}. Revisa de vez en cuando si alguna ya no te interesa; una lista corta se usa mejor. 🧹 || Favorites: {n}. Check now and then if any no longer interests you; a short list is easier to use. 🧹
Pulsa la ★ de «{a1}» si quieres quitarla de favoritas. Yo no me ofendo. 🙂 || Tap the ★ on “{a1}” if you want to remove it from favorites. I won't be offended. 🙂
{n} favoritas guardadas: tu mini tienda personal. «{a1}» abre el desfile. 🛍️ || {n} favorites saved: your personal mini store. “{a1}” opens the parade. 🛍️
Antes de instalar «{a1}», lee su fuente. Hasta las favoritas merecen una revisión. 🔎 || Before installing “{a1}”, read its source. Even favorites deserve a check. 🔎
«{a1}» y «{a2}» están en tus favoritas. Buena pareja… o gran lío. Tú decides. 😏 || “{a1}” and “{a2}” are both in your favorites. A good pair… or a big mess. You decide. 😏
`);
  ADV.news0 = L(`
Sin novedades desde tu última visita. Cuando llegue una app nueva, la verás aquí. 🆕 || Nothing new since your last visit. When a new app arrives, you'll see it here. 🆕
Esta carpeta está tranquila: ninguna app nueva por ahora. Vuelve pronto. 🌱 || This folder is quiet: no new apps for now. Come back soon. 🌱
Novedades vacía quiere decir que estás al día. ¡Disfruta mientras dure! 😌 || An empty News folder means you're up to date. Enjoy it while it lasts! 😌
Mientras llegan novedades, repasa «Favoritas» o date una vuelta por otra carpeta. 🐑 || While news arrives, go through “Favorites” or take a stroll through another folder. 🐑
Cuando se añadan apps, aparecerán aquí. Nada de prisas: yo vigilo por ti. 👀 || When apps get added, they'll show up here. No rush: I'll keep watch for you. 👀
`);
  ADV.newsN = L(`
Hay novedades: {n} en total. «{a1}» es una de ellas. Empieza por ahí. 🆕 || There's news: {n} in total. “{a1}” is one of them. Start there. 🆕
¡Han llegado apps nuevas! Échale un ojo a «{a1}» y lee su fuente antes de instalar. 👀 || New apps have arrived! Take a look at “{a1}” and read its source before installing. 👀
Novedades: {n}. Lo nuevo no siempre es mejor, pero «{a1}» tiene buena pinta. 🎯 || News: {n}. New isn't always better, but “{a1}” looks promising. 🎯
Si algo te gusta de aquí, guárdalo con la ☆ para no perderlo cuando deje de ser novedad. ⭐ || If something here catches your eye, save it with the ☆ so you don't lose it once it stops being new. ⭐
Desde tu última visita se añadieron {n}. «{a1}» está entre ellas: ¿empezamos por esa? 🐑 || Since your last visit, {n} were added. “{a1}” is among them: shall we start there? 🐑
`);
  ADV.packs = L(`
Los packs son listas para instalar varias apps de una vez. Prueba «{a1}»: pulsa «Copiar lista» y llevas todos los enlaces. 🎁 || Packs are ready-made lists to install several apps at once. Try “{a1}”: tap “Copy list” and you've got all the links. 🎁
Hay {n} packs. Si no sabes por dónde empezar, «{a1}» es un buen primer paso. 🧭 || There are {n} packs. If you don't know where to start, “{a1}” is a good first step. 🧭
Cada app de un pack es un botón: tócalo y te llevo a su ficha. Y revisa la fuente antes de instalar. 🔎 || Every app in a pack is a button: tap it and I'll take you to its card. And check the source before installing. 🔎
«{a1}» y «{a2}» son dos packs bien distintos. Elige el que se parezca más a ti. 🐑 || “{a1}” and “{a2}” are two very different packs. Pick the one that looks most like you. 🐑
Un pack es un atajo, no una orden: instala solo las apps que te convenzan. 🧶 || A pack is a shortcut, not an order: install only the apps that convince you. 🧶
Los packs no instalan nada solos: te dan la lista con enlaces. Tú decides qué entra en tu móvil. 🛡️ || Packs don't install anything by themselves: they give you the list with links. You decide what goes on your phone. 🛡️
`);
  /* consejos con apps reales de la carpeta: {carpeta} {n} {a1} {t1} {a2} {t2}  (los que llevan {a2} o {n} necesitan ≥ 2 apps) */
  ADV.gen = L(`
En «{carpeta}», mi consejo es «{a1}»: {t1}. Si te convence, sigue con «{a2}». 🐑 || In “{carpeta}”, my tip is “{a1}”: {t1}. If you like it, continue with “{a2}”. 🐑
Si no sabes por dónde empezar en «{carpeta}», empieza por «{a1}» ({t1}). 🧭 || If you don't know where to start in “{carpeta}”, start with “{a1}” ({t1}). 🧭
En «{carpeta}» hay {n} apps. Antes de instalar cualquiera, lee su etiqueta y su fuente. 🏷️ || There are {n} apps in “{carpeta}”. Before installing any, read its tag and its source. 🏷️
Guarda «{a1}» en favoritas con la ☆ y la tendrás a un toque desde «Favoritas». ⭐ || Save “{a1}” to favorites with the ☆ and you'll have it one tap away from “Favorites”. ⭐
Truco: si la descripción de «{a1}» se corta, pulsa «Leer más» para verla entera. 📖 || Trick: if the description of “{a1}” is cut off, tap “Read more” to see it all. 📖
Mi pareja favorita de «{carpeta}»: «{a1}» ({t1}) y «{a2}» ({t2}). 💞 || My favorite pair in “{carpeta}”: “{a1}” ({t1}) and “{a2}” ({t2}). 💞
Revisa siempre la fuente antes de instalar, también en «{carpeta}». Hasta las ovejas lo hacen. 🔎 || Always check the source before installing, in “{carpeta}” too. Even sheep do it. 🔎
¿Dudas entre «{a1}» y «{a2}»? Lee sus etiquetas: «{t1}» y «{t2}». A veces con eso basta. ⚖️ || Torn between “{a1}” and “{a2}”? Read their tags: “{t1}” and “{t2}”. Sometimes that's enough. ⚖️
`);
  ADV.tipw = L(`
Aviso sobre «{a1}»: {tip} ⚠️ || Notice about “{a1}”: {tip} ⚠️
Ojo con «{a1}»: {tip} 👀 || Careful with “{a1}”: {tip} 👀
Dato importante de «{a1}»: {tip} 📌 || Important note on “{a1}”: {tip} 📌
Antes de instalar «{a1}», recuerda: {tip} 🛑 || Before installing “{a1}”, remember: {tip} 🛑
`);
  /* Kixki enseña la función en sus consejos de siempre */
  ADV.hintPC = L(`
Mantén pulsado el icono de una carpeta (o haz clic derecho) y te ofrezco ayuda con ella. 🐑 || Hold down a folder icon (or right-click) and I'll offer to help you with it. 🐑
¿No sabes qué hay en una carpeta? Mantén pulsada y elige «Pedir ayuda»: te aconsejo con apps reales. 🧭 || Not sure what's in a folder? Hold it down and choose “Ask for help”: I'll advise you with real apps. 🧭
Con el teclado: enfoca una carpeta y pulsa Mayús + F10 (o la tecla de menú) para pedirme ayuda. ⌨️ || With the keyboard: focus a folder and press Shift + F10 (or the menu key) to ask me for help. ⌨️
`);
  ADV.hintMob = L(`
Mantén pulsada una carpeta y aparece «Pedir ayuda a Kixki». Te aconsejo sobre esa carpeta. 🐑 || Hold down a folder and “Ask Kixki for help” appears. I'll advise you about that folder. 🐑
¿Te pierdes en una carpeta? Mantén el dedo encima y te doy un consejo con apps reales. 🧭 || Lost in a folder? Keep your finger on it and I'll give you advice with real apps. 🧭
`);
}
