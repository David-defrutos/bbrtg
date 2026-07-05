# Blood Bowl: Rise to Glory — Ayudas de mesa para impresión v0.5

> Versión preparada para imprimir a doble cara.  
> Formato recomendado: A4 horizontal o vertical con dos columnas.  
> Uso: consulta rápida durante partido. No sustituye al manual básico.

---

# HOJA 1 — PARTIDO

## 1. Tirada básica

```text
1. Elige atributo: indica cuántos d10 tiras.
2. Elige habilidad: indica umbral, repetición y dado auxiliar.
3. Tira los dados.
4. Cada dado que iguala o supera el umbral = 1 éxito.
5. Cada 10 cuenta como éxito y explota: tira otro d10.
6. Si tienes repetición, repite 1 fallo.
7. Si tienes dado auxiliar, súmalo a 1 dado fallido.
8. Si éxitos >= dificultad, superas.
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

| Hab. | Umbral | Repite | Auxiliar |
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

### Dificultades

| Dif. | Éxitos |
|---|---:|
| Fácil | 1 |
| Normal | 2 |
| Difícil | 3 |
| Muy difícil | 4 |
| Legendaria | 5 |
| Imposible | 6+ |

---

## 2. Activación

Cada miniatura tiene por activación:

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
| Placar | Fue + Placar vs Res + Aguantar |
| Robar balón | Tec + Balón vs Tec + Balón |
| Recoger balón | Tec + Balón |
| Pasar | Tec + Balón |
| Esprintar | Mov + Correr |
| Ayudar a levantarse | Sin tirada |

### No consumen acción

| Situación | Coste |
|---|---|
| Recibir | Reacción de balón |
| Interceptar/desviar | Reacción de balón |
| Retener | Reacción de juego |
| Apoyo | Gratis |
| Levantarse | 3 Movimiento |

---

## 3. Movimiento y casillas

```text
Diagonal = 1 Movimiento.
Distancia = ruta más corta, contando diagonales como 1.
No puedes atravesar ni terminar en casilla ocupada salvo regla especial.
```

## 4. Iniciativa

```text
Iniciativa = Agilidad + Mente + 1d10.
```

Se tira:

```text
Inicio de partido.
Inicio de segunda parte.
Después de touchdown.
Cuando una regla reinicie la jugada.
```

Empates:

```text
Mayor Agilidad -> mayor Mente -> azar.
```

No se puede retrasar iniciativa por defecto.

### Dote: Esperar el Momento

```text
Requisito: Mente 3 o Voluntad 2.
Uso: reacción de juego, cuando vaya a empezar tu activación.
Efecto: reduces tu iniciativa actual en cualquier cantidad hasta mínimo 1.
Duración: hasta que se vuelva a tirar iniciativa.
```

---

## 5. Placaje

Atacante:

```text
Fuerza + Placar.
```

Defensor:

```text
Resistencia + Aguantar.
```

| Diferencia atacante | Resultado |
|---:|---|
| 0 o menos | Sin efecto |
| +1 | Empuja |
| +2 | Derriba |
| +3 o más | Derriba y causa daño |

### Daño por placaje

```text
Nivel de daño = diferencia de éxitos - 2.
Daño máximo normal: 5.
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
Si no hay casilla válida, el defensor cae en su casilla.
No hay cadenas de empujones por regla base.
Fuera del campo: público placa con Fue 8 + Placar 3.
```

---

## 6. Estados

| Estado | Efecto rápido |
|---|---|
| Normal | Sin penalización |
| Golpeado | -1 dado a próxima tirada física; luego se elimina |
| Caído | Sin zona, sin reacción; debe levantarse |
| Aturdido | Caído; al inicio de su activación pasa a Caído, con -1 dado físico ese turno |
| KO | Al inicio de activación: Res + Aguantar dif. 2; si supera pasa a Aturdido |
| Lesionado | Como KO; además -1 dado físico hasta curarse o fin de partido |
| Herida grave | Como Lesionado; genera consecuencia médica/postpartido |

Tiradas físicas:

```text
Correr, Placar, Evasión, Aguantar y aguantar balón.
```

### Daño sobre estados graves

```text
Si una miniatura ya dañada recibe daño igual o inferior a su estado actual, empeora 1 grado.
Si recibe daño superior, aplica el nuevo estado.
Nunca mejora por recibir daño.
Golpear a KO, Lesionado o Herida grave es falta: 1d10; con 1-3, expulsión del atacante.
```


---

## 7. Balón

### Recoger

```text
Acción. Estar en la casilla del balón.
Tec + Juego de balón.
Base: dificultad 2.
Rival en pie adyacente: dificultad 3.
Fallo: rebote 1d8.
```

### Pasar

```text
Acción. Requiere tener balón.
Tec + Juego de balón.
Presión rival adyacente: +1 dificultad.
Fallo: desvío desde casilla objetivo.
```

| Distancia | Dif. |
|---:|---:|
| 1-3 | 1 |
| 4-6 | 2 |
| 7-9 | 3 |
| 10-12 | 4 |
| 13+ | 5 |

### Recibir

```text
Reacción de balón.
Tec + Juego de balón.
Base: dificultad 1.
Bajo presión: dificultad 2.
Fallo o sin reacción: rebote 1d8.
```

### Interceptar / desviar

```text
Reacción de balón.
Tec + Juego de balón.
Base: dificultad 3.
Bajo presión: dificultad 4.
3+ éxitos: intercepta.
1-2 éxitos: desvía; rebote 1d8.
0 éxitos: no toca balón.
Solo una miniatura por pase salvo regla especial.
```

### Caer con balón

```text
Si cae: Res + Aguantar dif. 1 para conservarlo.
Si falla: rebote 1d8.
Si KO, Lesionado o Herida grave: suelta automáticamente.
```

### Rebote 1d8

```text
1 2 3
4 X 5
6 7 8
```

---

## 8. Retener, esprintar y apoyos

### Retener

```text
Cuando una miniatura sale de zona de defensa, un rival en pie y con reacción de juego puede Retener.
Defensor: Fuerza + Placar.
Escapa: Agilidad + Evasión.
Si escapa gana o empata: sale.
Si defensor gana: queda Retenida.
```

Retenido:

```text
Pierde Movimiento restante.
No cae.
No recibe daño.
No pierde acción si aún no la usó.
```

### Esprintar

```text
Acción.
Declara +1 a +6 Movimiento.
Tira Movimiento + Correr.
Dificultad = casillas extra declaradas.
Fallo: no gana extra. No cae.
```

### Apoyos

```text
Gratis. Máximo 2 apoyos por bando.
Debe estar en pie, adyacente al objetivo y no marcado.
Cada apoyo: +1d3 auxiliar.
```

---

## 9. Touchdown y reinicio

Marca touchdown una miniatura que:

```text
Controla balón + está en pie + está en zona de touchdown rival.
```

Tras touchdown:

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

# HOJA 2 — CAMPAÑA, PREPARACIÓN Y POSTPARTIDO

## 10. Fase previa

Cada personaje principal tiene:

```text
2 acciones de preparación.
Primera acción: dados normales.
Segunda acción: mitad de dados de atributo, redondeando hacia abajo, mínimo 1d10.
```

| Acción | Tirada | Resultado |
|---|---|---|
| Investigar rival | Men + Voluntad | 1 ficha de rival por éxito |
| Preparar terreno | Men + Voluntad | 1 punto de terreno por éxito |
| Entrenar | Atributo + habilidad | 1 ficha de entrenamiento por éxito |
| Colocar trampas | Men + Voluntad | 1 punto de trampa por éxito |
| Rezar | Mejor atributo del dios + habilidad | 1 favor por éxito |

### Terreno

| Cambio | Coste |
|---|---:|
| Crear/quitar terreno difícil | 1 |
| Aumentar/reducir ancho en 1 | 2 |
| Aumentar/reducir largo en 1 | 2 |
| Balón especial | 3 |

Terreno difícil:

```text
Entrar cuesta +1 Movimiento.
Empujado a terreno difícil: Agi + Evasión dif. 1 o cae.
```

### Trampas

```text
Se anotan en secreto: tipo, nivel, coordenada X/Y, efecto.
Solo en el medio campo propio durante preparación inicial.
No en zona de touchdown salvo regla especial.
Al descanso, las trampas no activadas pueden perderse.
```

| Trampa | Defensa | Efecto |
|---|---|---|
| Caída | Agi + Evasión | Si falla, cae |
| Daño | Res + Aguantar | Si falla, daño |
| Intercambio | — | Conecta/intercambia/desplaza |
| Atracción de balón | Aguantar dif. 1 al portador | Atrae balón o fuerza soltar |

---

## 11. Favor divino

```text
Rezar genera favor.
Coste del don = nivel del don.
El favor no usado se pierde al final del partido salvo dote.
```

Límite:

```text
1 don durante tu activación.
1 don mediante reacción entre activaciones.
```

Dones:

```text
Curar, Proteger, Furia, Mover, Destino, Balón.
```

---

## 12. Acumulación

En una misma tirada puedes aplicar:

```text
1 dote.
1 equipo.
1 recurso.
1 don divino.
Apoyos normales.
```

No puedes aplicar dos dotes, dos recursos o dos equipos a la misma tirada salvo regla especial.

---

## 13. Recursos y equipo

| Tipo | Regla rápida |
|---|---|
| Consumible | Se gasta al usarlo |
| Equipo común/bueno | 1 uso por partido; se recupera |
| Objeto raro | Según regla |
| Objeto mágico | Según regla |

Declaración:

```text
Si mejora tirada: antes de tirar.
Si modifica consecuencia: cuando ocurre la consecuencia.
```

---

## 14. Postpartido

```text
1. Actualizar resultado.
2. Sumar touchdowns para progresión.
3. Subir nivel si corresponde.
4. Calcular monedas.
5. Resolver lesiones.
6. Comprar recursos, equipo, curaciones o secundarios.
7. Actualizar ficha de equipo.
```

### Recompensas

| Concepto | Monedas |
|---|---:|
| Jugar partido oficial | 3 |
| Empatar | +1 |
| Ganar | +3 |
| Cada touchdown marcado | +1 |

### Progresión

```text
Cada 3 touchdowns del equipo = +1 nivel para todos los personajes principales.
Sobran touchdowns: se guardan.
```

Al subir:

```text
Cada nivel: +1 habilidad.
Nivel par: +1 atributo.
Múltiplo de 5: +1 dote.
Nivel 30: dote legendaria.
```

### Lesiones

| Estado final | Principal | Secundario |
|---|---|---|
| Normal/Golpeado/Caído/Aturdido/KO | Recupera | Recupera |
| Lesionado | Próximo partido -1 dado físico salvo tratamiento | Paga 1 o se retira |
| Herida grave | Tratamiento o consecuencia temporal/narrativa | Paga 2 o se retira |

Tratamiento orientativo:

```text
Curar Lesionado: 2 monedas.
Curar Herida grave: 5 monedas.
```

---

## 15. Secundarios

```text
No progresan individualmente.
No se reemplazan durante un partido.
Los jugadores de línea básicos se reemplazan gratis entre partidos.
```

| Tipo | Coste | Uso |
|---|---:|---|
| Línea básico | 0 | Relleno gratuito |
| Competente | 1 | Rol simple mejorado |
| Especial | 2-3 | Rol claro con dote |
| Raro | 5+ | Recompensa o contratación especial |

Límite 8v8:

```text
4 personajes principales.
Máximo 2 secundarios especiales o raros.
Resto básicos o competentes.
```

---

## 16. Ficha rápida de jugador

```text
Nombre:
Raza:
Nivel:
Dios:

Mov:    Fue:    Agi:    Tec:    Res:    Men:
Correr: Placar: Evasión: Balón: Aguantar: Voluntad:

Iniciativa actual:
Movimiento restante:
Acción: disponible / gastada
Reacción juego: disponible / gastada
Reacción balón: disponible / gastada

Estado: Normal / Golpeado / Caído / Aturdido / KO / Lesionado / Herida grave
Balón: sí / no

Dotes:
Equipo:
Consumibles:
Favor:
Notas:
```

---

## 17. Ficha rápida de partido

```text
Partido:
Jornada:
Rival:
Campo:
Duración:

Marcador:
Equipo jugador:
Rival:

TD acumulados antes:
TD marcados:
TD acumulados después:

Orden de iniciativa:
1.
2.
3.
4.
5.
6.
7.
8.
Rivales:
1.
2.
3.
4.
5.
6.
7.
8.

Cambios de iniciativa / Esperar el Momento:

KO:
Lesionados:
Heridas graves:

Trampas activas:
Recursos usados:
Favor disponible:
Notas:
```

---

## 18. Criterios rápidos del máster

Si una regla no está clara:

```text
1. Que el partido avance.
2. Que la decisión sea divertida.
3. Que no quite el turno completo por un fallo aislado.
4. Que no bloquee a un jugador demasiado tiempo.
5. Que sea simétrica si puede afectar a rivales.
6. Resolver ahora y revisar después del partido.
```

---

## 19. Recordatorios importantes

```text
No hay turnover.
Salir de zona no exige tirada automática: permite Retener.
Recoger balón es acción.
Recibir consume reacción de balón.
Esprintar es acción.
Placar es acción.
No se puede retrasar iniciativa salvo dote.
El favor divino no usado se pierde salvo dote.
Los secundarios no se reemplazan durante el partido.
```



## 20. Notas de versión v0.5

```text
- Actualizada contra Manual básico v0.23: habilidad 9, auxiliares múltiples, movimiento/diagonales, colocación, reinicio, balón fuera del campo, daño sobre estados graves y faltas.
```
