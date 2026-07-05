# Blood Bowl: Rise to Glory — Ayudas de mesa v0.5

> Documento imprimible de consulta rápida para jugar.  
> Extraído del Manual básico v0.23.  
> Uso previsto: tenerlo en mesa durante la partida, separado del manual completo.

---

# 1. Hoja rápida de juego

## 1.1. Secuencia de jornada

```text
1. Fase previa / aventura.
2. Acciones de preparación.
3. Inicio o reinicio de jugada.
4. Partido.
5. Touchdowns, reinicios y estados.
6. Final del partido.
7. Postpartido.
8. Compras, curaciones y actualización de equipo.
```

---

## 1.2. Cómo resolver una tirada

```text
1. Elige atributo.
2. Convierte el atributo en dados.
3. Mira la habilidad asociada.
4. Tira los d10.
5. Cuenta éxitos según el umbral.
6. Aplica explosiones de 10.
7. Repite 1 fallo si la habilidad lo permite.
8. Aplica dado auxiliar si corresponde.
9. Compara éxitos con dificultad.
```

Regla base:

```text
Si igualas o superas los éxitos necesarios, tienes éxito.
```

---

## 1.3. Atributo a dados

| Atributo | Dados |
|---:|---:|
| 1-2 | 1d10 |
| 3-4 | 2d10 |
| 5-6 | 3d10 |
| 7-8 | 4d10 |
| 9-10 | 5d10 |
| 11-12 | 6d10 |
| 13-14 | 7d10 |
| 15-16 | 8d10 |
| 17-18 | 9d10 |
| 19-20 | 10d10 |

---

## 1.4. Habilidades

| Habilidad | Atributo | Uso principal |
|---|---|---|
| Correr | Movimiento | Esprintar, perseguir, carrera |
| Placar | Fuerza | Golpear, empujar, derribar, retener |
| Evasión | Agilidad | Escapar, esquivar, caer bien |
| Juego de balón | Técnica | Pasar, recibir, recoger, robar, interceptar |
| Aguantar | Resistencia | Resistir golpes, proteger balón, recuperarse |
| Voluntad | Mente | Liderar, rezar, concentración, presión |

---

## 1.5. Escala rápida de habilidades

| Nivel | Umbral | Repite | Dado auxiliar |
|---:|---:|---|---|
| 0 | 10 | No | — |
| 1 | 9+ | No | — |
| 2 | 9+ | 1 fallo | — |
| 3 | 8+ | 1 fallo | — |
| 4 | 8+ | 1 fallo | +1d3 |
| 5 | 8+ | 1 fallo | +1d4 |
| 6 | 8+ | 1 fallo | +1d5 |
| 7 | 7+ | 1 fallo | +1d5 |
| 8 | 7+ | 1 fallo | +1d6 |
| 9 | 7+ | 2 fallos | +1d6 |
| 10 | 7+ | 2 fallos | +1d8 |

Notas:

```text
El 10 siempre explota.
Cada 10 cuenta como 1 éxito y permite tirar otro d10 adicional.
El dado auxiliar se suma a un único d10 fallido.
Cada dado auxiliar debe aplicarse a un fallo distinto.
El dado auxiliar no explota y no genera éxito por sí mismo.
```

---

## 1.6. Dificultades

| Dificultad | Éxitos necesarios |
|---|---:|
| Fácil | 1 |
| Normal | 2 |
| Difícil | 3 |
| Muy difícil | 4 |
| Legendaria | 5 |
| Imposible | 6+ |

---

# 2. Turno y activación

## 2.1. Cada miniatura tiene

```text
Movimiento.
1 acción.
1 reacción de juego.
1 reacción de balón.
```

Durante su activación:

```text
Puede mover y hacer 1 acción.
Puede dividir el movimiento antes y después de la acción.
```

Ejemplos:

```text
Mover 4 -> acción -> mover 2.
Acción -> mover 6.
Mover 3 -> acción -> mover 3.
```

---

## 2.2. Acciones habituales

| Acción | Tirada habitual |
|---|---|
| Placar | Fuerza + Placar contra Resistencia + Aguantar |
| Robar balón | Técnica + Juego de balón contra Técnica + Juego de balón |
| Recoger balón | Técnica + Juego de balón |
| Pasar balón | Técnica + Juego de balón |
| Esprintar | Movimiento + Correr |
| Ayudar a levantarse | Sin tirada |

---

## 2.3. No consumen acción

| Situación | Coste |
|---|---|
| Recibir balón | Reacción de balón |
| Interceptar / desviar | Reacción de balón |
| Retener | Reacción de juego |
| Apoyar | Sin acción ni reacción |
| Levantarse | 3 puntos de Movimiento |

---

## 2.4. Reacciones

| Reacción | Usos típicos |
|---|---|
| Reacción de juego | Retener, resistir, proteger, curar, dotes defensivas |
| Reacción de balón | Recibir, interceptar, desviar, atrapar rebote, dotes de balón |

Reglas:

```text
Se recuperan al inicio de la siguiente activación de esa miniatura.
Solo miniaturas en pie y conscientes pueden usar reacción, salvo regla especial.
```

---

## 2.5. Movimiento, diagonales y casillas ocupadas

```text
Mover en diagonal cuesta 1 Movimiento.
Las distancias se miden por la ruta más corta, contando diagonales como 1.
Una miniatura no puede atravesar ni terminar su movimiento en una casilla ocupada, aliada o rival, salvo regla especial.
```

---

## 2.6. Iniciativa

```text
Iniciativa = Agilidad + Mente + 1d10.
```

Se tira:

```text
Al inicio del partido.
Al inicio de la segunda parte.
Después de cada touchdown.
Cuando una regla o evento reinicie la jugada.
```

Empates:

```text
1. Mayor Agilidad.
2. Mayor Mente.
3. Azar.
```

Regla importante:

```text
No se puede retrasar iniciativa por defecto.
```

Excepción:

```text
La dote Esperar el Momento permite reducir tu iniciativa actual usando reacción de juego.
La iniciativa reducida se mantiene hasta que vuelva a tirarse iniciativa.
```

---

# 3. Acciones de partido

## 3.1. Placar

Atacante:

```text
Fuerza + Placar.
```

Defensor:

```text
Resistencia + Aguantar.
```

| Diferencia a favor atacante | Resultado |
|---:|---|
| 0 o menos | Sin efecto |
| +1 | Empuja |
| +2 | Derriba |
| +3 o más | Derriba y causa daño |

---

## 3.2. Daño por placaje

```text
Nivel de daño = diferencia de éxitos - 2.
Daño máximo normal: 5.
```

| Diferencia placaje | Resultado |
|---:|---|
| +1 | Empuja |
| +2 | Derriba |
| +3 | Derriba + daño 1 |
| +4 | Derriba + daño 2 |
| +5 | Derriba + daño 3 |
| +6 | Derriba + daño 4 |
| +7 o más | Derriba + daño 5 |

---

## 3.3. Empujones

```text
Empujón = mueve al defensor 1 casilla alejándolo del atacante.
El atacante elige entre casillas válidas.
Si hay casilla libre válida, debe usar una libre.
Si no hay casilla libre válida, el defensor cae en su casilla.
No hay cadenas de empujones como regla base.
Ser empujado fuera del campo activa público.
```

Si es empujado a terreno difícil:

```text
Agilidad + Evasión dificultad Fácil o cae.
```

---

## 3.4. Público

Si una miniatura sale empujada fuera del campo:

```text
El público placa.
Público: Fuerza 8 + Placar 3.
Miniatura: Resistencia + Aguantar.
Consecuencias iguales que un placaje normal.
Si llevaba el balón: lo suelta antes del público; vuelve al campo por el punto más cercano y rebota 1d8.
```

---

## 3.5. Retener

Una miniatura en pie ejerce zona de defensa en sus 8 casillas adyacentes.

Salir de zona de defensa no exige tirada automática, pero un rival puede gastar reacción de juego para Retener.

| Rol | Tirada |
|---|---|
| Defensor que retiene | Fuerza + Placar |
| Miniatura que escapa | Agilidad + Evasión |

Resultado:

```text
Si quien escapa gana o empata: sale normalmente.
Si defensor gana: la miniatura queda Retenida.
```

Retenido:

```text
Pierde todo su Movimiento restante durante esta activación.
No cae.
No recibe daño.
No pierde su acción si todavía no la usó.
```

---

## 3.6. Esprintar

```text
Es acción.
Declara cuántas casillas extra quieres ganar.
Tirada: Movimiento + Correr.
Dificultad = número de casillas extra declaradas.
```

| Extra | Dificultad |
|---:|---:|
| +1 | 1 |
| +2 | 2 |
| +3 | 3 |
| +4 | 4 |
| +5 | 5 |
| +6 | 6 |

Resultado:

```text
Si supera: gana esas casillas extra.
Si falla: no gana Movimiento extra.
No hay caída por fallar.
No hay ganancia parcial por defecto.
```

---

## 3.7. Apoyos

Una miniatura puede apoyar si:

```text
Está en pie.
Está adyacente al objetivo correspondiente.
No está marcada por rival.
```

Cada apoyo:

```text
+1d3 auxiliar.
Máximo 2 apoyos por bando.
No consume acción ni reacción.
```

Placaje:

```text
Apoyo atacante: aliado adyacente al defensor, no marcado -> +1d3 auxiliar a Placar.
Apoyo defensivo: aliado adyacente al atacante, no marcado -> +1d3 auxiliar a Aguantar.
```

Retener:

```text
Apoyo al defensor que retiene: aliado adyacente a la miniatura que intenta escapar, no marcado -> +1d3 auxiliar.
Apoyo a miniatura que escapa: aliado adyacente al defensor que intenta retener, no marcado -> +1d3 auxiliar.
```

---

# 4. Balón

## 4.1. Recoger balón

```text
Recoger balón es acción.
Entrar en la casilla del balón no lo recoge automáticamente.
```

Requisitos:

```text
Estar en la casilla del balón.
Gastar acción.
```

Tirada:

```text
Técnica + Juego de balón.
```

| Situación | Dificultad |
|---|---:|
| Base | Normal, 2 éxitos |
| Rival en pie adyacente | Difícil, 3 éxitos |

Resultado:

```text
Si éxito: controla balón.
Si falla: balón rebota 1 casilla.
Si queda Movimiento, puede seguir moviendo tras recoger.
```

---

## 4.2. Pasar balón

```text
Pasar es acción.
Requiere tener balón.
Tirada: Técnica + Juego de balón.
```

| Distancia | Dificultad |
|---|---:|
| 1-3 | 1 |
| 4-6 | 2 |
| 7-9 | 3 |
| 10-12 | 4 |
| 13+ | 5 |

Modificador:

```text
Si el lanzador está bajo presión con rival en pie adyacente: +1 dificultad.
```

Resultado:

```text
Si supera: pase llega a casilla objetivo.
Si falla: desvío desde casilla objetivo.
```

---

## 4.3. Recibir

```text
Recibir consume reacción de balón.
```

Cuando el balón llega a casilla ocupada por miniatura en pie, puede intentar recibir si tiene reacción de balón.

Tirada:

```text
Técnica + Juego de balón.
```

| Situación | Dificultad |
|---|---:|
| Base | 1 éxito |
| Bajo presión rival | 2 éxitos |

Resultado:

```text
Si supera: controla balón.
Si falla: rebote 1d8.
Si no tiene reacción o decide no usarla: rebote 1d8.
```

---

## 4.4. Robar balón

```text
Robar balón es acción técnica.
Requiere estar adyacente al portador.
```

Atacante:

```text
Técnica + Juego de balón.
```

Defensor:

```text
Técnica + Juego de balón.
```

| Diferencia atacante | Resultado |
|---:|---|
| 0 o menos | No roba |
| +1 | Balón suelto, rebota 1 casilla |
| +2 | Atacante roba balón |
| +3 o más | Atacante roba balón y puede moverse 1 casilla gratis |

---

## 4.5. Interceptar / desviar

```text
Consume reacción de balón.
Puede intentarse si el balón pasa por casilla adyacente o zona claramente válida.
```

Tirada:

```text
Técnica + Juego de balón.
```

Dificultad:

```text
Base: 3 éxitos.
Bajo presión: 4 éxitos.
```

| Éxitos | Resultado |
|---:|---|
| 3+ | Intercepta y controla balón |
| 1-2 | Desvía balón; rebote 1d8 desde casilla del interceptor |
| 0 | No toca balón |

Regla:

```text
Solo una miniatura puede intentar interceptar cada pase salvo regla especial.
```

---

## 4.6. Rebotes

Todos los rebotes simples usan 1d8:

```text
1 2 3
4 X 5
6 7 8
```

```text
X = casilla de origen.
```

---

## 4.7. Caer con balón

Si una miniatura con balón cae:

```text
Resistencia + Aguantar dificultad 1 para conservarlo.
```

Modificadores:

```text
Si está Aturdida: -1 dado por Aturdido.
Si queda KO, Lesionada o con Herida grave: suelta automáticamente el balón.
```

Si suelta el balón:

```text
Rebota 1 casilla.
```

---

## 4.8. Touchdown

Marca touchdown una miniatura que:

```text
Controla el balón.
Está en pie.
Está en zona de touchdown rival.
```

Reglas rápidas:

```text
Entrar con balón en zona rival marca inmediatamente.
Recibir en zona rival marca si controla balón.
Recoger balón suelto en zona rival marca si la recogida tiene éxito.
Miniatura caída con balón en zona rival no marca.
Si miniatura en pie con balón es empujada a touchdown rival, marca.
Si es derribada dentro de touchdown, no marca hasta estar en pie.
```

---

# 5. Estados

## 5.1. Tabla rápida de estados

| Estado | Resumen |
|---|---|
| Normal | Sin penalización |
| Golpeado | -1 dado a la próxima tirada física; se limpia después |
| Caído | Sin zona de defensa, sin reacción; debe levantarse |
| Aturdido | Caído, sin reacción; al inicio de su activación pasa a Caído |
| KO | Tira recuperación al inicio de su activación |
| Lesionado | Como KO, y -1 dado físico hasta final del partido o curarse |
| Herida grave | Como Lesionado, con consecuencia médica/postpartido |

---

## 5.2. Tiradas físicas

```text
Correr.
Placar.
Evasión.
Aguantar.
Incluye aguantar balón.
```

---


### Daño sobre estados graves

```text
Si una miniatura ya dañada recibe daño igual o inferior a su estado actual, empeora 1 grado.
Si recibe daño superior, aplica el nuevo estado.
Nunca mejora por recibir daño.
Golpear a KO, Lesionado o Herida grave es falta: 1d10; con 1-3, expulsión del atacante.
```

## 5.3. Levantarse

```text
Levantarse cuesta 3 puntos de Movimiento.
Si no tiene Movimiento suficiente, puede levantarse igualmente, pero no puede moverse más ese turno.
```

---

## 5.4. Recuperación de KO

Al inicio de cada activación suya:

```text
Resistencia + Aguantar dificultad 2.
```

Resultado:

```text
Si supera: pasa a Aturdido.
Si falla: sigue KO.
```

Cadena normal:

```text
KO -> Aturdido -> Caído -> En pie.
```

---

## 5.5. Reinicio tras touchdown

Después de un touchdown:

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

Estados leves se limpian:

```text
Caído se levanta gratis para recolocación.
Golpeado se elimina.
Aturdido pasa a Caído y se levanta para recolocación.
```

Estados graves permanecen:

```text
KO, Lesionado y Herida grave permanecen y van a banquillo/zona médica.
```

---

# 6. Inicio y reinicio de jugada

## 6.1. Sin patada inicial

```text
No hay patada inicial.
```

Al inicio del partido, segunda parte y después de cada touchdown:

```text
1. Se determina equipo receptor.
2. El equipo receptor elige miniatura que empieza con balón.
3. Esa miniatura se coloca en el centro de su propia línea de touchdown.
4. Se tira iniciativa.
5. Las miniaturas se colocan en orden inverso de iniciativa, respetando zonas de colocación.
6. La miniatura con balón activa primero, aunque no sea la de mayor iniciativa.
7. Después actúan todas las demás miniaturas en orden normal de iniciativa, saltando a la que ya activó.
```

---


### Zonas de colocación

```text
Cada equipo se coloca en su propio medio campo.
Ninguna miniatura puede colocarse en zona de touchdown rival.
Ninguna miniatura rival puede colocarse a menos de 3 casillas de la miniatura que empieza con balón.
```

## 6.2. Quién recibe

| Momento | Quién recibe |
|---|---|
| Inicio del partido | Tirada enfrentada de capitanes; ganador decide |
| Segunda parte | Recibe quien no recibió al inicio |
| Después de touchdown | Recibe el equipo que encajó |

---

# 7. Fase previa

## 7.1. Acciones de preparación

Cada personaje principal tiene:

```text
2 acciones de preparación.
Primera acción: dados normales.
Segunda acción: mitad de dados de atributo, redondeando hacia abajo, mínimo 1d10.
```

Acciones base:

```text
1. Investigar al rival.
2. Preparar el terreno.
3. Entrenamiento específico.
4. Colocar trampas.
5. Rezar o pactar con entidad.
```

---

## 7.2. Investigar al rival

```text
Tirada: Mente + Voluntad.
Cada éxito permite consultar la ficha de 1 rival.
```

---

## 7.3. Preparar el terreno

```text
Tirada: Mente + Voluntad.
Cada éxito = 1 punto de preparación de terreno.
```

| Cambio | Coste |
|---|---:|
| Crear 1 casilla de terreno difícil | 1 |
| Quitar 1 casilla de terreno difícil | 1 |
| Aumentar/reducir ancho en 1 | 2 |
| Aumentar/reducir largo en 1 | 2 |
| Usar balón especial | 3 |

---

## 7.4. Entrenamiento específico

| Entrenamiento | Tirada |
|---|---|
| Carrera | Movimiento + Correr |
| Placaje | Fuerza + Placar |
| Evasión | Agilidad + Evasión |
| Balón | Técnica + Juego de balón |
| Aguante | Resistencia + Aguantar |
| Voluntad / magia / táctica | Mente + Voluntad |

Resultado:

```text
Cada éxito = 1 ficha de entrenamiento.
Cada ficha da +1d3 auxiliar en una tirada de esa habilidad durante el partido.
Máximo 1 ficha de entrenamiento por tirada.
```

---

## 7.5. Colocar trampas

```text
Tirada: Mente + Voluntad.
Cada éxito = 1 punto de trampa.
```

Reglas rápidas:

```text
Las trampas no se activan automáticamente.
El jugador que colocó la trampa decide cuándo revelarla/activarla.
Cada trampa se anota en secreto: tipo, nivel, coordenada X/Y y efecto resumido.
Durante preparación inicial, solo en el medio campo donde empieza el equipo que las coloca.
No pueden colocarse en zona de touchdown salvo regla especial.
```

| Trampa | Efecto |
|---|---|
| Caída | Resiste con Agilidad + Evasión. Dificultad = nivel. Si falla, cae. |
| Daño | Resiste con Resistencia + Aguantar. Dificultad = nivel. Si falla, recibe daño. |
| Intercambio | Conecta dos casillas. Nivel x2 = distancia máxima. Intercambia miniaturas o desplaza una miniatura. |
| Atracción de balón | Alcance = nivel x2. Atrae balón suelto o fuerza Aguantar dificultad 1 al portador. |

---

## 7.6. Rezar

```text
Rezar = mejor de los 2 atributos del dios + habilidad asociada.
Cada éxito = 1 punto de favor divino.
```

---

# 8. Economía y postpartido

## 8.1. Recompensa base

| Resultado | Dinero |
|---|---:|
| Jugar partido | 3 monedas |
| Empatar | +1 moneda |
| Ganar | +3 monedas |
| Cada touchdown marcado | +1 moneda |

Ejemplos:

```text
Pierdes 2-1: 3 + 1 TD = 4 monedas.
Ganas 3-1: 3 + 3 ganar + 3 TD = 9 monedas.
```

---

## 8.2. Postpartido rápido

```text
1. Actualizar marcador y resultado.
2. Contar touchdowns para progresión.
3. Aplicar subida de nivel si corresponde.
4. Calcular recompensas en monedas.
5. Resolver lesiones y recuperación.
6. Decidir compras, curaciones y contrataciones.
7. Actualizar plantilla.
8. Preparar siguiente jornada.
```

---

## 8.3. Subida de nivel

```text
Cada 3 touchdowns anotados por el equipo = +1 nivel para todos los personajes principales.
```

Cada nivel:

```text
+1 a una habilidad.
```

Cada nivel par:

```text
+1 a un atributo.
```

Cada múltiplo de 5:

```text
+1 dote.
```

Nivel 30:

```text
La dote obtenida es legendaria.
```

---

## 8.4. Recuperación postpartido

Personajes principales:

| Estado al final del partido | Recuperación básica |
|---|---|
| Normal / Golpeado / Caído / Aturdido / KO | Se recupera |
| Lesionado | Empieza el próximo partido con -1 dado físico, salvo tratamiento |
| Herida grave | Requiere tratamiento o deja consecuencia narrativa/temporal |

Tratamiento recomendado:

| Tratamiento | Coste |
|---|---:|
| Curar Lesionado | 2 monedas |
| Curar Herida grave | 5 monedas |
| Médico excepcional / milagro | Según historia |

Secundarios:

| Estado final | Resultado |
|---|---|
| Normal / Golpeado / Caído / Aturdido / KO | Se recupera gratis |
| Lesionado | Pagar 1 moneda para conservarlo o retirarlo |
| Herida grave | Pagar 2 monedas para conservarlo o retirarlo |

---

# 9. Límites rápidos

## 9.1. Límite de acumulación

En una misma tirada solo puedes aplicar:

```text
1 dote.
1 equipo.
1 recurso.
1 don divino.
Apoyos normales.
```

No puedes aplicar dos objetos o dos recursos distintos a la misma tirada salvo regla especial.

---

## 9.2. Límite de carga

Cada personaje puede llevar al partido:

```text
1 pieza de equipo principal.
Hasta 2 recursos consumibles preparados.
1 objeto mágico mayor activo, si lo tiene.
```

---

## 9.3. Alineación estándar 8v8

```text
4 personajes principales.
Hasta 2 secundarios especiales o raros.
El resto básicos o competentes.
```

---

# 10. Dotes de consulta frecuente

## 10.1. Esperar el Momento

```text
Tipo: General / Iniciativa
Requisito: Mente 3 o Voluntad 2
Uso: Reacción de juego, cuando vaya a empezar tu activación
Efecto: reduces tu iniciativa actual en cualquier cantidad hasta mínimo 1.
Duración: hasta que se vuelva a tirar iniciativa.
Límite: no puedes aumentar tu iniciativa con esta dote; solo reducirla.
```

---

## 10.2. Manos Finas

```text
Requisito: Técnica 4
Uso: Reacción de balón, antes de tirar para recibir o recoger balón
Efecto: +1d3 auxiliar a Técnica + Juego de balón.
Límite: para recoger durante tu activación, gastas acción para recoger y reacción de balón para aplicar esta dote.
```

---

## 10.3. Placaje Pesado

```text
Requisito: Fuerza 4
Uso: Antes de tirar un placaje
Coste: 3 puntos de Movimiento
Efecto: +1d3 auxiliar a Fuerza + Placar.
Límite: forma parte de la acción de placar.
```

---

## 10.4. Cornada

```text
Requisito: Fuerza 4
Uso: Al placar después de moverte al menos 3 casillas hacia el objetivo
Efecto: +1d3 auxiliar al placaje.
Límite: se declara antes de tirar.
```

---

## 10.5. Escurridizo

```text
Requisito: Agilidad 3
Uso: Reacción de juego, antes de tirar para escapar de Retener
Efecto: +1d3 auxiliar a Agilidad + Evasión.
Límite: consume reacción de juego. Solo contra Retener.
```

---

## 10.6. Marcaje Firme

```text
Requisito: Placar 2
Uso: Reacción de juego, antes de tirar para Retener
Efecto: +1d3 auxiliar a Fuerza + Placar para Retener.
Límite: consume reacción de juego. Solo Retener.
```

---

# 11. Fichas rápidas imprimibles

## 11.1. Ficha rápida de jugador

```text
Nombre:
Raza:
Nivel:
Dios:

Mov:      Fue:      Agi:      Tec:      Res:      Men:
Correr:   Placar:   Evasión:  Balón:    Aguantar: Voluntad:

Iniciativa actual:
Movimiento restante:
Acción: disponible / gastada
Reacción de juego: disponible / gastada
Reacción de balón: disponible / gastada

Estado:
Balón: sí / no

Dotes principales:
1.
2.
3.

Equipo:
Consumible 1:
Consumible 2:
Favor divino:
```

---

## 11.2. Ficha rápida de secundario

```text
Nombre:
Tipo:
Rol:
Coste:

Mov:      Fue:      Agi:      Tec:      Res:      Men:
Correr:   Placar:   Evasión:  Balón:    Aguantar: Voluntad:

Iniciativa actual:
Movimiento restante:
Acción: disponible / gastada
Reacción de juego: disponible / gastada
Reacción de balón: disponible / gastada

Dote:
Estado:
Balón: sí / no
```

---

## 11.3. Ficha rápida de equipo

```text
Equipo:
Entrenador:
Colores / escudo:

Liga:
Partidos jugados:
Victorias:
Empates:
Derrotas:
TD a favor:
TD en contra:
Puntos de liga:

Progresión:
TD acumulados para subir nivel: ___ / 3

Economía:
Monedas:
Deudas:
Ingresos recurrentes:

Personajes principales:
1.
2.
3.
4.

Secundarios alineados:
1.
2.
3.
4.

Recursos de equipo:
1.
2.
3.

Lesiones / problemas:
1.
2.
3.
```

---

## 11.4. Ficha rápida de partido

```text
Partido:
Jornada:
Rival:
Campo:
Duración:

Marcador:
Equipo jugador: ___
Rival: ___

Parte actual:
Turno actual:

Orden de iniciativa:
1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
11.
12.
13.
14.
15.
16.

Cambios de iniciativa:
1.
2.
3.

Estados graves:
KO:
Lesionados:
Heridas graves:

Trampas activas:
1. Tipo: ___ Nivel: ___ Coordenada: ___ Activada: sí / no
2. Tipo: ___ Nivel: ___ Coordenada: ___ Activada: sí / no
3. Tipo: ___ Nivel: ___ Coordenada: ___ Activada: sí / no

Recursos usados:
1.
2.
3.

TD acumulados antes:
TD marcados este partido:
TD acumulados después:
```

---

# 12. Checklist del máster

## 12.1. Antes de jugar

```text
Campo preparado.
Fichas de jugadores principales.
Fichas de secundarios.
Ficha de equipo.
Ficha de partido.
Dados d10 y dados auxiliares.
Marcadores de estado.
Marcadores de balón.
Marcadores de acción y reacciones.
Lista de rivales preparada.
Trampas secretas anotadas si existen.
```

---

## 12.2. Durante el partido

```text
Recordar que no hay turnover.
Recordar Retener contra jugadores rápidos.
Controlar reacción de juego y reacción de balón.
Marcar estados en cuanto ocurran.
Actualizar iniciativa si alguien usa Esperar el Momento.
Actualizar touchdowns de progresión.
Limpiar estados leves tras touchdown.
Mantener estados graves en banquillo/zona médica.
```

---

## 12.3. Después del partido

```text
Actualizar marcador.
Sumar touchdowns.
Subir nivel si corresponde.
Calcular monedas.
Resolver lesiones.
Pagar tratamientos si procede.
Comprar recursos o equipo.
Actualizar secundarios.
Guardar cambios en ficha de equipo.
Preparar siguiente rival.
```

---

# 13. Criterios rápidos para dudas

Si una regla no está clara, decidir en este orden:

```text
1. Que el partido siga avanzando.
2. Que la decisión sea divertida.
3. Que no quite turno completo al equipo por un fallo aislado.
4. Que no bloquee a un jugador demasiado tiempo.
5. Que sea simétrica si también puede aplicarse a rivales.
6. Que el balón y los touchdowns sigan siendo el centro del juego.
```

Regla práctica:

```text
Decide rápido, anota la duda y revisadla después del partido.
```


## 14. Notas de versión v0.5

```text
- Actualizada contra Manual básico v0.23.
- Incorporados cambios de habilidad 9, dados auxiliares múltiples, diagonales/distancias, casillas ocupadas, zonas de colocación, reinicio, balón fuera del campo, daño sobre estados graves y faltas.
```
