"""Carpetas XP del escritorio: una carpeta con el color de la categoría y su icono XP pegado encima.
Uso:  python3 folders_xp.py   (lee ../../xp-icons.css, reemplaza/añade el bloque «CARPETAS» al final)"""
import re, os, colorsys, urllib.parse as U
here=os.path.dirname(os.path.abspath(__file__)); CSS=os.path.join(here,"..","..","xp-icons.css")
HUE={"tiendas":"#8b6cf0","importante":"#f5a524","utilidad":"#3aa6e8","privacidad":"#2fb8c4","emulacion":"#e5584f","decoracion":"#f06aa8","musica":"#36c08e","teclados":"#7c8cf5","control":"#9bc53d","pantalla":"#e8883b","fotos":"#b57cf0","internet":"#4f7df0","dia":"#d6a84a","favs":"#ffc23a","news":"#ff7a59","packs":"#4ccf9b","mensajeria":"#d86ae0","sistemas":"#8e9aaf"}
def hx(h): return tuple(int(h[i:i+2],16)/255 for i in (1,3,5))
def col(h,l=None,s=None,dl=0):
    r,g,b=hx(h); H,L,S=colorsys.rgb_to_hls(r,g,b)
    L=min(1,max(0,L+dl)) if l is None else l; S=S if s is None else s
    r,g,b=colorsys.hls_to_rgb(H,L,S); return "#%02x%02x%02x"%(round(r*255),round(g*255),round(b*255))
EXTRA={
"mensajeria":("<defs><linearGradient id='mA' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#f6d4ff'/><stop offset='1' stop-color='#d070e0'/></linearGradient><linearGradient id='mB' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fff'/><stop offset='.5' stop-color='#f0b8ff'/><stop offset='1' stop-color='#b04ac8'/></linearGradient></defs>"
 "<path d='M6 9a3 3 0 0 1 3-3h21a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H17l-6 5v-5H9a3 3 0 0 1-3-3z' fill='url(#mA)' stroke='#7a2a92' stroke-width='1.6' stroke-linejoin='round'/>"
 "<path d='M18 20a3 3 0 0 1 3-3h20a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-2v6l-7-6H21a3 3 0 0 1-3-3z' fill='url(#mB)' stroke='#6a1f80' stroke-width='1.6' stroke-linejoin='round'/>"
 "<g fill='#6a1f80'><circle cx='25.500' cy='26' r='2'/><circle cx='31' cy='26' r='2'/><circle cx='36.500' cy='26' r='2'/></g>"),
"sistemas":("<defs><radialGradient id='sA' cx='.35' cy='.3' r='.9'><stop offset='0' stop-color='#fff'/><stop offset='.55' stop-color='#cfd9ea'/><stop offset='1' stop-color='#8a9bb8'/></radialGradient></defs>"
 "<circle cx='24' cy='24' r='19' fill='url(#sA)' stroke='#4a5b7a' stroke-width='1.7'/>"
 "<circle cx='24' cy='24' r='12' fill='none' stroke='#fff' stroke-opacity='.55' stroke-width='1'/>"
 "<path d='M24 24 L10 12 A19 19 0 0 1 24 5z' fill='#7ec8ff' opacity='.35'/><path d='M24 24 L38 36 A19 19 0 0 1 24 43z' fill='#ff9ad5' opacity='.3'/>"
 "<circle cx='24' cy='24' r='5' fill='#e9f0fb' stroke='#4a5b7a' stroke-width='1.4'/><circle cx='24' cy='24' r='2' fill='#4a5b7a'/>"),
}
def icon_body(css,id):
    if id in EXTRA:
        return EXTRA[id]
    m=re.search(r'--xpi-%s:url\("data:image/svg\+xml,([^"]*)"\)'%id,css)
    svg=U.unquote(m.group(1))
    svg=re.sub(r"^<svg[^>]*>","",svg); svg=svg[:svg.rfind("</svg>")]
    svg=re.sub(r"<ellipse[^>]*opacity='\.22'/>","",svg,count=1)          # sombra de suelo del icono suelto
    p="e"+id[:3]
    svg=re.sub(r"id='(\w+)'",lambda m:"id='%s%s'"%(p,m.group(1)),svg)
    svg=re.sub(r"url\(#(\w+)\)",lambda m:"url(#%s%s)"%(p,m.group(1)),svg)
    return svg
def folder(css,id):
    h=HUE[id]; p="f"+id[:3]
    a0,a1=col(h,l=.62,s=.75),col(h,l=.40,s=.70)     # fondo (pestaña)
    b0,b1,b2=col(h,l=.90,s=.85),col(h,l=.68,s=.78),col(h,l=.52,s=.72)  # frente
    st,st2=col(h,l=.24,s=.6),col(h,l=.30,s=.6)
    emb=icon_body(css,id)
    return (f"<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><defs>"
      f"<linearGradient id='{p}a' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='{a0}'/><stop offset='1' stop-color='{a1}'/></linearGradient>"
      f"<linearGradient id='{p}b' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='{b0}'/><stop offset='.45' stop-color='{b1}'/><stop offset='1' stop-color='{b2}'/></linearGradient>"
      f"<linearGradient id='{p}w' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fff' stop-opacity='.8'/><stop offset='1' stop-color='#fff' stop-opacity='0'/></linearGradient>"
      f"<filter id='{p}d' x='-20%' y='-20%' width='140%' height='150%'><feDropShadow dx='0' dy='1.2' stdDeviation='.9' flood-color='#1a0a3c' flood-opacity='.4'/></filter></defs>"
      f"<ellipse cx='24' cy='44.6' rx='17' ry='2.3' fill='#0a1a3c' opacity='.22'/>"
      f"<path d='M3.5 12a3 3 0 0 1 3-3h10.5l4 4.2h20.500a3 3 0 0 1 3 3V39a3 3 0 0 1-3 3h-35a3 3 0 0 1-3-3z' fill='url(#{p}a)' stroke='{st}' stroke-width='1.6' stroke-linejoin='round'/>"
      f"<path d='M3.5 21.500a3 3 0 0 1 3-3h35a3 3 0 0 1 3 3V40a3 3 0 0 1-3 3h-35a3 3 0 0 1-3-3z' fill='url(#{p}b)' stroke='{st2}' stroke-width='1.6' stroke-linejoin='round'/>"
      f"<path d='M6.500 19.500h35a2 2 0 0 1 2 2v5c-12-2.600-27-2.600-39 0v-5a2 2 0 0 1 2-2z' fill='url(#{p}w)' opacity='.8'/>"
      f"<g filter='url(#{p}d)'><g transform='translate(13.200 15.600) scale(.66)'>{emb}</g></g></svg>")
def enc(s): return U.quote(s,safe="/:='(),.;-")
if __name__=="__main__":
    css=open(CSS,encoding="utf-8").read()
    css=css.split("/* ===== CARPETAS ===== */")[0].rstrip()+"\n"
    out=["/* ===== CARPETAS ===== */",
         "/* Iconos del escritorio: carpeta del color de cada categoría con su símbolo (se generan con tools/xp-fuente/folders_xp.py) */",":root{"]
    for i in HUE: out.append('--xpf-%s:url("data:image/svg+xml,%s");'%(i,enc(folder(css,i))))
    for i in EXTRA: out.append('--xpi-%s:url("data:image/svg+xml,%s");'%(i,enc("<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'>"+EXTRA[i]+"</svg>")))
    out.append("}")
    for i in HUE: out.append('.di[data-id="%s"]{--xpi:var(--xpf-%s)}'%(i,i))
    for i in EXTRA:
        out.append('.tk[data-id="%s"],.tab[href="#%s"],.cat#%s{--xpi:var(--xpi-%s)}'%(i,i,i,i))
    out.append(".dsk #desk .di .spr,:root:not(.dsk) #desk .di .spr{width:60px;height:60px}")
    open(CSS,"w",encoding="utf-8").write(css+"\n".join(out)+"\n")
    print("ok",len(css))
