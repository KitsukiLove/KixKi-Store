/* Motor 3D mínimo en WebGL (sin dependencias). Cajas con luz de punto, textura de "texels"
   procedural, tramado ordenado (dither) y partículas con runas. Todo local. */
(function () {
  'use strict';

  /* ---------- matrices (column-major) ---------- */
  const mat = {
    id() { return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); },
    mul(a, b) {
      const o = new Float32Array(16);
      for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
        let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s;
      }
      return o;
    },
    T(x, y, z) { const m = mat.id(); m[12] = x; m[13] = y; m[14] = z; return m; },
    RX(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); },
    RY(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); },
    RZ(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); },
    persp(fov, asp, n, f) {
      const t = 1 / Math.tan(fov / 2), m = new Float32Array(16);
      m[0] = t / asp; m[5] = t; m[10] = (f + n) / (n - f); m[11] = -1; m[14] = 2 * f * n / (n - f); return m;
    },
    look(e, c, u) {
      let zx = e[0] - c[0], zy = e[1] - c[1], zz = e[2] - c[2], l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
      let xx = u[1] * zz - u[2] * zy, xy = u[2] * zx - u[0] * zz, xz = u[0] * zy - u[1] * zx; l = Math.hypot(xx, xy, xz); xx /= l; xy /= l; xz /= l;
      const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
      return new Float32Array([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
        -(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1]);
    }
  };

  /* ---------- shaders ---------- */
  const VS_MESH = `
attribute vec3 a_pos; attribute vec3 a_nrm; attribute vec3 a_col; attribute vec3 a_emi; attribute vec2 a_misc;
uniform mat4 u_vp; uniform mat4 u_model; uniform vec3 u_size;
varying vec3 v_wp; varying vec3 v_n; varying vec3 v_col; varying vec3 v_emi; varying vec2 v_misc;
void main(){
  vec4 wp = u_model * vec4(a_pos * u_size, 1.0);
  v_wp = wp.xyz; v_n = mat3(u_model) * a_nrm; v_col = a_col; v_emi = a_emi; v_misc = a_misc;
  gl_Position = u_vp * wp;
}`;
  const FS_MESH = `
precision mediump float;
varying vec3 v_wp; varying vec3 v_n; varying vec3 v_col; varying vec3 v_emi; varying vec2 v_misc;
uniform vec3 u_cam; uniform vec3 u_amb; uniform vec3 u_fog; uniform float u_fogd; uniform float u_time;
uniform vec3 u_lp[4]; uniform vec3 u_lc[4]; uniform vec3 u_moonD; uniform vec3 u_moonC;
float hash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float bayer(vec2 p){
  vec2 q = mod(floor(p), 4.0);
  float a = mod(q.x, 2.0), b = mod(q.y, 2.0), c = floor(q.x / 2.0), d = floor(q.y / 2.0);
  return (8.0 * abs(a - b) + 4.0 * b + 2.0 * abs(c - d) + d) / 16.0;
}
void main(){
  vec3 n = normalize(v_n);
  vec3 col = v_col;
  float nz = hash(floor(v_wp * 6.0 - n * 0.02));
  col *= 1.0 - v_misc.x * 0.2 + v_misc.x * 0.4 * nz;
  if (v_misc.y > 0.5 && n.y > 0.5) {
    vec2 g = fract(v_wp.xz * 0.5);
    float line = step(g.x, 0.04) + step(g.y, 0.04);
    float chk = mod(floor(v_wp.x * 0.5) + floor(v_wp.z * 0.5), 2.0);
    col *= (1.0 - 0.35 * min(line, 1.0)) * (0.92 + 0.12 * chk);
  }
  vec3 light = u_amb;
  for (int i = 0; i < 4; i++) {
    vec3 d = u_lp[i] - v_wp; float dist = length(d); vec3 L = d / dist;
    float att = 1.0 / (1.0 + 0.09 * dist * dist);
    light += u_lc[i] * max(dot(n, L), 0.0) * att;
  }
  light += u_moonC * max(dot(n, u_moonD), 0.0);
  float bd = bayer(gl_FragCoord.xy) - 0.5;
  vec3 lit = floor(light * 6.0 + bd + 0.5) / 6.0;
  vec3 c = col * lit + v_emi;
  float fd = length(u_cam - v_wp);
  float f = 1.0 - exp(-fd * u_fogd);
  gl_FragColor = vec4(mix(c, u_fog, clamp(f, 0.0, 1.0)), 1.0);
}`;
  const VS_PART = `
attribute vec3 a_pos; attribute vec4 a_data;
uniform mat4 u_vp; uniform float u_scale;
varying float v_glyph; varying float v_alpha; varying float v_seed;
void main(){
  vec4 p = u_vp * vec4(a_pos, 1.0);
  gl_Position = p;
  gl_PointSize = max(2.0, a_data.x * u_scale / max(p.w, 0.1));
  v_glyph = a_data.y; v_alpha = a_data.z; v_seed = a_data.w;
}`;
  const FS_PART = `
precision mediump float;
varying float v_glyph; varying float v_alpha; varying float v_seed;
uniform sampler2D u_atlas; uniform vec3 u_tint;
void main(){
  vec2 uv = vec2((v_glyph + gl_PointCoord.x) / 8.0, gl_PointCoord.y);
  float a = texture2D(u_atlas, uv).a;
  if (a < 0.5) discard;
  vec3 c = mix(u_tint, vec3(1.0), v_seed * 0.12);
  gl_FragColor = vec4(c * v_alpha, 1.0);
}`;

  /* ---------- runas (atlas 8 glifos de 8x8) ---------- */
  const RUNES = [
    ['0010000', '0111100', '0010010', '0111100', '0010010', '0010000', '0010000'],
    ['0100010', '0100100', '0111000', '0100100', '0100010', '0100001', '0000000'],
    ['0011100', '0100010', '0000100', '0011000', '0000100', '0100010', '0011100'],
    ['0001000', '0011100', '0101010', '0001000', '0101010', '0011100', '0001000'],
    ['0111110', '0000010', '0000100', '0011000', '0000100', '0000010', '0111110'],
    ['0100000', '0110000', '0101000', '0100100', '0100010', '0100001', '0111111'],
    ['0010100', '0010100', '0111110', '0010100', '0010100', '0111110', '0010100'],
    ['0001000', '0001000', '0111110', '0001000', '0001000', '0000000', '0000000']
  ];
  function makeAtlas(gl) {
    const cv = document.createElement('canvas'); cv.width = 64; cv.height = 8;
    const x = cv.getContext('2d'); x.fillStyle = '#fff';
    RUNES.forEach((g, i) => g.forEach((row, y) => [...row].forEach((ch, xx) => { if (ch === '1') x.fillRect(i * 8 + xx, y, 1, 1); })));
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  function compile(gl, vs, fs) {
    const mk = (t, s) => {
      const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      return sh;
    };
    const p = gl.createProgram();
    gl.attachShader(p, mk(gl.VERTEX_SHADER, vs)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }

  /* ---------- cubo unitario: 24 vértices (pos+normal) ---------- */
  const FACES = [
    [[0, 0, 1], [[-.5, -.5, .5], [.5, -.5, .5], [.5, .5, .5], [-.5, .5, .5]]],
    [[0, 0, -1], [[.5, -.5, -.5], [-.5, -.5, -.5], [-.5, .5, -.5], [.5, .5, -.5]]],
    [[1, 0, 0], [[.5, -.5, .5], [.5, -.5, -.5], [.5, .5, -.5], [.5, .5, .5]]],
    [[-1, 0, 0], [[-.5, -.5, -.5], [-.5, -.5, .5], [-.5, .5, .5], [-.5, .5, -.5]]],
    [[0, 1, 0], [[-.5, .5, .5], [.5, .5, .5], [.5, .5, -.5], [-.5, .5, -.5]]],
    [[0, -1, 0], [[-.5, -.5, -.5], [.5, -.5, -.5], [.5, -.5, .5], [-.5, -.5, .5]]]
  ];
  const CUBE_IDX = []; for (let f = 0; f < 6; f++) { const o = f * 4; CUBE_IDX.push(o, o + 1, o + 2, o, o + 2, o + 3); }

  class Engine {
    constructor(canvas) {
      const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
      if (!gl) throw new Error('WebGL no disponible');
      this.gl = gl; this.canvas = canvas;
      this.pMesh = compile(gl, VS_MESH, FS_MESH);
      this.pPart = compile(gl, VS_PART, FS_PART);
      const L = (p, n) => gl.getUniformLocation(p, n), A = (p, n) => gl.getAttribLocation(p, n);
      const m = this.pMesh;
      this.u = {
        vp: L(m, 'u_vp'), model: L(m, 'u_model'), size: L(m, 'u_size'), cam: L(m, 'u_cam'), amb: L(m, 'u_amb'),
        fog: L(m, 'u_fog'), fogd: L(m, 'u_fogd'), time: L(m, 'u_time'), lp: L(m, 'u_lp[0]'), lc: L(m, 'u_lc[0]'),
        moonD: L(m, 'u_moonD'), moonC: L(m, 'u_moonC')
      };
      this.a = { pos: A(m, 'a_pos'), nrm: A(m, 'a_nrm'), col: A(m, 'a_col'), emi: A(m, 'a_emi'), misc: A(m, 'a_misc') };
      const pp = this.pPart;
      this.up = { vp: L(pp, 'u_vp'), scale: L(pp, 'u_scale'), atlas: L(pp, 'u_atlas'), tint: L(pp, 'u_tint') };
      this.ap = { pos: A(pp, 'a_pos'), data: A(pp, 'a_data') };
      this.atlas = makeAtlas(gl);
      // cubo
      const v = []; FACES.forEach(([n, q]) => q.forEach(p => v.push(...p, ...n)));
      this.cubeVB = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVB); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
      this.cubeIB = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeIB); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(CUBE_IDX), gl.STATIC_DRAW);
      this.partVB = gl.createBuffer();
      this.staticVB = null; this.staticIB = null; this.staticN = 0;
      this.lightsP = new Float32Array(12); this.lightsC = new Float32Array(12);
      this.vp = mat.id(); this.cam = [0, 5, 9];
      this.amb = [0.3, 0.25, 0.5]; this.fog = [0.08, 0.05, 0.2]; this.fogd = 0.02;
      this.moonD = [0, 0.5, 0.8]; this.moonC = [0.15, 0.15, 0.3];
      this.tint = [1, 0.85, 0.5]; this.time = 0; this.pscale = 40;
      this._part = new Float32Array(7 * 400);
    }

    /* Lote estático: lista de {c:[x,y,z], s:[sx,sy,sz], col:[r,g,b], emi:[r,g,b], noise, grid} */
    setStatic(boxes) {
      const gl = this.gl, F = 14, vs = new Float32Array(boxes.length * 24 * F), ix = new Uint16Array(boxes.length * 36);
      boxes.forEach((b, i) => {
        FACES.forEach(([n, q], f) => q.forEach((p, k) => {
          const o = (i * 24 + f * 4 + k) * F;
          vs[o] = p[0] * b.s[0] + b.c[0]; vs[o + 1] = p[1] * b.s[1] + b.c[1]; vs[o + 2] = p[2] * b.s[2] + b.c[2];
          vs[o + 3] = n[0]; vs[o + 4] = n[1]; vs[o + 5] = n[2];
          vs[o + 6] = b.col[0]; vs[o + 7] = b.col[1]; vs[o + 8] = b.col[2];
          const e = b.emi || [0, 0, 0]; vs[o + 9] = e[0]; vs[o + 10] = e[1]; vs[o + 11] = e[2];
          vs[o + 12] = b.noise == null ? 1 : b.noise; vs[o + 13] = b.grid ? 1 : 0;
        }));
        CUBE_IDX.forEach((v, k) => { ix[i * 36 + k] = i * 24 + v; });
      });
      this.staticVB = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.staticVB); gl.bufferData(gl.ARRAY_BUFFER, vs, gl.STATIC_DRAW);
      this.staticIB = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.staticIB); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, ix, gl.STATIC_DRAW);
      this.staticN = boxes.length * 36;
    }

    resize(cssW, cssH, px) {
      const w = Math.max(64, Math.round(cssW / px)), h = Math.max(64, Math.round(cssH / px));
      if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
      this.gl.viewport(0, 0, w, h); this.px = px;
    }

    begin(eye, ctr, fov, vshift, hshift) {
      const gl = this.gl, c = this.canvas;
      const P = mat.persp(fov * Math.PI / 180, c.width / c.height, 0.1, 80); P[9] = -(vshift || 0); P[8] = (hshift || 0);
      this.vp = mat.mul(P, mat.look(eye, ctr, [0, 1, 0])); this.cam = eye;
      gl.enable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.depthMask(true);
      gl.clearColor(this.fog[0], this.fog[1], this.fog[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(this.pMesh);
      const u = this.u;
      gl.uniformMatrix4fv(u.vp, false, this.vp); gl.uniform3fv(u.cam, eye); gl.uniform3fv(u.amb, this.amb);
      gl.uniform3fv(u.fog, this.fog); gl.uniform1f(u.fogd, this.fogd); gl.uniform1f(u.time, this.time);
      gl.uniform3fv(u.lp, this.lightsP); gl.uniform3fv(u.lc, this.lightsC);
      gl.uniform3fv(u.moonD, this.moonD); gl.uniform3fv(u.moonC, this.moonC);
    }

    setLight(i, pos, col) { this.lightsP.set(pos, i * 3); this.lightsC.set(col, i * 3); }

    drawStatic() {
      if (!this.staticN) return;
      const gl = this.gl, a = this.a, F = 14 * 4;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.staticVB); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.staticIB);
      [['pos', 3, 0], ['nrm', 3, 12], ['col', 3, 24], ['emi', 3, 36], ['misc', 2, 48]].forEach(([k, n, off]) => {
        gl.enableVertexAttribArray(a[k]); gl.vertexAttribPointer(a[k], n, gl.FLOAT, false, F, off);
      });
      gl.uniformMatrix4fv(this.u.model, false, mat.id()); gl.uniform3f(this.u.size, 1, 1, 1);
      gl.drawElements(gl.TRIANGLES, this.staticN, gl.UNSIGNED_SHORT, 0);
      this._dyn = false;
    }

    /* Caja dinámica: model = traslación+rotación (sin escala); size = tamaño. */
    box(model, size, col, emi, noise) {
      const gl = this.gl, a = this.a;
      if (!this._dyn) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVB); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeIB);
        gl.enableVertexAttribArray(a.pos); gl.vertexAttribPointer(a.pos, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(a.nrm); gl.vertexAttribPointer(a.nrm, 3, gl.FLOAT, false, 24, 12);
        gl.disableVertexAttribArray(a.col); gl.disableVertexAttribArray(a.emi); gl.disableVertexAttribArray(a.misc);
        this._dyn = true;
      }
      gl.vertexAttrib3f(a.col, col[0], col[1], col[2]);
      gl.vertexAttrib3f(a.emi, emi ? emi[0] : 0, emi ? emi[1] : 0, emi ? emi[2] : 0);
      gl.vertexAttrib2f(a.misc, noise == null ? 1 : noise, 0);
      gl.uniformMatrix4fv(this.u.model, false, model); gl.uniform3f(this.u.size, size[0], size[1], size[2]);
      gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    }

    /* Partículas: arr de {x,y,z,size,glyph,alpha,seed} */
    particles(list) {
      if (!list.length) return;
      const gl = this.gl, n = Math.min(list.length, 400), d = this._part;
      for (let i = 0; i < n; i++) {
        const p = list[i], o = i * 7;
        d[o] = p.x; d[o + 1] = p.y; d[o + 2] = p.z; d[o + 3] = p.size; d[o + 4] = p.glyph; d[o + 5] = p.alpha; d[o + 6] = p.seed;
      }
      gl.useProgram(this.pPart);
      gl.disable(gl.CULL_FACE); gl.depthMask(false); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.partVB); gl.bufferData(gl.ARRAY_BUFFER, d.subarray(0, n * 7), gl.DYNAMIC_DRAW);
      gl.disableVertexAttribArray(this.a.col); gl.disableVertexAttribArray(this.a.emi); gl.disableVertexAttribArray(this.a.misc);
      gl.disableVertexAttribArray(this.a.nrm);
      gl.enableVertexAttribArray(this.ap.pos); gl.vertexAttribPointer(this.ap.pos, 3, gl.FLOAT, false, 28, 0);
      gl.enableVertexAttribArray(this.ap.data); gl.vertexAttribPointer(this.ap.data, 4, gl.FLOAT, false, 28, 12);
      gl.uniformMatrix4fv(this.up.vp, false, this.vp);
      gl.uniform1f(this.up.scale, this.pscale * (this.canvas.height / 270));
      gl.uniform3fv(this.up.tint, this.tint);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.atlas); gl.uniform1i(this.up.atlas, 0);
      gl.drawArrays(gl.POINTS, 0, n);
      gl.disableVertexAttribArray(this.ap.pos); gl.disableVertexAttribArray(this.ap.data);
      gl.depthMask(true); gl.disable(gl.BLEND); this._dyn = false;
    }
  }

  window.MesaEngine = { Engine, mat };
})();
