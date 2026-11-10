# Kixki XP · set de iconos «Luna Lana» (48×48, luz arriba-izquierda, contorno de su propio tono, brillo superior)
import math
def lg(i,*c,d='v'):
    x2,y2={'v':(0,1),'d':(1,1),'h':(1,0)}[d]; n=len(c)-1
    return f'<linearGradient id="{i}" x1="0" y1="0" x2="{x2}" y2="{y2}">'+''.join(f'<stop offset="{k/n:.2f}" stop-color="{col}"/>' for k,col in enumerate(c))+'</linearGradient>'
def rg(i,*c,cx=.35,cy=.3,r=.75):
    n=len(c)-1
    return f'<radialGradient id="{i}" cx="{cx}" cy="{cy}" r="{r}">'+''.join(f'<stop offset="{k/n:.2f}" stop-color="{col}"/>' for k,col in enumerate(c))+'</radialGradient>'
def gl(i,a=.8,b=0):  # brillo blanco vertical
    return f'<linearGradient id="{i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="{a}"/><stop offset="1" stop-color="#fff" stop-opacity="{b}"/></linearGradient>'
SH='<ellipse cx="24" cy="44.4" rx="15" ry="2.4" fill="#0a1a3c" opacity=".22"/>'
def star(cx,cy,R,r,n=5,rot=-90):
    pts=[]
    for k in range(n*2):
        a=math.radians(rot+k*180/n); rr=R if k%2==0 else r
        pts.append(f'{cx+rr*math.cos(a):.2f} {cy+rr*math.sin(a):.2f}')
    return 'M'+'L'.join(pts)+'Z'
def gear(cx,cy,R,r,n=8,tw=.2):
    pts=[]
    for k in range(n):
        a=k*2*math.pi/n
        for da,rr in((-tw*1.6,r),(-tw,R),(tw,R),(tw*1.6,r)):
            pts.append(f'{cx+rr*math.cos(a+da):.2f} {cy+rr*math.sin(a+da):.2f}')
    return 'M'+'L'.join(pts)+'Z'

I={}
def icon(name):
    def deco(f):
        I[name]=f; return f
    return deco

@icon('tiendas')
def _(p):
    d=lg(p+'a','#e4d2ff','#a77cf2','#6a3ad4','#4a22a8')+gl(p+'w',.75,0)
    b=(SH+'<path d="M17 20v-5a7 7 0 0 1 14 0v5" fill="none" stroke="#35197f" stroke-width="5" stroke-linecap="round"/>'
    '<path d="M17 20v-5a7 7 0 0 1 14 0v5" fill="none" stroke="#d9c8ff" stroke-width="2.2" stroke-linecap="round"/>'
    f'<path d="M9.500 19h29l2.600 22.300c.2 1.800-1.200 3.400-3 3.400H9.900c-1.800 0-3.200-1.600-3-3.400z" fill="url(#{p}a)" stroke="#35197f" stroke-width="1.7" stroke-linejoin="round"/>'
    f'<path d="M11 21h9c-.5 8-2.500 14-6.500 18.500l-3-.2z" fill="url(#{p}w)" opacity=".55"/>'
    '<circle cx="17" cy="24" r="1.500" fill="#35197f"/><circle cx="31" cy="24" r="1.500" fill="#35197f"/>'
    '<g stroke="#8d78c7" stroke-width="1.100" fill="#fff"><circle cx="19" cy="34.500" r="3.600"/><circle cx="23" cy="31.800" r="4"/><circle cx="27.500" cy="33" r="3.800"/><circle cx="29" cy="37" r="3"/><circle cx="21.500" cy="37.500" r="3"/></g>'
    '<g stroke="none" fill="#fff"><circle cx="19" cy="34.500" r="3.200"/><circle cx="23" cy="31.800" r="3.600"/><circle cx="27.500" cy="33" r="3.400"/><circle cx="29" cy="37" r="2.600"/><circle cx="21.500" cy="37.500" r="2.600"/></g>'
    '<ellipse cx="25" cy="36" rx="3" ry="3.300" fill="#ffd2b0" stroke="#7a4a3a" stroke-width=".8"/><circle cx="24" cy="35.200" r=".7" fill="#2b1a5e"/><circle cx="26.200" cy="35.200" r=".7" fill="#2b1a5e"/>')
    return d,b

@icon('importante')
def _(p):
    d=lg(p+'a','#fff7b8','#ffd43c','#e69a0c','#b86b00',d='h')+gl(p+'w',.8,0)
    b=(SH+'<g transform="rotate(-45 24 24)">'
    f'<path d="M24 19v22.500a1.500 1.500 0 0 0 1.500 1.500h6a1.500 1.500 0 0 0 1.500-1.500v-2h-4.500v-2h4.500v-1.500a1.500 1.500 0 0 0-1.500-1.500h-3.500V19z" fill="url(#{p}a)" stroke="#8a4b00" stroke-width="1.600" stroke-linejoin="round"/>'
    f'<path fill-rule="evenodd" d="M24 2.500a9 9 0 1 0 .01 0zM24 8.200a3.300 3.300 0 1 1-.01 0z" fill="url(#{p}a)" stroke="#8a4b00" stroke-width="1.600"/>'
    f'<path d="M17 9a7 7 0 0 1 8-5.500 8 8 0 0 0-8 7z" fill="#fff" opacity=".75"/></g>'
    '<path d="M38 8l1.300 3.200 3.200 1.300-3.200 1.300L38 17l-1.300-3.200-3.200-1.300 3.200-1.300z" fill="#fff" opacity=".9"/>')
    return d,b

@icon('control')
def _(p):
    d=lg(p+'a','#fafcff','#d5deee','#a9b8d3')+rg(p+'b','#bfe3ff','#2f84ea','#0a45b0')+rg(p+'c','#d6ffc0','#3fc21f','#1a7d0a')+rg(p+'e','#ffe0a8','#ff9a1f','#c4560a')
    b=SH+f'<rect x="5" y="7" width="38" height="35" rx="5" fill="url(#{p}a)" stroke="#43587f" stroke-width="1.700"/><rect x="6.500" y="8.500" width="35" height="6" rx="3.500" fill="#fff" opacity=".6"/>'
    for y,x,g,col in((17,16,'b','#2c6fd0'),(25.500,31,'c','#2a9a14'),(34,22,'e','#d8660d')):
        b+=f'<rect x="10.500" y="{y-1.8}" width="27" height="3.600" rx="1.800" fill="#7e8da9" stroke="#4d5f82" stroke-width=".8"/><rect x="11" y="{y-1.2}" width="{x-11}" height="2.400" rx="1.200" fill="{col}" opacity=".85"/>'
        b+=f'<circle cx="{x}" cy="{y}" r="4.600" fill="url(#{p}{g})" stroke="#1a2f66" stroke-width="1.300"/><ellipse cx="{x-1}" cy="{y-1.800}" rx="2" ry="1.200" fill="#fff" opacity=".7"/>'
    return d,b

@icon('utilidad')
def _(p):
    d=lg(p+'a','#f7f9fd','#c3cddf','#7f8eaa','#56658a',d='d')+lg(p+'b','#ffd9a0','#f08a1c','#b24d06',d='h')
    wr=('<g transform="rotate(45 24 24)">'
    f'<path d="M21.800 15.500h4.400v22.500a2.200 2.200 0 0 1-4.400 0z" fill="url(#{p}b)" stroke="#7a3604" stroke-width="1.500"/>'
    f'<path d="M21.200 5.040A7.500 7.500 0 1 0 26.800 5.040L26.800 11.500L21.200 11.500Z" fill="url(#{p}b)" stroke="#7a3604" stroke-width="1.500" stroke-linejoin="round"/>'
    '<path d="M16.500 10a7.500 7.500 0 0 1 4-4.500" fill="none" stroke="#fff" stroke-width="1.400" opacity=".8" stroke-linecap="round"/></g>')
    b=(SH+f'<path d="{gear(20,29,15,11.2)}" fill="url(#{p}a)" stroke="#3f4e73" stroke-width="1.600" stroke-linejoin="round"/>'
    f'<circle cx="20" cy="29" r="6.400" fill="#aab6cd" stroke="#3f4e73" stroke-width="1.400"/><circle cx="20" cy="29" r="3" fill="#3f4e73"/><circle cx="18.800" cy="27.800" r="1" fill="#fff" opacity=".7"/>'+wr)
    return d,b

@icon('pantalla')
def _(p):
    d=lg(p+'a','#7b86a6','#363d58','#1c2033',d='d')+lg(p+'s','#4fb6ff','#9fdcff','#dff4ff')+gl(p+'w',.55,0)
    b=(SH+f'<rect x="13.500" y="2.500" width="21" height="42" rx="4.500" fill="url(#{p}a)" stroke="#0d1020" stroke-width="1.600"/>'
    f'<rect x="16.200" y="8" width="15.600" height="29" rx="1.500" fill="url(#{p}s)" stroke="#0d1020" stroke-width="1"/>'
    '<path d="M16.200 30c4-3.200 9-3.500 15.600-1.200V35.500a1.500 1.500 0 0 1-1.500 1.500H17.700a1.500 1.500 0 0 1-1.500-1.500z" fill="#5cc23c"/><path d="M16.200 34c5-2 10-2 15.600 0v1.500a1.500 1.500 0 0 1-1.500 1.500H17.700a1.500 1.500 0 0 1-1.500-1.500z" fill="#3a9a26"/>'
    '<circle cx="27.500" cy="14.500" r="2.600" fill="#ffe36a"/>'
    f'<path d="M16.200 8h15.600L16.200 25z" fill="#fff" opacity=".28"/><path d="M15 4.500h18c.8 0 1.500.6 1.500 1.400v2H13.500v-2c0-.8.700-1.400 1.500-1.400z" fill="url(#{p}w)" opacity=".5"/>'
    '<rect x="20.500" y="4.700" width="7" height="1.500" rx=".75" fill="#05070f"/><circle cx="24" cy="41" r="2" fill="none" stroke="#9aa4c2" stroke-width="1.100"/>')
    return d,b

@icon('privacidad')
def _(p):
    d=lg(p+'a','#fff6b0','#ffd23a','#e2900a','#b36600')+lg(p+'s','#f4f7fc','#aab6cc','#6c7a98')+gl(p+'w',.8,0)
    b=(SH+'<path d="M14.500 23v-7.500a9.500 9.500 0 0 1 19 0V23" fill="none" stroke="#3f4e73" stroke-width="6.200"/><path d="M14.500 23v-7.500a9.500 9.500 0 0 1 19 0V23" fill="none" stroke="url(#'+p+'s)" stroke-width="3.600"/>'
    f'<rect x="8.500" y="21" width="31" height="23" rx="4.500" fill="url(#{p}a)" stroke="#8a4b00" stroke-width="1.700"/>'
    f'<path d="M12 21.800h24a3 3 0 0 1 3 3V28H9v-3.200a3 3 0 0 1 3-3z" fill="url(#{p}w)" opacity=".7"/>'
    '<circle cx="24" cy="30.500" r="3.400" fill="#5a3300"/><path d="M22.300 32h3.400l1.200 7h-5.800z" fill="#5a3300"/>')
    return d,b

@icon('fotos')
def _(p):
    d=lg(p+'a','#3fa6ff','#9bdcff','#e2f6ff')+lg(p+'f','#ffffff','#e6ebf5')
    b=(SH+'<g transform="rotate(-9 24 24)"><rect x="8" y="8" width="29" height="24" rx="2" fill="#fff" stroke="#7d8cab" stroke-width="1.300"/><rect x="10.500" y="10.500" width="24" height="16" fill="#cfe5fa"/></g>'
    f'<g transform="rotate(4 24 24)"><rect x="7" y="11" width="34" height="29" rx="2.200" fill="url(#{p}f)" stroke="#6b7c9e" stroke-width="1.600"/>'
    f'<rect x="10.500" y="14.500" width="27" height="19.500" fill="url(#{p}a)" stroke="#4a5d82" stroke-width="1"/>'
    '<circle cx="31.500" cy="20.500" r="3.200" fill="#ffe36a"/><path d="M10.500 30c5-6 10-6.500 15-3 4 2.500 8 1.500 12-1.500V34h-27z" fill="#5cc23c"/><path d="M10.500 32.500c6-3 12-2 17 0 4 1.500 7 1 10-.5V34h-27z" fill="#3a9a26"/>'
    '<path d="M10.500 14.500h27L10.500 28z" fill="#fff" opacity=".28"/></g>')
    return d,b

@icon('internet')
def _(p):
    d=rg(p+'a','#b8ecff','#3a9bf5','#0c55c2','#0a3a8a',cx=.35,cy=.3,r=.85)+gl(p+'w',.7,0)
    b=(SH+f'<clipPath id="{p}c"><circle cx="24" cy="24" r="19"/></clipPath><circle cx="24" cy="24" r="19" fill="url(#{p}a)"/>'
    f'<g clip-path="url(#{p}c)"><path d="M8 13c4-4 9-4.500 12-2 2 2-1 4 0 6.500s4 2 3 6-5 3.500-6 7.500-1 7-4.500 6.500c-4-3-4-9-6-13.500-1-3-2.500-4-1.500-7z" fill="#58c63a" stroke="#2e8a1c" stroke-width=".9"/>'
    '<path d="M28 9c4-1.500 9 0 11 3.500 2 3.500-1.500 5-.5 8.500s4 3 2.500 7-6 4-8.500 5-3-4-3.500-7.500-3.500-5-2-8 1-7 1-8.500z" fill="#58c63a" stroke="#2e8a1c" stroke-width=".9"/>'
    '<g fill="none" stroke="#fff" stroke-width=".8" opacity=".3"><ellipse cx="24" cy="24" rx="8" ry="19"/><path d="M5 24h38M7 15h34M7 33h34"/></g></g>'
    f'<circle cx="24" cy="24" r="19" fill="none" stroke="#08336f" stroke-width="1.700"/><path d="M9.500 18c2-6.500 8-10 14.500-10-3 3-5 7-5 12-5.500 0-8.500-.5-9.500-2z" fill="url(#{p}w)" opacity=".7"/>')
    return d,b

@icon('dia')
def _(p):
    d=lg(p+'a','#ffffff','#e7ecf6')+lg(p+'r','#ff9684','#e3361f','#a81a0c')+lg(p+'s','#f7f9fd','#9eabc4','#5e6c88',d='h')
    b=SH+f'<rect x="6.500" y="9" width="35" height="34" rx="3.500" fill="url(#{p}a)" stroke="#55638a" stroke-width="1.600"/><path d="M6.500 12.500a3.500 3.500 0 0 1 3.500-3.500h28a3.500 3.500 0 0 1 3.500 3.500V19h-35z" fill="url(#{p}r)" stroke="#8c1409" stroke-width="1.600" stroke-linejoin="round"/><path d="M9 11.500h30" stroke="#fff" opacity=".5" stroke-width="1.500" stroke-linecap="round"/>'
    for x in(14,31.500):
        b+=f'<rect x="{x-2.500}" y="4.500" width="5" height="10" rx="2.500" fill="url(#{p}s)" stroke="#3f4e73" stroke-width="1.100"/>'
    for r in range(3):
        for c in range(5):
            x=10+c*5.900;y=23+r*6.300
            if r==1 and c==2: b+=f'<rect x="{x-.5}" y="{y-.5}" width="5" height="4.600" rx="1" fill="#ff8a1f" stroke="#b4510a" stroke-width=".8"/>'
            else: b+=f'<rect x="{x}" y="{y}" width="4" height="3.600" rx=".8" fill="#b9c6e0"/>'
    return d,b

@icon('emulacion')
def _(p):
    d=lg(p+'a','#fbfcff','#cdd3e3','#8f98b4')+lg(p+'k','#7a86a8','#3a4262')+gl(p+'w',.8,0)
    b=(SH+f'<path d="M13 13.500h22c5.500 0 8.600 3.400 10.200 10.500 1.500 6.800 1.200 12.200-3.300 13.200-3 .6-5-1.400-7-4.200-1.200-1.700-2.600-2.500-4.300-2.500H17.400c-1.700 0-3.100.8-4.300 2.500-2 2.800-4 4.800-7 4.200C1.600 36.200 1.300 30.800 2.800 24 4.400 16.900 7.500 13.500 13 13.500z" fill="url(#{p}a)" stroke="#4b5370" stroke-width="1.700" stroke-linejoin="round"/>'
    f'<path d="M12 15.500h23c3 0 5.500 1 7 4-3-1.500-6-2-9-2H14c-3 0-6 .5-8.500 2 1.200-2.500 3.300-4 6.500-4z" fill="url(#{p}w)" opacity=".8"/>'
    f'<path d="M11.500 18.800h5v3h3v5h-3v3h-5v-3h-3v-5h3z" fill="url(#{p}k)" stroke="#232b45" stroke-width="1" stroke-linejoin="round"/>'
    '<rect x="21" y="24.500" width="3.800" height="1.800" rx=".9" fill="#4b5370" transform="rotate(-20 23 25.500)"/><rect x="26.500" y="24.500" width="3.800" height="1.800" rx=".9" fill="#4b5370" transform="rotate(-20 28.500 25.500)"/>'
    '<g stroke-width="1" stroke="#0a0f20" stroke-opacity=".55"><circle cx="35" cy="18.500" r="2.700" fill="#3b8cf0"/><circle cx="39.200" cy="22.600" r="2.700" fill="#e83a2a"/><circle cx="35" cy="26.700" r="2.700" fill="#ffd23a"/><circle cx="30.800" cy="22.600" r="2.700" fill="#3fc21f"/></g>')
    return d,b

@icon('decoracion')
def _(p):
    d=lg(p+'a','#fff0c8','#f2cb82','#d49b45',d='d')
    def dab(x,y,c1,c2,i): return rg(p+i,c1,c2,cx=.35,cy=.3,r=.8)
    d+=dab(0,0,'#ffc2b8','#e12a1a','r')+dab(0,0,'#fff4a0','#f2b800','y')+dab(0,0,'#bff5a0','#2fa514','g')+dab(0,0,'#bfdcff','#2468e0','b')
    b=(SH+f'<path d="M24 4.500C12 4.500 3.500 12.500 3.500 23.500S12 43 20 43c3.300 0 4.500-2 4.500-4 0-3 2.500-4.500 5.500-4.500h6c5.500 0 8.500-3.700 8.500-9C44.500 13.500 36 4.500 24 4.500z" fill="url(#{p}a)" stroke="#7a4a10" stroke-width="1.700" stroke-linejoin="round"/>'
    '<path d="M10 14c3-4 8-6 14-6" fill="none" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>'
    '<ellipse cx="15" cy="33" rx="3.500" ry="3" fill="#fff6dd" stroke="#8a5a20" stroke-width="1.200"/>')
    for x,y,i in((12,21,'r'),(19.500,12.500,'y'),(30.500,12,'g'),(37,21,'b')):
        b+=f'<circle cx="{x}" cy="{y}" r="4.200" fill="url(#{p}{i})" stroke="#4a2c08" stroke-opacity=".6" stroke-width="1"/><ellipse cx="{x-1.200}" cy="{y-1.700}" rx="1.700" ry="1" fill="#fff" opacity=".7"/>'
    return d,b

@icon('musica')
def _(p):
    d=lg(p+'a','#9ff7c8','#2cc27c','#0d7d4c',d='d')+gl(p+'w',.7,0)
    b=(SH+f'<path d="M18.200 11.500l23.200-5V14L18.200 19z" fill="url(#{p}a)" stroke="#075b38" stroke-width="1.500" stroke-linejoin="round"/>'
    f'<rect x="17.200" y="11" width="3.800" height="25" rx="1" fill="url(#{p}a)" stroke="#075b38" stroke-width="1.400"/><rect x="37.800" y="6.500" width="3.800" height="25" rx="1" fill="url(#{p}a)" stroke="#075b38" stroke-width="1.400"/>'
    f'<ellipse cx="13.500" cy="36.500" rx="6.800" ry="5" transform="rotate(-22 13.500 36.500)" fill="url(#{p}a)" stroke="#075b38" stroke-width="1.500"/><ellipse cx="34" cy="32" rx="6.800" ry="5" transform="rotate(-22 34 32)" fill="url(#{p}a)" stroke="#075b38" stroke-width="1.500"/>'
    '<ellipse cx="11.500" cy="35" rx="2.600" ry="1.300" transform="rotate(-22 11.500 35)" fill="#fff" opacity=".7"/><ellipse cx="32" cy="30.500" rx="2.600" ry="1.300" transform="rotate(-22 32 30.500)" fill="#fff" opacity=".7"/><path d="M20 12.500l19-4" stroke="#fff" opacity=".5" stroke-width="1.200"/>')
    return d,b

@icon('teclados')
def _(p):
    d=lg(p+'a','#fbfcff','#cfd5e4','#9099b4')+lg(p+'k','#ffffff','#e4e9f4')+gl(p+'w',.8,0)
    b=SH+f'<rect x="2.500" y="11" width="43" height="28" rx="4.500" fill="url(#{p}a)" stroke="#4b5370" stroke-width="1.700"/><path d="M5 12.500h38a2.500 2.500 0 0 1 2 1H3a2.500 2.500 0 0 1 2-1z" fill="#fff" opacity=".8"/>'
    for y,n,x0 in((14.500,10,5.200),(19.800,9,7),(25.100,9,7.800)):
        for k in range(n):
            col='#d6c8ff' if (y==25.100 and k==8) else f'url(#{p}k)'
            b+=f'<rect x="{x0+k*3.900:.1f}" y="{y}" width="3.200" height="4" rx=".8" fill="{col}" stroke="#7a84a3" stroke-width=".7"/>'
    b+=f'<rect x="12.500" y="30.400" width="23" height="4" rx=".9" fill="url(#{p}k)" stroke="#7a84a3" stroke-width=".7"/><rect x="5.200" y="30.400" width="6" height="4" rx=".9" fill="url(#{p}k)" stroke="#7a84a3" stroke-width=".7"/><rect x="36.800" y="30.400" width="6" height="4" rx=".9" fill="url(#{p}k)" stroke="#7a84a3" stroke-width=".7"/>'
    return d,b

@icon('favs')
def _(p):
    d=lg(p+'a','#fff9b8','#ffd83a','#f0a000','#c47400',d='d')
    b=SH+f'<path d="{star(24,25,21,9)}" fill="url(#{p}a)" stroke="#a86400" stroke-width="1.800" stroke-linejoin="round"/><path d="M24 8.500l3.500 9.500-6.500 3-8.500-.5z" fill="#fff" opacity=".6"/><circle cx="19" cy="17.500" r="1.500" fill="#fff" opacity=".9"/>'
    return d,b

@icon('news')
def _(p):
    d=lg(p+'a','#ffe29a','#ff9a28','#e0500a','#b83400')
    b=SH+f'<path d="{star(24,24,22,16,12,-90)}" fill="url(#{p}a)" stroke="#9c2e00" stroke-width="1.700" stroke-linejoin="round"/><path d="{star(24,24,11.500,2.400,4,-90)}" fill="#fff" stroke="#ffd9a0" stroke-width=".8" stroke-linejoin="round"/><path d="M13 14c4-3.500 9-5 14-4.500" stroke="#fff" opacity=".5" stroke-width="2" fill="none" stroke-linecap="round"/>'
    return d,b

@icon('packs')
def _(p):
    d=lg(p+'a','#ff9e8c','#e53a22','#a31405',d='h')+lg(p+'b','#ff7a66','#c22210','#8a1000',d='h')+lg(p+'y','#fff3a0','#ffd23a','#e09a10',d='h')
    b=(SH+f'<rect x="8" y="22" width="32" height="21.500" rx="2.200" fill="url(#{p}a)" stroke="#6e0d00" stroke-width="1.600"/><rect x="5" y="15.500" width="38" height="8.500" rx="2.200" fill="url(#{p}b)" stroke="#6e0d00" stroke-width="1.600"/>'
    f'<rect x="20.800" y="15.500" width="6.400" height="28" fill="url(#{p}y)" stroke="#9a5f00" stroke-width="1.300"/>'
    f'<path d="M24 15C18 15 12.500 12.500 14.500 8.500S21.500 8 24 15z" fill="url(#{p}y)" stroke="#9a5f00" stroke-width="1.400" stroke-linejoin="round"/><path d="M24 15c6 0 11.500-2.500 9.500-6.500S26.500 8 24 15z" fill="url(#{p}y)" stroke="#9a5f00" stroke-width="1.400" stroke-linejoin="round"/>'
    f'<circle cx="24" cy="14.500" r="3" fill="url(#{p}y)" stroke="#9a5f00" stroke-width="1.300"/><path d="M10 24.500v14" stroke="#fff" opacity=".4" stroke-width="2" stroke-linecap="round"/>')
    return d,b

@icon('search')
def _(p):
    d=rg(p+'a','#ffffff','#bfe4ff','#6fb0f0',cx=.35,cy=.3,r=.8)+lg(p+'h','#a8632a','#6b3510',d='h')
    b=(SH+'<path d="M31 31l10.500 10.500" stroke="#3d1d06" stroke-width="8" stroke-linecap="round"/><path d="M31 31l10.500 10.500" stroke="url(#'+p+'h)" stroke-width="5.400" stroke-linecap="round"/>'
    f'<circle cx="20" cy="20" r="14" fill="url(#{p}a)" fill-opacity=".85" stroke="#2c4a8a" stroke-width="4.400"/><circle cx="20" cy="20" r="14" fill="none" stroke="#9db9ee" stroke-width="1.400"/>'
    '<path d="M11.500 17a9.500 9.500 0 0 1 8-6.500" fill="none" stroke="#fff" stroke-width="2.600" stroke-linecap="round"/>')
    return d,b

@icon('home')
def _(p):
    d=lg(p+'r','#ff8f7c','#d62f1a','#8e1306')+lg(p+'w','#fffdf0','#f1dfae')+lg(p+'d','#c68850','#7a4a20',d='h')
    b=(SH+'<rect x="33" y="8" width="6" height="12" fill="#c43a28" stroke="#6e0d00" stroke-width="1.400"/>'
    f'<path d="M9 25L24 12.500 39 25v18.500H9z" fill="url(#{p}w)" stroke="#8a6a30" stroke-width="1.600" stroke-linejoin="round"/>'
    f'<path d="M2.500 24L24 5.500 45.500 24l-3.300 3.800L24 11.500 5.800 27.800z" fill="url(#{p}r)" stroke="#6e0d00" stroke-width="1.600" stroke-linejoin="round"/>'
    f'<rect x="20" y="31" width="8.500" height="12.500" rx="1.200" fill="url(#{p}d)" stroke="#4a2810" stroke-width="1.200"/><circle cx="26" cy="38" r=".9" fill="#ffd23a"/>'
    '<rect x="12" y="29" width="6" height="6" fill="#9fdcff" stroke="#4a5d82" stroke-width="1.100"/><rect x="30.500" y="29" width="6" height="6" fill="#9fdcff" stroke="#4a5d82" stroke-width="1.100"/><path d="M15 29v6M12 32h6M33.500 29v6M30.500 32h6" stroke="#4a5d82" stroke-width=".7"/>')
    return d,b

@icon('moon')
def _(p):
    d=lg(p+'a','#fff7b0','#ffd22e','#d99000',d='d')
    b=SH+f'<path d="M29 4.500C17 5.500 8 15 9 27c1 10.500 10.500 18 21.500 16 4.500-.8 8-3 10.500-6C31 38.500 22 33 20.500 23 19.500 15.500 23 8 29 4.500z" fill="url(#{p}a)" stroke="#8a5200" stroke-width="1.700" stroke-linejoin="round"/><path d="M15 17c1.500-4 4.500-7 8-9" fill="none" stroke="#fff" opacity=".7" stroke-width="2.200" stroke-linecap="round"/>'
    b+=f'<path d="{star(38,13,4.500,1.200,4)}" fill="#fff6c0" stroke="#d99000" stroke-width=".7"/><path d="{star(41,25,3,.8,4)}" fill="#fff6c0" stroke="#d99000" stroke-width=".6"/>'
    return d,b

@icon('sun')
def _(p):
    d=rg(p+'a','#fffbc0','#ffd22e','#f08a00',cx=.38,cy=.32,r=.8)
    b=SH
    for k in range(8):
        b+=f'<rect x="22" y="2.500" width="4" height="8" rx="2" fill="#ffb41e" stroke="#c46a00" stroke-width="1" transform="rotate({k*45} 24 24)"/>'
    b+=f'<circle cx="24" cy="24" r="12" fill="url(#{p}a)" stroke="#c46a00" stroke-width="1.700"/><ellipse cx="19.500" cy="18.500" rx="4.500" ry="2.600" transform="rotate(-35 19.500 18.500)" fill="#fff" opacity=".7"/>'
    return d,b

@icon('more')
def _(p):
    d=rg(p+'a','#ffffff','#c7d6f5','#7e98d4',cx=.35,cy=.3,r=.8)
    b=''.join(f'<circle cx="{x}" cy="24" r="6.400" fill="url(#{p}a)" stroke="#3d5598" stroke-width="1.600"/><ellipse cx="{x-1.600}" cy="21.500" rx="2.500" ry="1.500" fill="#fff" opacity=".8"/>' for x in(9,24,39))
    return d,b

@icon('sheep')
def _(p):
    d=lg(p+'a','#ffffff','#f1ebff','#d6caf5')+lg(p+'f','#ffe6cf','#ffc8a2')
    cs=[(12.500,25,7.500),(18,14.500,7.500),(30,14.500,7.500),(35.500,25,7.500),(31,34,7.500),(17,34,7.500),(24,23,11)]
    b=SH+'<g fill="#7d6bb0" stroke="#7d6bb0" stroke-width="3.400">'+''.join(f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x,y,r in cs)+'</g>'
    b+=f'<g fill="url(#{p}a)">'+''.join(f'<circle cx="{x}" cy="{y}" r="{r}"/>' for x,y,r in cs)+'</g>'
    b+=(f'<ellipse cx="11.500" cy="30" rx="4.200" ry="2.200" transform="rotate(-28 11.500 30)" fill="url(#{p}f)" stroke="#8a5a4a" stroke-width="1.100"/><ellipse cx="36.500" cy="30" rx="4.200" ry="2.200" transform="rotate(28 36.500 30)" fill="url(#{p}f)" stroke="#8a5a4a" stroke-width="1.100"/>'
    f'<path d="M24 20.500c6.500 0 9.500 4.500 9 10.500-.5 6-4.500 9.500-9 9.500s-8.500-3.500-9-9.500c-.5-6 2.500-10.500 9-10.500z" fill="url(#{p}f)" stroke="#8a5a4a" stroke-width="1.400"/>'
    '<g fill="#fff" stroke="#7d6bb0" stroke-width="1"><circle cx="19.500" cy="19.500" r="4.200"/><circle cx="24.500" cy="17.800" r="4.600"/><circle cx="29.500" cy="19.500" r="4.200"/></g><g fill="#fff"><circle cx="19.500" cy="19.500" r="3.600"/><circle cx="24.500" cy="17.800" r="4"/><circle cx="29.500" cy="19.500" r="3.600"/></g>'
    '<ellipse cx="20" cy="29.500" rx="1.400" ry="1.900" fill="#2b1a5e"/><ellipse cx="28" cy="29.500" rx="1.400" ry="1.900" fill="#2b1a5e"/><circle cx="20.500" cy="28.700" r=".5" fill="#fff"/><circle cx="28.500" cy="28.700" r=".5" fill="#fff"/>'
    '<ellipse cx="16.500" cy="33.500" rx="2.200" ry="1.300" fill="#ff8fb4" opacity=".6"/><ellipse cx="31.500" cy="33.500" rx="2.200" ry="1.300" fill="#ff8fb4" opacity=".6"/><path d="M22 34.600q2 1.800 4 0" fill="none" stroke="#8a4a3a" stroke-width="1.200" stroke-linecap="round"/>')
    return d,b

@icon('folder')
def _(p):
    d=lg(p+'a','#f6c445','#d89a10')+lg(p+'b','#fff4b0','#ffd652','#eeb01e')+gl(p+'w',.75,0)
    b=(SH+f'<path d="M3.500 12a3 3 0 0 1 3-3h10.500l4 4.200h20.500a3 3 0 0 1 3 3V39a3 3 0 0 1-3 3h-35a3 3 0 0 1-3-3z" fill="url(#{p}a)" stroke="#8a5a00" stroke-width="1.600" stroke-linejoin="round"/>'
    f'<path d="M3.500 21.500a3 3 0 0 1 3-3h35a3 3 0 0 1 3 3V40a3 3 0 0 1-3 3h-35a3 3 0 0 1-3-3z" fill="url(#{p}b)" stroke="#a87400" stroke-width="1.600" stroke-linejoin="round"/>'
    f'<path d="M6.500 19.500h35a2 2 0 0 1 2 2v6c-12-3-27-3-39 0v-6a2 2 0 0 1 2-2z" fill="url(#{p}w)" opacity=".8"/>')
    return d,b

@icon('download')
def _(p):
    d=lg(p+'a','#c4f79a','#3fc21f','#1a850c',d='h')+lg(p+'t','#f4f7fc','#aab6cc','#6c7a98')
    b=(SH+f'<path d="M5.500 30v9a3.500 3.500 0 0 0 3.500 3.500h30a3.500 3.500 0 0 0 3.500-3.500v-9z" fill="url(#{p}t)" stroke="#3f4e73" stroke-width="1.600" stroke-linejoin="round"/><rect x="9" y="35" width="30" height="3.500" rx="1.700" fill="#3f4e73"/>'
    f'<path d="M17.500 4.500h13v13h7.500L24 33 10 17.500h7.500z" fill="url(#{p}a)" stroke="#0f5f08" stroke-width="1.700" stroke-linejoin="round"/><path d="M19 6.500v13.500h-5.500" fill="none" stroke="#fff" opacity=".6" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round"/>')
    return d,b

def disc(c1,c2,c3,edge,mark):
    def f(p):
        d=rg(p+'a',c1,c2,c3,cx=.35,cy=.28,r=.85)
        b=SH+f'<circle cx="24" cy="23.500" r="20" fill="url(#{p}a)" stroke="{edge}" stroke-width="1.800"/><path d="M9.500 17a15.500 15.500 0 0 1 29 0c-8-3.500-21-3.500-29 0z" fill="#fff" opacity=".45"/>'+mark
        return d,b
    return f
I['info']=disc('#bfe3ff','#3a8cf0','#0a3fa8','#082e85','<circle cx="24" cy="14" r="3" fill="#fff"/><path d="M20.500 20.500h5.500v13h2v2.500H20.500v-2.500h2v-10.500h-2z" fill="#fff"/>')
I['error']=disc('#ffc0b0','#ee4a2a','#a31405','#7a0d00','<path d="M16 15.500l16 16M32 15.500l-16 16" stroke="#fff" stroke-width="6" stroke-linecap="round"/>')
I['check']=disc('#d2ffb8','#46c622','#12780a','#0b5a06','<path d="M13.500 24.500l7.500 7.500 13.500-15" fill="none" stroke="#fff" stroke-width="6.400" stroke-linecap="round" stroke-linejoin="round"/>')
I['question']=disc('#bfe3ff','#3a8cf0','#0a3fa8','#082e85','<path d="M17.500 18.500a6.500 6.500 0 1 1 10 5.400c-2.300 1.500-3.500 2.500-3.500 5" fill="none" stroke="#fff" stroke-width="5.200" stroke-linecap="round"/><circle cx="24" cy="36.500" r="3.200" fill="#fff"/>')
@icon('warning')
def _(p):
    d=lg(p+'a','#fffbb0','#ffd400','#e39a00')
    b=SH+f'<path d="M24 4.500L45 40.500q1.200 3-2 3H5q-3.200 0-2-3z" fill="url(#{p}a)" stroke="#8a6400" stroke-width="1.900" stroke-linejoin="round"/><path d="M24 8.500l-14 24c8-3.500 20-3.500 28 0z" fill="#fff" opacity=".35"/><rect x="21.600" y="16" width="4.800" height="15" rx="2.400" fill="#3b2a00"/><circle cx="24" cy="36.500" r="2.800" fill="#3b2a00"/>'
    return d,b

@icon('lobo')
def _(p):
    d=lg(p+'a','#d5dae6','#8a93a8','#5b647a')+lg(p+'m','#ffffff','#dfe4ee')
    h='M5 4.500L18 13c4-1.200 8-1.200 12 0L43 4.500 42.500 27 34 41.500 24 44.500 14 41.500 5.500 27z'
    b=(SH+f'<path d="{h}" fill="url(#{p}a)" stroke="#2b3248" stroke-width="1.800" stroke-linejoin="round"/><path d="M8.500 9.500l8 5.500-7 8zM39.500 9.500l-8 5.500 7 8z" fill="#ff9fb4" opacity=".75"/>'
    f'<path d="M24 24c7 0 11 4 10.500 9S28 41.500 24 41.500 13.500 38 13.500 33 17 24 24 24z" fill="url(#{p}m)" stroke="#5b647a" stroke-width="1.200"/><ellipse cx="24" cy="26.500" rx="3.800" ry="2.600" fill="#161a2a"/><path d="M24 29v4.500M20 36c2.500 1.700 5.500 1.700 8 0" fill="none" stroke="#2b3248" stroke-width="1.300" stroke-linecap="round"/>'
    '<path d="M11 21.500l9 2.600-2 4z" fill="#ffd23a" stroke="#2b3248" stroke-width="1.100" stroke-linejoin="round"/><path d="M37 21.500l-9 2.600 2 4z" fill="#ffd23a" stroke="#2b3248" stroke-width="1.100" stroke-linejoin="round"/><circle cx="17.800" cy="25.200" r="1.200" fill="#161a2a"/><circle cx="30.200" cy="25.200" r="1.200" fill="#161a2a"/>')
    return d,b

@icon('bandera')
def _(p):
    d=lg(p+'a','#ff9a88','#e53a22','#a31405')
    b=SH+f'<rect x="13" y="5" width="3.400" height="37" rx="1.700" fill="#8a6a3a" stroke="#4a3010" stroke-width="1.100"/><path d="M16 6.500c8-3 14 3 24-.5v16c-10 3.500-16-2.500-24 .5z" fill="url(#{p}a)" stroke="#6e0d00" stroke-width="1.600" stroke-linejoin="round"/><path d="M18 9c6-1.500 11 1.500 17 1" fill="none" stroke="#fff" opacity=".55" stroke-width="1.800" stroke-linecap="round"/><ellipse cx="14.700" cy="42" rx="8" ry="2.600" fill="#5a3a18" stroke="#3a2008" stroke-width="1"/>'
    return d,b

@icon('cartas')
def _(p):
    d=lg(p+'a','#ffffff','#eef1f8')+lg(p+'b','#7fb6ff','#2a64d6','#173c9a',d='d')
    hrt='M24 31c-6-4-8-7-8-10a4.200 4.200 0 0 1 8-1.800A4.200 4.200 0 0 1 32 21c0 3-2 6-8 10z'
    b=(SH+f'<g transform="rotate(-13 24 26)"><rect x="9" y="6" width="23" height="33" rx="3" fill="url(#{p}b)" stroke="#102a70" stroke-width="1.500"/><rect x="12" y="9" width="17" height="27" rx="1.500" fill="none" stroke="#cfe3ff" stroke-width="1.200"/><path d="M20.500 15l5 6-5 6-5-6z" fill="#cfe3ff" opacity=".8"/></g>'
    f'<g transform="rotate(11 24 26)"><rect x="15" y="8" width="23" height="33" rx="3" fill="url(#{p}a)" stroke="#6b7c9e" stroke-width="1.500"/><path transform="translate(3.500 6) scale(.9)" d="{hrt}" fill="#e53a22" stroke="#a31405" stroke-width="1"/><text x="18.500" y="16.500" font-family="Georgia,serif" font-weight="700" font-size="8" fill="#e53a22">A</text></g>')
    return d,b

@icon('trofeo')
def _(p):
    d=lg(p+'a','#fff7b0','#ffd23a','#e09a10','#b36600',d='h')
    b=(SH+f'<path d="M12.500 9H6c-.500 9 3 13.500 8.500 14.500M35.500 9H42c.5 9-3 13.500-8.500 14.500" fill="none" stroke="#8a4b00" stroke-width="5"/><path d="M12.500 9H6c-.5 9 3 13.500 8.500 14.500M35.500 9H42c.5 9-3 13.500-8.500 14.500" fill="none" stroke="url(#{p}a)" stroke-width="2.600"/>'
    f'<path d="M11.500 5.500h25v13c0 7.500-5.500 12.500-12.500 12.500S11.500 26 11.500 18.500z" fill="url(#{p}a)" stroke="#8a4b00" stroke-width="1.700" stroke-linejoin="round"/>'
    f'<rect x="20.500" y="30" width="7" height="7" fill="url(#{p}a)" stroke="#8a4b00" stroke-width="1.400"/><rect x="13.500" y="36.500" width="21" height="7" rx="2" fill="url(#{p}a)" stroke="#8a4b00" stroke-width="1.600"/>'
    f'<path d="M15.500 9v9c0 4 1.500 7 4.500 9" fill="none" stroke="#fff" opacity=".7" stroke-width="2.200" stroke-linecap="round"/><path d="{star(24,16.500,5,2.200)}" fill="#fff" opacity=".85"/>')
    return d,b

ORDER=['tiendas','importante','control','utilidad','pantalla','privacidad','fotos','internet','dia','emulacion','decoracion','musica','teclados','favs','news','packs','search','home','moon','sun','more','sheep','folder','download','info','check','question','warning','error','lobo','bandera','cartas','trofeo']
def svg(name,size=48):
    d,b=I[name]('i'+name[:3])
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 48 48"><defs>{d}</defs>{b}</svg>'
