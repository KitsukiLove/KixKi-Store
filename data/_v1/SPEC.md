# Especificación de contenido — test "¿Qué encantamiento eres?"

Idioma: español latinoamericano neutro (el autor es de México). Tono cálido, juguetón y corto,
estilo KixKi (ovejita Kixki, mundo pixel). Sin groserías.

## Los 14 encantamientos (id → rasgo de personalidad que representan)

| id | Nombre | Rasgo central | Color |
|---|---|---|---|
| reparacion | Reparación | Se recupera, cuida y sana; arregla lo roto (cosas, ánimos, relaciones) | #7ef0c4 |
| irrompibilidad | Irrompibilidad | Constante, terco en el buen sentido, aguanta lo que sea sin rendirse | #9aa5b8 |
| fortuna | Fortuna | Optimista, ve oportunidades, confía en que saldrá bien | #ffd36e |
| toque_seda | Toque de seda | Cuidadoso, delicado, perfeccionista; conserva las cosas tal como son | #e8d8ff |
| eficiencia | Eficiencia | Práctico, rápido, organizado; va directo a lo que funciona | #5ec8ff |
| filo | Filo | Directo, honesto, competitivo; dice lo que piensa y quiere ganar | #ff4d4d |
| proteccion | Protección | Protector, estable, el escudo del grupo; prefiere prevenir | #3f7bff |
| botin | Botín | Curioso, ambicioso, coleccionista; siempre quiere más y explorar | #e0a458 |
| espinas | Espinas | Pone límites firmes, devuelve el golpe si lo cruzan, no se deja | #4caf50 |
| infinidad | Infinidad | Creativo, mil ideas, nunca se queda sin recursos ni proyectos | #b36bff |
| paso_helado | Paso helado | Adaptable, sereno, encuentra camino donde otros ven obstáculo | #8ff0ff |
| aspecto_igneo | Aspecto ígneo | Apasionado, intenso, entusiasta; se enciende y contagia | #ff8a00 |
| lealtad | Lealtad | Amigo fiel, siempre vuelve con su gente, valora los vínculos | #ff8fc7 |
| sigilo | Sigilo veloz | Observador, reservado, se mueve sin hacer ruido, piensa antes de actuar | #6b5bd2 |

## Bloques de preguntas (70 en total, 7 bloques de 10)

1. Social: amigos, grupos, fiestas, conocer gente
2. Estrés y problemas: imprevistos, errores, presión, conflictos
3. Estudio y trabajo: tareas, proyectos, equipo, plazos
4. Creatividad: ideas, arte, programar, diseñar, inventar
5. Emociones y vínculos: cariño, discusiones, apoyo, confianza
6. Tiempo libre y gustos: hobbies, juegos, descanso, planes
7. Valores y decisiones: dilemas, qué te importa, cómo eliges

Aprox. 70 % de las preguntas son de la vida real y 30 % son situaciones dentro de Minecraft
(ej. te quedas sin comida en una cueva, un creeper aparece junto a tu casa). Las de Minecraft
deben medir personalidad, NUNCA conocimiento del juego.

## Reglas para escribir preguntas y respuestas

- Cada pregunta tiene EXACTAMENTE 4 respuestas, en el orden que indica `data/matrix.json`
  (campo `main` de cada opción = el encantamiento al que representa esa respuesta).
- La respuesta debe expresar de forma natural el rasgo central de su encantamiento, SIN nombrarlo
  ni aludir al nombre (nada de "me protejo", "uso espinas", "repararía" si delata el resultado
  de forma obvia; mejor mostrar la conducta).
- Las 4 respuestas deben ser igual de atractivas y de longitud parecida (6–16 palabras). Ninguna
  debe sonar "la correcta" ni "la mala". Nadie debe poder adivinar el resultado deseado.
- Preguntas de 6–20 palabras, con sentido, sin trivia, sin preguntas sin sentido.
- No repetir situaciones entre preguntas. Variar el formato: "¿qué haces si…?", "¿cuál te describe
  mejor?", "tu plan ideal…", "cuando alguien…".
- Primera persona o segunda persona natural; sin emojis.
- NO escribir secundarios ni puntos: el campo `second` de la matriz lo usa el programa.

## Formato de salida de cada bloque (JSON válido, UTF-8)

Archivo: `data/preguntas_bloqueN.json`

```json
{
  "block": 1,
  "theme": "Social",
  "questions": [
    {
      "id": 0,
      "text": "Texto de la pregunta",
      "options": [
        { "enchant": "filo", "text": "Respuesta" },
        { "enchant": "lealtad", "text": "Respuesta" },
        { "enchant": "botin", "text": "Respuesta" },
        { "enchant": "sigilo", "text": "Respuesta" }
      ]
    }
  ]
}
```

`id` es el índice global 0–69 (bloque N cubre ids (N-1)*10 … (N-1)*10+9) y las 4 opciones van en el
mismo orden que `questions[id]` en `data/matrix.json`.

## Formato de resultados

Archivo: `data/resultados.json` — objeto con una clave por id de encantamiento:

```json
{
  "filo": {
    "nombre": "Filo",
    "subtitulo": "Encantamiento de la franqueza",
    "frase": "Frase corta en primera persona, tipo lema (máx. 14 palabras).",
    "descripcion": "3 a 4 oraciones sobre tu personalidad en segunda persona.",
    "fortalezas": ["...", "...", "..."],
    "debilidades": ["...", "..."],
    "como_te_ven": "Una oración.",
    "combina_con": [{ "id": "lealtad", "razon": "Una oración corta." }, { "id": "...", "razon": "..." }],
    "herramienta_ideal": "Objeto de Minecraft donde este encantamiento luce mejor, con una razón corta."
  }
}
```

Las descripciones deben ser positivas pero honestas: incluir debilidades reales y suaves. Que cada
persona se sienta vista, no halagada de forma genérica (evitar frases tipo horóscopo).
