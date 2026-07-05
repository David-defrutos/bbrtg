# Blood Bowl: Rise to Glory — Ayudas de mesa compactas v0.5

> Versión resumida para imprimir en 1-2 páginas.  
> Referencia rápida para jugadores y máster. No sustituye al manual básico.

---

## 1. Secuencia de jornada

```text
1. Fase previa / aventura.
2. Acciones de preparación.
3. Inicio de partido o reinicio de jugada.
4. Partido por rondas y activaciones.
5. Touchdowns y recolocaciones.
6. Postpartido.
7. Compras, lesiones, progreso y siguiente jornada.
```

---

## 2. Tiradas

```text
Atributo = número de d10.
Habilidad = umbral de éxito, repetición y dado auxiliar.
Dificultad = éxitos necesarios.
Si éxitos >= dificultad, superas.
```

### Atributos a dados

| Atributo | Dados | Atributo | Dados |
|---:|---:|---:|---:|
| 1-2 | 1d10 | 11-12 | 6d10 |
| 3-4 | 2d10 | 13-14 | 7d10 |
| 5-6 | 3d10 | 15-16 | 8d10 |
| 7-8 | 4d10 | 17-18 | 9d10 |
| 9-10 | 5d10 | 19-20 | 10d10 |

### Habilidades

| Hab. | Éxito | Repite | Aux. |
|---:|---:|---|---|
| 0 | 10 | No | - |
| 1 | 9+ | No | - |
| 2 | 9+ | 1 fallo | - |
| 3 | 8+ | 1 fallo | - |
| 4 | 8+ | 1 fallo | +1d3 |
| 5 | 8+ | 1 fallo | +1d4 |
| 6 | 8+ | 1 fallo | +1d5 |
| 7 | 7+ | 1 fallo | +1d5 |
| 8 | 7+ | 1 fallo | +1d6 |
| 9 | 7+ | 2 fallos | +1d6 |
| 10 | 7+ | 2 fallos | +1d8 |

```text
10 natural explota: cuenta como éxito y tiras otro d10.
Dado auxiliar: se suma a un único d10 fallido. Cada auxiliar debe aplicarse a un fallo distinto. No explota. No genera éxito por sí solo.
```

### Dificultades

| Fácil | Normal | Difícil | Muy difícil | Legendaria | Imposible |
|---:|---:|---:|---:|---:|---:|
| 1 | 2 | 3 | 4 | 5 | 6+ |

---

## 3. Activación

Cada miniatura tiene durante su activación:

```text
Movimiento + 1 acción + 1 reacción de juego + 1 reacción de balón.
```

Puede dividir movimiento:

```text
Mover -> acción -> mover.
```

### Acciones habituales

| Acción | Tirada |
|---|---|
| Placar | Fuerza + Placar vs Resistencia + Aguantar |
| Robar balón | Técnica + Juego de balón vs Técnica + Juego de balón |
| Recoger balón | Técnica + Juego de balón |
| Pasar balón | Técnica + Juego de balón |
| Esprintar | Movimiento + Correr |
| Ayudar a levantarse | Sin tirada |

### No consumen acción

| Situación | Coste |
|---|---|
| Recibir | Reacción de balón |
| Interceptar / desviar | Reacción de balón |
| Retener | Reacción de juego |
| Usar dote defensiva | Normalmente reacción de juego |
| Apoyar | Sin acción ni reacción |
| Levantarse | 3 Movimiento |

---

## 4. Movimiento rápido

```text
Diagonal = 1 Movimiento.
Distancia = ruta más corta, contando diagonales como 1.
No puedes atravesar ni terminar en casilla ocupada salvo regla especial.
```

## 5. Iniciativa

```text
Iniciativa = Agilidad + Mente + 1d10.
```

Se tira:

```text
Inicio del partido.
Inicio de segunda parte.
Después de touchdown.
Cuando una regla reinicie la jugada.
```

```text
No se puede retrasar iniciativa por defecto.
```

### Dote: Esperar el Momento

```text
Requisito: Mente 3 o Voluntad 2.
Uso: reacción de juego, cuando vaya a empezar tu activación.
Efecto: reduces tu iniciativa actual en cualquier cantidad, mínimo 1.
Duración: hasta que se vuelva a tirar iniciativa.
```

---

## 6. Placaje, empujón y daño

### Placar

| Atacante | Defensor |
|---|---|
| Fuerza + Placar | Resistencia + Aguantar |

| Diferencia atacante | Resultado |
|---:|---|
| 0 o menos | Sin efecto |
| +1 | Empuja |
| +2 | Derriba |
| +3 o más | Derriba y causa daño |

### Daño

```text
Nivel de daño = diferencia de éxitos - 2.
Máximo normal: 5.
```

| Dif. | Resultado |
|---:|---|
| +3 | Daño 1: Golpeado |
| +4 | Daño 2: Aturdido |
| +5 | Daño 3: KO |
| +6 | Daño 4: Lesionado |
| +7 o más | Daño 5: Herida grave |

### Empujón

```text
Mueve al defensor 1 casilla alejándolo del atacante.
Si hay casilla libre válida, debe usarse.
Si no hay casilla libre válida, el defensor cae.
Fuera del campo: placa el público. Si llevaba el balón, lo suelta antes; vuelve por el punto más cercano y rebota 1d8.
Terreno difícil: Agilidad + Evasión Fácil o cae.
```

---

## 7. Estados

| Estado | Efecto rápido |
|---|---|
| Normal | Sin penalización |
| Golpeado | -1 dado a próxima tirada física; luego se elimina |
| Caído | Sin zona, sin reacción; levantarse cuesta 3 Movimiento |
| Aturdido | Caído; al inicio de su activación pasa a Caído, -1 dado físico ese turno |
| KO | Al inicio de activación: Resistencia + Aguantar dificultad 2; si supera pasa a Aturdido |
| Lesionado | Como KO; además -1 dado físico hasta final de partido o curación |
| Herida grave | Como Lesionado; genera consecuencia postpartido |

```text
Tiradas físicas: Correr, Placar, Evasión, Aguantar y aguantar balón.
```

### Daño sobre estados graves

```text
Si una miniatura ya dañada recibe daño igual o inferior a su estado actual, empeora 1 grado.
Si recibe daño superior, aplica el nuevo estado.
Nunca mejora por recibir daño.
Golpear a KO, Lesionado o Herida grave es falta: 1d10; con 1-3, expulsión del atacante.
```


---

## 8. Balón

### Recoger

```text
Acción. Estar en la casilla del balón.
Tirada: Técnica + Juego de balón.
Base: dificultad 2.
Con rival en pie adyacente: dificultad 3.
Fallo: rebote 1 casilla.
```

### Recibir

```text
Reacción de balón.
Base: dificultad 1.
Bajo presión: dificultad 2.
Fallo o sin reacción: rebote 1 casilla.
```

### Interceptar / desviar

```text
Reacción de balón.
Tirada: Técnica + Juego de balón.
Base: dificultad 3. Bajo presión: dificultad 4.
3+ éxitos: intercepta.
1-2 éxitos: desvía; rebote 1d8.
0 éxitos: no toca balón.
Solo una miniatura por pase salvo regla especial.
```

### Pasar

| Distancia | Dificultad |
|---:|---:|
| 1-3 | 1 |
| 4-6 | 2 |
| 7-9 | 3 |
| 10-12 | 4 |
| 13+ | 5 |

```text
Rival en pie adyacente al lanzador: +1 dificultad.
Fallo: desvío desde casilla objetivo.
```

### Robar balón

| Atacante | Defensor |
|---|---|
| Técnica + Juego de balón | Técnica + Juego de balón |

| Diferencia atacante | Resultado |
|---:|---|
| 0 o menos | No roba |
| +1 | Balón suelto, rebota 1 |
| +2 | Atacante roba balón |
| +3 o más | Atacante roba y mueve 1 gratis |

### Caer con balón

```text
Resistencia + Aguantar dificultad 1 para conservarlo.
KO, Lesionado o Herida grave: suelta automático.
Si suelta: rebote 1 casilla.
```

### Rebote 1d8

```text
1 2 3
4 X 5
6 7 8
```

---

## 9. Retener, Esprintar y apoyos

### Retener

```text
Se usa cuando un rival sale de tu zona de defensa.
Consume reacción de juego.
```

| Defensor | Miniatura que escapa |
|---|---|
| Fuerza + Placar | Agilidad + Evasión |

```text
Si quien escapa gana o empata: sale.
Si defensor gana: queda Retenido.
Retenido: pierde Movimiento restante, no cae, no recibe daño, no pierde acción.
```

### Esprintar

```text
Acción.
Declara +1 a +6 Movimiento.
Tirada: Movimiento + Correr.
Dificultad = casillas extra declaradas.
Fallo: no gana extra. No cae.
```

### Apoyos

```text
Debe estar en pie, adyacente al objetivo y no marcado.
No consume acción ni reacción.
Máximo 2 apoyos por bando.
Cada apoyo: +1d3 auxiliar.
```

---

## 10. Touchdown e inicio/reinicio

### Touchdown

```text
Marca una miniatura en pie, con balón, en zona de touchdown rival.
Entrar con balón marca inmediatamente.
Recibir o recoger en zona rival marca si controla balón.
Miniatura caída con balón no marca.
```


### Zonas de colocación

```text
Cada equipo se coloca en su propio medio campo.
Ninguna miniatura puede colocarse en zona de touchdown rival.
Ninguna miniatura rival puede colocarse a menos de 3 casillas de la miniatura que empieza con balón.
```

### Reinicio tras touchdown

```text
1. Actualizar marcador.
2. Sumar TD al contador de progresión.
3. Limpiar estados leves: Caído, Golpeado, Aturdido.
4. Mantener KO, Lesionado y Herida grave en banquillo/zona médica.
5. Determinar equipo receptor.
6. El receptor elige la miniatura que empieza con balón.
7. Colocar esa miniatura en el centro de su propia línea de touchdown.
8. Tirar iniciativa.
9. Recolocar miniaturas en orden inverso de iniciativa, respetando zonas de colocación.
10. Activa primero la miniatura con balón, aunque no sea la de mayor iniciativa.
11. Después actúan todas las demás miniaturas en orden normal de iniciativa, saltando a la que ya activó.
```
---

## 11. Fase previa

Cada personaje principal:

```text
2 acciones de preparación.
Primera: dados normales.
Segunda: mitad de dados de atributo, redondeando abajo, mínimo 1d10.
```

| Acción | Tirada | Resultado |
|---|---|---|
| Investigar rival | Mente + Voluntad | 1 ficha de rival por éxito |
| Preparar terreno | Mente + Voluntad | 1 punto preparación por éxito |
| Entrenar | Atributo + habilidad apropiada | 1 ficha de entrenamiento por éxito |
| Colocar trampas | Mente + Voluntad | 1 punto trampa por éxito |
| Rezar | Mejor atributo del dios + habilidad | 1 favor por éxito |

### Preparar terreno

| Cambio | Coste |
|---|---:|
| Crear/quitar terreno difícil | 1 |
| Aumentar/reducir ancho en 1 | 2 |
| Aumentar/reducir largo en 1 | 2 |
| Balón especial | 3 |

---

## 12. Acumulación

En una misma tirada puedes aplicar como máximo:

```text
1 dote.
1 equipo.
1 recurso.
1 don divino.
Apoyos normales.
```

```text
No puedes usar dos dotes, dos recursos o dos equipos en la misma tirada salvo regla especial.
```

---

## 13. Postpartido

```text
1. Resultado.
2. TD para progresión.
3. Subida de nivel si toca.
4. Recompensas.
5. Lesiones.
6. Compras y curaciones.
7. Actualizar plantilla.
```

### Dinero

| Concepto | Monedas |
|---|---:|
| Jugar partido oficial | 3 |
| Empatar | +1 |
| Ganar | +3 |
| Cada touchdown marcado | +1 |

### Progresión

```text
Cada 3 TD del equipo = +1 nivel para todos los personajes principales.
Sobran TD: se conservan.
```

### Subida de nivel

| Nivel | Recompensa |
|---|---|
| Cada nivel | +1 habilidad |
| Nivel par | +1 atributo adicional |
| Múltiplo de 5 | +1 dote adicional |
| Nivel 30 | La dote ganada es legendaria |

### Recuperación

| Estado final PJ principal | Efecto |
|---|---|
| Normal/Golpeado/Caído/Aturdido/KO | Se recupera |
| Lesionado | Próximo partido con -1 dado físico salvo curación |
| Herida grave | Tratamiento o consecuencia narrativa/temporal |

| Tratamiento | Coste |
|---|---:|
| Curar Lesionado | 2 |
| Curar Herida grave | 5 |

| Secundario final | Coste para conservar |
|---|---:|
| Lesionado | 1 |
| Herida grave | 2 |
| Resto | 0 |

---

## 14. Ficha rápida de jugador

```text
Nombre: __________________  Raza: __________  Nivel: ___

Mov ___ Fue ___ Agi ___ Tec ___ Res ___ Men ___
Correr ___ Placar ___ Evasion ___ Balon ___ Aguantar ___ Voluntad ___

Dotes: _______________________________________________________________
Equipo/Recurso: ______________________________________________________
Dios/Favor: __________________________________________________________

Iniciativa actual: ___   Movimiento restante: ___
Accion: libre / usada
Reaccion juego: libre / usada
Reaccion balon: libre / usada
Estado: Normal / Golpeado / Caido / Aturdido / KO / Lesionado / Grave
Balon: si / no
```

---

## 15. Ficha rápida de partido

```text
Partido: ______________________  Jornada: ____  Rival: ______________
Campo: ____________  Duracion: ______  Parte: 1 / 2  Ronda: ____

Marcador equipo: ____   Marcador rival: ____
TD acumulados antes: ____   TD este partido: ____   TD despues: ____

Orden iniciativa:
1. __________________  5. __________________
2. __________________  6. __________________
3. __________________  7. __________________
4. __________________  8. __________________

Cambios de iniciativa / Esperar el Momento:
_____________________________________________________________________

KO / Lesionados / Heridas graves:
_____________________________________________________________________

Trampas activas:
1. Tipo ______ Nivel ___ X ___ Y ___ Activada: si / no
2. Tipo ______ Nivel ___ X ___ Y ___ Activada: si / no
3. Tipo ______ Nivel ___ X ___ Y ___ Activada: si / no

Recursos usados:
_____________________________________________________________________
```

---

## 16. Criterios rápidos del máster

```text
1. Que el partido siga avanzando.
2. Que todos puedan jugar.
3. Que un fallo no corte el turno del equipo.
4. Que las decisiones sean simétricas para jugadores y rivales.
5. Que lo divertido pese más que lo realista.
6. Si una regla ralentiza demasiado, simplifica y sigue.
```


## 17. Notas de versión v0.5

```text
- Actualizada contra Manual básico v0.23: habilidad 9, auxiliares múltiples, movimiento/diagonales, colocación, reinicio, balón fuera del campo, daño sobre estados graves y faltas.
```
