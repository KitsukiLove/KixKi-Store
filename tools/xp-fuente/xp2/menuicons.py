"""Iconos pequeños (32x32) para el menú Inicio XP de Kixki. Mismo lenguaje que icons.py: contorno oscuro, degradado y brillo."""
from icons import G, wrap, star

M = {}

# Ejecutar: ventanita con barra azul y el símbolo >_
M["run"] = wrap(G("a", "#ffffff", "#d9d3f0") + G("t", "#8d6df0", "#4a22b0"), """
<rect x='3' y='5' width='26' height='22' rx='2.5' fill='url(#a)' stroke='#2e2073' stroke-width='1.3'/>
<path d='M3 7.5Q3 5 5.5 5H26.5Q29 5 29 7.5V10H3Z' fill='url(#t)' stroke='#2e2073' stroke-width='1.3' stroke-linejoin='round'/>
<rect x='24' y='6.4' width='3.2' height='2.2' rx='.6' fill='#ff8a6a' stroke='#fff' stroke-width='.5'/>
<path d='M8 15l4.4 3.2L8 21.4' fill='none' stroke='#2e2073' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/>
<path d='M14.5 22.2H21' fill='none' stroke='#2e2073' stroke-width='2.2' stroke-linecap='round'/>""")

# Consejo: bombilla
M["bulb"] = wrap(G("a", "#fff9b8", "#f2b200") + G("b", "#d8d4e6", "#8c88a6"), """
<path d='M16 3.5C10.3 3.5 6.8 7.6 6.8 12.2c0 3.2 1.7 4.9 3.1 6.6.9 1.1 1.3 2.1 1.3 3.4h9.6c0-1.3.4-2.3 1.3-3.4 1.4-1.7 3.1-3.4 3.1-6.6 0-4.6-3.5-8.7-9.2-8.7Z' fill='url(#a)' stroke='#8a5a00' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M10 9.2C11 6.9 13.2 5.6 15.4 5.6' fill='none' stroke='#fff' stroke-width='1.8' stroke-linecap='round' opacity='.9'/>
<path d='M13 22.2v-5l3-2.2 3 2.2v5' fill='none' stroke='#8a5a00' stroke-width='1.1' stroke-linejoin='round'/>
<rect x='11.2' y='22.2' width='9.6' height='3.4' rx='1' fill='url(#b)' stroke='#4a4866' stroke-width='1.1'/>
<rect x='12.4' y='25.6' width='7.2' height='3' rx='1.2' fill='url(#b)' stroke='#4a4866' stroke-width='1.1'/>""")

# Salta Vallas: mando de juegos
M["pad"] = wrap(G("a", "#f4f1ff", "#8f86c4") + G("g", "#8be04a", "#2f8a1a") + G("r", "#ff8a78", "#c81e0c"), """
<path d='M9 8h14c4.2 0 6.4 3.4 7 8.4l.7 5.6c.3 2.8-1.6 4.4-3.7 3.2L22.6 23H9.4L5 25.2c-2.1 1.2-4-.4-3.7-3.2l.7-5.6C2.6 11.4 4.8 8 9 8Z' fill='url(#a)' stroke='#3b2f7a' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M8 10.2h16c2.6 0 4 1.6 4.6 4.4C23 16 9 16 3.4 14.6 4 11.8 5.4 10.2 8 10.2Z' fill='url(#gl)' opacity='.85'/>
<path d='M9.2 13.6v5.6M6.4 16.4h5.6' stroke='#3b2f7a' stroke-width='2.4' stroke-linecap='round'/>
<circle cx='21' cy='18.2' r='2' fill='url(#g)' stroke='#14500a' stroke-width='1'/>
<circle cx='25' cy='15.2' r='2' fill='url(#r)' stroke='#7a0c04' stroke-width='1'/>""")

# Sugerir: corazón
M["heart"] = wrap(G("a", "#ffb0c8", "#d81c54"), """
<path d='M16 28C6 21.4 3.4 15.8 3.4 11.4 3.4 7 6.6 4.2 10.2 4.2c2.6 0 4.5 1.4 5.8 3.6 1.3-2.2 3.2-3.6 5.8-3.6 3.6 0 6.8 2.8 6.8 7.2 0 4.4-2.6 10-12.6 16.6Z' fill='url(#a)' stroke='#7a0a30' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M7.2 10.4C7.6 8.4 9 7.2 10.8 7.2' fill='none' stroke='#fff' stroke-width='2' stroke-linecap='round' opacity='.9'/>""")

# Color: paleta de pintor
M["palette"] = wrap(G("a", "#fff2d6", "#e2b46c"), """
<path d='M16 4C8.6 4 3 9.2 3 15.6c0 6.2 4.8 10.6 10.4 10.6 2.2 0 3-1.2 3-2.4 0-1.8-1.6-2.2-1.6-3.8 0-1.4 1.2-2.2 2.8-2.2H22c3.8 0 7-2.2 7-6.2C29 7.6 23.6 4 16 4Z' fill='url(#a)' stroke='#7a4a10' stroke-width='1.3' stroke-linejoin='round'/>
<circle cx='9.4' cy='14.4' r='2.2' fill='#ff5a5a' stroke='#7a1010' stroke-width='.9'/>
<circle cx='13.6' cy='9.6' r='2.2' fill='#ffd23a' stroke='#8a6000' stroke-width='.9'/>
<circle cx='20.2' cy='9.6' r='2.2' fill='#4cc65a' stroke='#145a1e' stroke-width='.9'/>
<circle cx='24.4' cy='14.6' r='2.2' fill='#4a8cf0' stroke='#0a3a9e' stroke-width='.9'/>
<path d='M7 9.6C9 6.6 12 5.4 15 5.4' fill='none' stroke='#fff' stroke-width='1.6' stroke-linecap='round' opacity='.8'/>""")

# Logos pixel: cuadrícula de píxeles
M["pixel"] = wrap(G("a", "#ffffff", "#d7cdf6"), """
<rect x='3.5' y='3.5' width='25' height='25' rx='2' fill='url(#a)' stroke='#3b2480' stroke-width='1.3'/>
<g stroke='#3b2480' stroke-width='.7'>
<rect x='7' y='7' width='6' height='6' fill='#6b3fe0'/><rect x='13' y='7' width='6' height='6' fill='#ff8fc7'/><rect x='19' y='7' width='6' height='6' fill='#ffd36e'/>
<rect x='7' y='13' width='6' height='6' fill='#ff8fc7'/><rect x='13' y='13' width='6' height='6' fill='#ffffff'/><rect x='19' y='13' width='6' height='6' fill='#7ef0c4'/>
<rect x='7' y='19' width='6' height='6' fill='#ffd36e'/><rect x='13' y='19' width='6' height='6' fill='#7ef0c4'/><rect x='19' y='19' width='6' height='6' fill='#6b3fe0'/></g>""")

# Lluvia: nube con gotas
M["rain"] = wrap(G("a", "#ffffff", "#aab8d4") + G("d", "#bfe4ff", "#1d63d6"), """
<path d='M9 19.5C5.2 19.5 3 17 3 14c0-3 2.3-5 5.2-5 .9-3.2 3.7-5 7-5 4 0 6.8 2.7 7.2 6.2 3.2.1 5.6 2.1 5.6 5 0 3-2.4 4.3-5.4 4.3Z' fill='url(#a)' stroke='#4a5a80' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M7 11.6C8 9 10.4 7.2 13 7' fill='none' stroke='#fff' stroke-width='1.6' stroke-linecap='round' opacity='.9'/>
<g fill='url(#d)' stroke='#0a3a9e' stroke-width='.9'><path d='M9 22.2c1.2 1.8 1.6 2.8 1.6 3.6a1.6 1.6 0 0 1-3.2 0c0-.8.4-1.8 1.6-3.6Z'/><path d='M16 23.2c1.2 1.8 1.6 2.8 1.6 3.6a1.6 1.6 0 0 1-3.2 0c0-.8.4-1.8 1.6-3.6Z'/><path d='M23 22.2c1.2 1.8 1.6 2.8 1.6 3.6a1.6 1.6 0 0 1-3.2 0c0-.8.4-1.8 1.6-3.6Z'/></g>""")

# Sonido: altavoz con ondas
M["speaker"] = wrap(G("a", "#f4f1ff", "#8f86c4") + G("w", "#bfe4ff", "#1d63d6"), """
<path d='M4 12.5h5.2L16 6.4v19.2l-6.8-6.1H4Z' fill='url(#a)' stroke='#3b2f7a' stroke-width='1.3' stroke-linejoin='round'/>
<path d='M5 13.6h4.4L15 8.6' fill='none' stroke='#fff' stroke-width='1.3' stroke-linecap='round' opacity='.9'/>
<path d='M20 11.4c2 2.6 2 6.6 0 9.2' fill='none' stroke='#1d63d6' stroke-width='2.2' stroke-linecap='round'/>
<path d='M23.8 7.8c3.8 4.6 3.8 11.8 0 16.4' fill='none' stroke='#4a8cf0' stroke-width='2.2' stroke-linecap='round'/>""")

# Efectos: destellos
M["sparkle"] = wrap(G("a", "#fffbd0", "#f2b200") + G("b", "#ffd6ec", "#e0508f"), f"""
<polygon points='{star(14, 15, 11.5, 3.2, 4, -90)}' fill='url(#a)' stroke='#8a5a00' stroke-width='1.2' stroke-linejoin='round'/>
<polygon points='{star(25, 7, 5, 1.5, 4, -90)}' fill='url(#b)' stroke='#7a1a4a' stroke-width='1' stroke-linejoin='round'/>
<polygon points='{star(24.5, 24, 4.2, 1.3, 4, -90)}' fill='url(#a)' stroke='#8a5a00' stroke-width='1' stroke-linejoin='round'/>""")

# Cambiar estilo: monitor con la colina
M["monitor"] = wrap(G("a", "#f4f1ff", "#8f86c4") + G("s", "#2b6ad6", "#c5e3f7") + G("h", "#8be04a", "#2f8a1a"), """
<rect x='3' y='4' width='26' height='19' rx='2.4' fill='url(#a)' stroke='#3b2f7a' stroke-width='1.3'/>
<rect x='5.6' y='6.6' width='20.8' height='13.8' rx='1' fill='url(#s)' stroke='#1a3a82' stroke-width='.8'/>
<path d='M5.6 17.6C10 13.8 17 13.4 26.4 16.4V19.4a1 1 0 0 1-1 1H6.6a1 1 0 0 1-1-1Z' fill='url(#h)'/>
<path d='M6.4 8C10 7 16 6.8 20 7' stroke='#fff' stroke-width='1.2' stroke-linecap='round' opacity='.5' fill='none'/>
<path d='M12 23v3.2h8V23' fill='#b9b3d6' stroke='#3b2f7a' stroke-width='1.1'/>
<rect x='8.6' y='26.2' width='14.8' height='2.4' rx='1.1' fill='url(#a)' stroke='#3b2f7a' stroke-width='1.1'/>""")

# Apagar: botón rojo con símbolo de encendido
M["power"] = wrap("<radialGradient id='a' cx='.35' cy='.3' r='.9'><stop offset='0' stop-color='#ffb09a'/><stop offset='.5' stop-color='#e8451e'/><stop offset='1' stop-color='#a01a06'/></radialGradient>", """
<rect x='3' y='3' width='26' height='26' rx='6' fill='url(#a)' stroke='#5a0e02' stroke-width='1.3'/>
<path d='M4.6 9C4.6 6 6.6 4.6 9 4.6H23c2.4 0 4.4 1.4 4.4 4.4V14c-7 2.6-16.8 2.6-22.8 0Z' fill='url(#gl)' opacity='.8'/>
<path d='M16 8.6v7.4' stroke='#fff' stroke-width='3' stroke-linecap='round'/>
<path d='M11 11.2a7.4 7.4 0 1 0 10 0' fill='none' stroke='#fff' stroke-width='2.8' stroke-linecap='round'/>""", shadow=False)

# Cerrar todas: ventanas con aspa
M["closeall"] = wrap(G("a", "#ffffff", "#d9d3f0") + G("t", "#8d6df0", "#4a22b0"), """
<rect x='3' y='4.5' width='19' height='15' rx='2' fill='url(#a)' stroke='#2e2073' stroke-width='1.2'/>
<path d='M3 6.5Q3 4.5 5 4.5H20Q22 4.5 22 6.5V9H3Z' fill='url(#t)' stroke='#2e2073' stroke-width='1.2' stroke-linejoin='round'/>
<rect x='10' y='11.5' width='19' height='15' rx='2' fill='url(#a)' stroke='#2e2073' stroke-width='1.2'/>
<path d='M10 13.5Q10 11.5 12 11.5H27Q29 11.5 29 13.5V16H10Z' fill='url(#t)' stroke='#2e2073' stroke-width='1.2' stroke-linejoin='round'/>
<path d='M15.5 19.4l8 5.2M23.5 19.4l-8 5.2' stroke='#d8321a' stroke-width='2.4' stroke-linecap='round'/>""")

# Abrir en el móvil: código QR
M["qr"] = wrap(G("a", "#ffffff", "#e4def6"), """
<rect x='3.5' y='3.5' width='25' height='25' rx='2' fill='url(#a)' stroke='#2e2073' stroke-width='1.3'/>
<g fill='#2e2073'><rect x='7' y='7' width='7' height='7' rx='.8'/><rect x='18' y='7' width='7' height='7' rx='.8'/><rect x='7' y='18' width='7' height='7' rx='.8'/>
<rect x='18' y='18' width='3' height='3'/><rect x='22' y='22' width='3' height='3'/><rect x='18' y='22.4' width='2.6' height='2.6'/><rect x='22.4' y='18' width='2.6' height='2.6'/></g>
<g fill='#fff'><rect x='9' y='9' width='3' height='3'/><rect x='20' y='9' width='3' height='3'/><rect x='9' y='20' width='3' height='3'/></g>""")
