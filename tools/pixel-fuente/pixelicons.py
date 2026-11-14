"""Iconos pixel 12x12 para el menú Inicio del estilo pixel de Kixki (parte 8).
Genera pixel-icons.css (variables --mi por botón + el avatar de la oveja) a partir de dibujos en texto.
Uso:  python3 pixelicons.py > ../../pixel-icons.part.css
Paleta: k contorno · w blanco · s lila claro · L lila fuerte · p rosa · P rosa fuerte · y amarillo · Y dorado
        g verde · G verde oscuro · b azul · B azul fuerte · o naranja · r rojo · n marrón · f piel oveja"""
import urllib.parse
PAL={"k":"#2a1650","w":"#fffaf0","s":"#cdbdf2","L":"#6b3fe0","p":"#ff8fc7","P":"#d6408a","y":"#ffd23a","Y":"#e0a010","g":"#52c27c","G":"#2a8a52",
     "b":"#5db7f5","B":"#2a6fc4","o":"#ff9a3a","r":"#e8394d","n":"#8a5a2b","f":"#f2a574","e":"#2b1a5e"}
I={}
I["run"]=["kkkkkkkkkkkk","kLLLLLLLLLpk","kwwwwwwwwwwk","kwLwwwwwwwwk","kwwLwwwwwwwk","kwLwwwwwwwwk","kwwwwwwwwwwk","kwwwwLLLwwwk","kwwwwwwwwwwk","kkkkkkkkkkkk"]
I["tip"]=["....kkkk....","...kyyyyk...","..kyywyyyk..","..kywyyyyk..","..kyyyyyyk..","..kyyyyyyk..","...kyyyyk...","....kyyk....","....kssk....","....kssk....",".....kk....."]
I["pet"]=["..kkkkkkkk..",".kwwwwwwwwk.","kwwkkkkkkwwk","kwkffffffkwk","kwkfkffkfkwk","kwkffffffkwk","kwkffppffkwk",".kwkffffkwk.","..kkkkkkkk.."]
I["moon"]=["...kkkk.....","..kyyyyk....",".kyyykkk....",".kyyk.......","kyyyk.......","kyyyk.......","kyyyyk......",".kyyyykk..k.",".kyyyyyykkk.","..kkyyyyyk..","....kkkkk..."]
I["palette"]=["...kkkkkk...",".kkwwwwwwkk.","kwwwwwwwwwwk","kwrrwwyywwwk","kwrrwwyywwwk","kwwwwwwwwwwk","kwbbwwwwwwwk","kwbbwwwkkkwk","kwwwwwkwwwwk",".kkwwwwwkkk.","...kkkkkk..."]
I["image"]=["kkkkkkkkkkkk","kbbbbbbbbbyk","kbbbbbbbbyyk","kbbbbkbbbbbk","kbbbkLkbbbbk","kbbkLLLkbkbk","kgggLLLLkggk","kggggggggggk","kkkkkkkkkkkk"]
I["flower"]=["....kk......","...kppk.kk..",".kkppppkppk.","kppppyyppppk",".kppyyyypk..","..kkppppkk..","...kkGkkk...","....kGk.....","...kGGk.....","....kGk....."]
I["pixel"]=["kkkkkkkkkkkk","kLLLkpppkyyk","kLLLkpppkyyk","kLLLkpppkyyk","kkkkkkkkkkkk","kpppkwwwkggk","kpppkwwwkggk","kpppkwwwkggk","kkkkkkkkkkkk"]
I["monitor"]=["kkkkkkkkkkkk","kbbbbbbbbbbk","kbwwwwwwwwbk","kbwBBBBBBwbk","kbwwwwwwwwbk","kbwgggwwwwbk","kbbbbbbbbbbk","kkkkkkkkkkkk","....kkkk....","...kkkkkk..."]
I["rain"]=["...kkkk.....","..kwwwwkkk..",".kwwwwwwwwk.","kwwwwwwwwwwk","kwwwwwwwwwwk",".kkkkkkkkkk.","..b..b..b...",".b..b..b....","..b..b..b..."]
I["speaker"]=[".....kk.....","....kwk..k..","kkkkwwk...k.","kwwwwwk.k.k.","kwwwwwk.k.k.","kkkkwwk...k.","....kwk..k..",".....kk....."]
I["spark"]=[".....kk.....",".....kyk....","....kyyk....","kkkkkyyykkkk","kyyyyyyyyyyk",".kkkyyykkk..","...kyyyyk...","..kyykkyyk..","..kkk..kkk.."]
I["note"]=["......kkkk..",".....kLLLLk.",".....kLkkLk.",".....kLk.kk.",".....kLk....",".....kLk....","..kkkkLk....",".kLLLkLk....","kLLLLLLk....","kLLLLLk.....",".kkkkk......"]
I["globe"]=["...kkkkkk...","..kbbggbbk..",".kbggggbbbk.","kbbggggbbbbk","kbbbgggbbggk","kbbbbgbbbggk","kbbbbbbbbbgk",".kbbbbbbbbk.","..kbbbbbbk..","...kkkkkk..."]
I["phone"]=["...kkkkkk...","...kwwwwk...","...kbbbbk...","...kbbbbk...","...kbbbbk...","...kbbbbk...","...kbbbbk...","...kwwwwk...","...kwkkwk...","...kkkkkk..."]
I["face"]=["...kkkkkk...","..kyyyyyyk..",".kyyyyyyyyk.","kyykkyykkyyk","kyykkyykkyyk","kyyyyyyyyyyk","kykyyyyyykyk",".kykkkkkkyk.","..kyyyyyyk..","...kkkkkk..."]
I["bolt"]=["......kkk...",".....kyyk...","....kyyk....","...kyyk.....","..kyyyyyk...","..kkkyyk....","....kyk.....","...kyk......","...kk......."]
I["pad"]=["............",".kkkkkkkkkk.","kLLLLLLLLLLk","kLkLLLLLLpLk","kkkkkLLLpLpk","kLkLLLLLLpLk","kLLLLLLLLLLk",".kkLLLLLLkk."]
I["magnify"]=["..kkkk......",".kwwwwk.....","kwbbbwwk....","kwbwwwwk....","kwwwwwwk....",".kwwwwk.....","..kkkkkk....",".....kkkk...","......kkkk..",".......kkk.."]
I["cards"]=[".kkkkkk.....",".kwwwwk.....",".kwrrwkkkkk.",".kwrrwkwwwk.",".kwwwwkwLLk.",".kkkkkkwLLk.","......kwwwk.","......kkkkk."]
I["heart"]=[".kkk..kkk...","kpppkkpppk..","kpwppppppk..","kppppppppk..",".kppppppk...","..kppppk....","...kppk.....","....kk......"]
I["qr"]=["kkkkk..kkkkk","kwwwk..kwwwk","kwkwk..kwkwk","kwwwk..kwwwk","kkkkk..kkkkk",".....k.k....","kkkkk..k.kk.","kwwwk.kk..k.","kwkwk..kkk.k","kwwwk.k.k...","kkkkk......."]
I["down"]=[".....kk.....",".....kbk....",".....kbk....","..kkkkbkkkk.","...kbbbbbk..","....kbbbk...",".....kbk....","kkkkkkkkkkkk","kwwwwwwwwwwk","kkkkkkkkkkkk"]
I["closeall"]=["kkkkkkkk....","kLLLLLLk....","kwwwwwwkkkkk","kwwwwwwkLLLk","kkkkkkkkwwwk","....kwwwwrwk","....kwwwrrwk","....kwwrwwrk","....kkkkkkkk"]
I["power"]=[".....kk.....",".....kk.....","..kk.kk.kk..",".kr..kk..rk.","kr...kk...rk","kr........rk","kr........rk",".kr......rk.","..krrrrrrk..","....kkkk...."]
def svg(rows,w=12,h=12):
    H=len(rows);W=max(len(r) for r in rows)
    ox=(w-W)//2;oy=(h-H)//2;by={}
    for y,r in enumerate(rows):
        x=0
        while x<len(r):
            c=r[x]
            if c in PAL:
                x2=x
                while x2+1<len(r) and r[x2+1]==c:x2+=1
                by.setdefault(c,[]).append(f"M{x+ox} {y+oy}h{x2-x+1}v1h-{x2-x+1}z");x=x2+1
            else:x+=1
    body="".join(f"<path fill='{PAL[c]}' d='{''.join(d)}'/>" for c,d in by.items())
    return f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {w} {h}' shape-rendering='crispEdges'>"+body+"</svg>"
def uri(s):return 'url("data:image/svg+xml,'+s.replace("#","%23").replace("<","%3C").replace(">","%3E")+'")'
# oveja de la cabecera: la misma del juego Salta Vallas (18x9)
BODY=["...wwww.www.wwww..","..wwwwwwwwwwwwwwf.",".wwwwwwwwwwwwwfff.","wwwwwwwwwwwwwfeff.","wwwwwwwwwwwwwffff.","wwwwwwwwwwwwwfppf.","gwwwwwwwwwwww.ff..",".gwwwwwwwwwww.....","..gggggggggg......","...f.f....f.f....."]
SP=dict(PAL);SP.update({"g":"#cdbdf2"})
def sheep():
    rows=[""+r for r in BODY]
    rows=[" "*0+r.replace("g","g") for r in rows]
    return svg(rows,18,10)
MAP={"#s-run":"run","#smt":"moon","#s-acc":"palette","#s-bg":"image","#s-sea":"flower","#s-pix":"pixel","#s-xp":"monitor","#s-rain":"rain","#s-rainsnd":"speaker","#s-snd":"spark","#s-mus":"note",
 "#s-lang":"globe","#s-view":"phone","#s-kx-tip":"tip","#s-kx-pet":"pet","#s-kx-on":"pet","#s-kx-mode":"face","#s-kx-pr":"bolt","#s-game":"pad","#s-xpg1":"magnify","#s-xpg2":"cards",
 "#s-sug":"heart","#s-qr":"qr","#s-inst":"down","#sma":"closeall","#s-off":"power"}
print("/* generado por tools/pixel-fuente/pixelicons.py — no editar a mano */")
print(":root{--pxi-sheep:"+uri(sheep())+"}")
for k,v in MAP.items():print(k+"{--mi:"+uri(svg(I[v]))+"}")
