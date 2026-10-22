from icons import *
import re
def enc(s):
    s=re.sub(r'>\s+<','><',s.replace('\n','')).replace('"',"'")
    return s.replace('%','%25').replace('<','%3C').replace('>','%3E').replace('#','%23').replace(' ','%20')
out=['''/* =====================================================================
   KIXKI STORE · SET DE ICONOS XP «Luna Lana»  (xp-icons.css)
   ---------------------------------------------------------------------
   · 33 iconos vectoriales 48×48: luz arriba-izquierda, contorno del mismo
     tono que el objeto, brillo superior y sombra suave. Se ven nítidos de
     16 a 96 px (sin pixelado).
   · DROP-IN: usa los mismos nombres --xpi-* que xp.css, así que basta con
     enlazarlo DESPUÉS de xp.css y todos los iconos del tema cambian solos:
         <link rel="stylesheet" href="xp.css">
         <link rel="stylesheet" href="xp-icons.css">
   · Nuevos: sun, sheep, folder, download, info, check, question, warning,
     error, lobo, bandera, cartas, trofeo.
   · Uso suelto en cualquier sitio:
         <i class="xpi xpi-sheep"></i>            (tamaño = font-size)
         <i class="xpi xpi-folder" style="--s:32px"></i>
   · utilidad = llave inglesa + engranaje (antes era un escudo); el escudo
     de antes ya no hace falta.
   ===================================================================== */
:root{''']
for n in ORDER: out.append(f'--xpi-{n}:url("data:image/svg+xml,{enc(svg(n))}");')
out.append('}\n.xpi{display:inline-block;flex:none;width:var(--s,1.5em);height:var(--s,1.5em);vertical-align:middle;background:var(--xpi) center/contain no-repeat;image-rendering:auto}\n')
out.append(''.join(f'.xpi-{n}{{--xpi:var(--xpi-{n})}}' for n in ORDER)+'\n')
open('../../xp-icons.css','w').write('\n'.join(out))
import os;print(os.path.getsize('../../xp-icons.css'))
