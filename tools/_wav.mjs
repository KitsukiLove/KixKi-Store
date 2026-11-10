import {open,sleep} from "./_harness.mjs";import fs from "node:fs";
const lv=parseFloat(process.argv[2]||"1"),sec=+(process.argv[3]||10),th=process.argv[4]==="-"?null:parseFloat(process.argv[4]||"4"),out=process.argv[5]||"/tmp/rain.wav";
const t=await open({});const b64=await t.pg.evaluate(([s,l,th])=>KXRAIN._render(s,l,th),[sec,lv,th]);
fs.writeFileSync(out,Buffer.from(b64,"base64"));console.log("wav",out,Buffer.from(b64,"base64").length,"errs",t.errs);await t.close();
