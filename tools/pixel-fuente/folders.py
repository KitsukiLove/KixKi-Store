"""Carpetas pixel 16x14 con símbolo de cada categoría. Uso: python3 folders.py  -> imprime el bloque JS «ICF» para app.js
Letras: k contorno · h color · l luz · s sombra · w crema · y amarillo · p rosa · m menta"""
import json
W,H=16,14
def base():
    g=[["."]*W for _ in range(H)]
    def put(x,y,c): g[y][x]=c
    for x in range(1,7): put(x,0,"k")
    put(0,1,"k"); put(7,1,"k")
    for x in range(1,7): put(x,1,"l")
    put(0,2,"k")
    for x in range(1,8): put(x,2,"h")
    for x in range(8,15): put(x,2,"k")
    put(8,1,"."); 
    put(7,2,"h")
    put(8,2,"k")
    # cuerpo
    put(0,3,"k"); put(15,3,"k")
    for x in range(1,15): put(x,3,"l")
    for y in range(4,13):
        put(0,y,"k"); put(15,y,"k"); put(1,y,"l")
        for x in range(2,14): put(x,y,"h")
        put(14,y,"s")
    for x in range(1,15): put(x,12,"s")
    for x in range(1,15): put(x,13,"k")
    # esquinas redondeadas abajo
    put(0,12,"k"); put(15,12,"k")
    return g
E_={
"tiendas":["..wwww..",".ww..ww.","wwwwwwww","wwwppwww","wwwwwwww","wwwwwwww","wwwwwwww"],
"importante":["...ww...","...ww...","...ww...","...ww...","........","...ww...","...ww..."],
"utilidad":["...ww...",".w.ww.w.","..wwww..","wwwkkwww","..wwww..",".w.ww.w.","...ww..."],
"privacidad":["..wwww..",".w....w.",".w....w.","wwwwwwww","wwwkkwww","wwwkkwww","wwwwwwww"],
"emulacion":[".wwwwww.","wwwwwwww","wwkwwkww","wkkkwwkw","wwkwwkww","wwwwwwww",".ww..ww."],
"decoracion":["..wwww..",".wwwwwww","wwypwwww","wwwwwmww","wwkwwwww",".wwwwww.","..ww...."],
"musica":["...wwwww","...w...w","...w...w","...w...w",".www.www",".www.www","........"],
"teclados":["wwwwwwww","wkwkwkwk","wwwwwwww","wkwkwkwk","wwwwwwww","wkkkkkkw","wwwwwwww"],
"control":["..kk....","wwkkwwww","..kk....","........","....kk..","wwwwkkww","....kk.."],
"pantalla":["wwwwwwww","wkkkkkkw","wkkykkkw","wkkkkkkw","wwwwwwww","...ww...","..wwww.."],
"fotos":["wwwwwwww","wkkkkykw","wkkkkkkw","wkkmkkkw","wkmmmkmw","wmmmmmmw","wwwwwwww"],
"internet":["..wwww..",".wwkwww.","wwwkwwww","wkkkkkkw","wwwkwwww",".wwkwww.","..wwww.."],
"dia":[".w....w.","pppppppp","wwwwwwww","wkwkwkww","wwwwwwww","wkwkwkwk","wwwwwwww"],
"favs":["...pp...","...pp...","pppppppp",".pppppp.","..pppp..",".pp..pp.",".p....p."],
"news":["...ww...","...ww...",".wwwwww.","wwwwwwww",".wwwwww.","...ww...","...ww..."],
"mensajeria":[".wwwwww.","wwwwwwww","wkwkwkww","wwwwwwww",".wwwwww.","..ww....",".w......"],
"sistemas":["..wwww..",".wwwwww.","wwwhhwww","wwwhhwww",".wwwwww.","..wwww..","........"],
"packs":[".pp..pp.","..pppp..","wwwppwww",".wwppww.",".wwppww.",".wwppww.",".wwppww."],
}
def build(id):
    g=base(); e=E_[id]; ox,oy=4,5
    # sombra (sólo bajo las letras principales)
    for y,r in enumerate(e):
        for x,c in enumerate(r):
            if c in "wypm":
                X,Y=ox+x+1,oy+y+1
                if Y<12 and X<14 and g[Y][X]=="h": g[Y][X]="s"
    for y,r in enumerate(e):
        for x,c in enumerate(r):
            if c!=".": g[oy+y][ox+x]=c
    return ["".join(r) for r in g]
if __name__=="__main__":
    out={i:build(i) for i in E_}
    print("const ICF={")
    for i,r in out.items(): print(f"  {i}:"+json.dumps(r,separators=(',',':'))+",")
    print("};")
