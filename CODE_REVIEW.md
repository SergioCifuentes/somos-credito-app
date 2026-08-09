# 3.1 Fragmento A — Cálculo de mora

## Problemas encontrados

(Bug funciona) Math.round de diferencia de horas y no de dias.

(Bug funciona) No se valida la existencia del credito.

(Bug funciona) No se establecer zona horaria

## Causa raíz
El problema principal es que se esta calculando la mora con una diferencia de horas y no de fechas.

## Impacto
- Los saldos de los clientes sean incorrectos
- Un credito inexistente termine generando un error 500 en lugar de un 404.

## Solución propuesta
Debemos tomar en cuenta unicamente el dia actual y el dia de vencimiento, ignorando las horas ya que estas no aumentan el valor de la mora. Tambien debemoss agregar una validacion de la existencia del credito, esto para que nuestras APIs sean mas robustos.


# 3.2 Fragmento B — Registro de pago

## Problemas encontrados

(Bug funciona) No se utilizan transacciones

(Bug funciona) Falta de bloqueo de fila

(Mala práctica) No hay proteccion contra pagos duplicados si el cliente reintenta la misma operacion

## Causa raíz
No existe ningun mecanismo para asegurarnos que todo el proceso de registro de pago se haga en una misma operacion. Tampoco que nos asegure que la misma peticion se pueda mandar mas de dos veces.

## Impacto
- Pagos dobles
- Diferencias entre tablas Pago y el Saldo del credito

## Solución propuesta
Cuando manejamos datos tan sensibles como el dinero es importante que nos aseguremos que las operaciones completas terminen con exito o que hagan rollback por completo.
Lo que se debe hacer es agregar una transaccion, bloquear la fila para que nadie pueda modificar al mismo tiempo y finalmente asegurarnos que no procesemos la misma operacion dos veces.

# 3.3 Fragmento C — API de historial (React + Node)

## Problemas encontrados
(Bug seguridad) Amenaza de SQL Injection

(Bug funciona) Frontend siempre espera creditos existentes (creditos[0])

(Bug seguridad) El catch devuelve informacion de mas

(Bug seguridad) Posibilidad para el usuario de solo cambiar el id del cliente e ir navegando facilmente

## Causa raíz
La pagina se rompe porque no maneja bien cuando el cliente no tiene creditos

El backend no valida si el usuario tiene permisos para ver la informacion del cliente solicitado

Los mensajes para debuggear se estan mandando directamente al frontend.

## Impacto
- Amenaza de SQL Injection
- Expone informacion sensible del sistema y de clientes

## Solución propuesta
Para consultas a la DB yo recomiendo usar ORMs, estas ya se encargan de eliminar las amenazas de SQL Injection. Si el junior no conoce sobre el tema de SQL Injection se lo explicaria con un ejemplo. El frontend debe tener un default o fallback para cuando los datos vienen vacios o nulos incluso. Hay que manejar los errores de mejor manera y definitivamente no regresar stacks o configs de la db, estos nos pueden servir para debuggear pero no vamos a debuggear desde el frontend, ya que los usuarios no deben de poder ver esta informacion.

# 3.4 Fragmento D — Hook de React

## Problemas encontrados
(Bug de rendimiento) useEffect se ejecuta por cada render 

## Causa raíz
El problema principal viene del setResultado(filtrados) adentro del useEffect, esto causa otro render.

## Impacto
- Filtros innecessarios

## Solución propuesta
Para filtros asi recomiendo usar useMemo, para no hacer filtros inecesarios. Ademas si es necesario podemos agregar paginacion del lado del backend.