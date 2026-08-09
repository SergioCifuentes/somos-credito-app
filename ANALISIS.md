# Pregunta 1 — Diseño de sistema

- ¿Cómo rediseñarías el flujo de pagos para manejar estos picos? Describe la arquitectura que propondrías.

Propondria un modelo asincrono. Habria un endpoint de pago que regresara un JobId y otro para consultar el mismo JobId. Y de esa manera las operaciones no tendran que esperar hasta que otras terminen. El usuario ahora tendra que consultar el estado de su pago o le podriamos mandar una notificacion quizas con un sistema por eventos como kafka.

- ¿Qué nuevos riesgos introduce tu propuesta y cómo los mitigarías?

El principal problema es que ya no habra una respuesta inmediata, esto puede ocasionar que los usuarios manden la peticion multiples veces.

Para mitigar este riesgo usaria claves de idempotencia. 

- ¿Qué le dirías al equipo de negocio sobre el comportamiento del sistema durante la transición?

Les diria que el usuario no podra ver deinmediato la respuesta de su pago, pero que van a poder ser notificados cuando este proceso haya termindado o lo podran cosultar de manera facil con una vista de sus pagos realizados.
Haria la migracion de forma gradual y monitorear el proceso para poder luego pasar todo el trafico al nuevo sistema

# Pregunta 2 — Deuda técnica

- ¿Cómo priorizarías qué refactorizar primero y con qué criterio?

Yo enlistaria todo lo que se debe de refactorizar y los ponderia en base a importancia. Yo considero mas importante todo lo que genera amenazas de seguridad. Luego codigo que genera bugs y rompe el sistema. Luego codigo que genera problemas de rendimiento. Tambien aprovechar los nuevos features para corregir partes del codigo que se estan tocando.

- ¿Cómo convencerías a un product manager de reservar tiempo para deuda técnica en cada sprint?

Yo le mostraria el impacto/riesgo que tienen las deudas. Tambien le diria que tener el codigo refactorizado nos ayuda a agilizar el desarrollo de las nuevas features.

- ¿Qué estrategia usarías para agregar tests sin romper el sistema existente?

Mientras vamos separando la logica de los controlladores y moviendo todo a su lugar, haremos pruebas unitarias sobre los recien movidos. Esto evita que hagamos tests sobre codigo que vamos a mover en algun momento o que no deberia de estar donde esta. Asi tambien aumentaremos el coverege con tests utiles y centrados.

# Pregunta 3 — Mentoring

- ¿Cuál es el problema con este enfoque en producción?
El problema es que traemos todos los creditos aunque solo necesitamos el maximo por cliente. Esto puede ocasionar probelmas cuando tenemos muchos registros ya que el response time sera muy grande y nuestra applicacion se sentira lenta.

- Escribe la query SQL correcta que le mostrarías al junior.

SELECT clientId, MAX(monto) FROM loan GROUP BY clientId

- ¿Cómo enmarcarías este feedback para que sea constructivo y no desmotivante?

Le diria que su solucion si funciona y nos regresa informacion correcta, pero que aveces debemos de buscar formas de optimizar nuestra solucion base. Siempre debemos de comparar la cantidad de datos que estamos manejando contra la cantidad de datos que realmente necesitamos. 

# Pregunta 4 — Decisión de arquitectura

- Argumenta a favor y en contra de cada opción.
    - Usar Procedures
        
        Los procedures puede hacer que la logica esta mas directamente enlazada con los datos y es sumamente facil llamar un procedure.

        Pero los procedures se usan mas cuando se trata de Querys de SQL muy completa y esto es mas logica de negocio que otra cosa. Los procedures son masa dificiles de testear y versionar. 
    
    - Usar servicio de Node

        Nuestros desarrolladores tendran mas accesibilidad para hacer testeo y cambiar la logica si es necesario para estas funciones.

        Lo unico en contra es de que se tendra que extraer la data e mappearlo para que nos sea util de usar con estas funciones.

- ¿Cuál elegirías para este sistema de créditos y por qué?

    Yo elegiria tener la logica en un servicio de Node. Esta logica podria cambiar en algun momento y es sumamente mas facil manejarlo de este lado. Dejaria los procedures para logica o procesos meramente de SQL y no logica de negocio.


- ¿Cambia tu respuesta si el equipo tiene DBA dedicado vs si solo hay desarrolladores backend?

    No, mi decision no va en base a equipo y capacidad. Sino que es basado en donde deberia de estar cada parte del sistema, yo pienso que esa logica no la deberia de manejar la base de datos. 
