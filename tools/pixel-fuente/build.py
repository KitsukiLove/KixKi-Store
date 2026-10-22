"""Une pixel-ui.main.css + los iconos y escribe ../../pixel-ui.css  (uso: python3 build.py)"""
import subprocess, os
here = os.path.dirname(os.path.abspath(__file__))
main = open(os.path.join(here, "pixel-ui.main.css"), encoding="utf-8").read().replace("@P", 'html:not([data-style="xp"])')
icons = subprocess.run(["python3", os.path.join(here, "pixelicons.py")], capture_output=True, text=True, check=True).stdout
icons = icons.replace("\n#", '\nhtml:not([data-style="xp"]) #')
open(os.path.join(here, "..", "..", "pixel-ui.css"), "w", encoding="utf-8").write(main + "\n/* ---------- iconos pixel de cada fila ---------- */\n" + icons)
print("ok")
