# bus-event

Cuando se quieren comunicar dos componentes de Vue que no son padre e hijo, el método que se propone por defecto es emitir desde el hijo un evento que recoge el padre y la reacción se pasa a todas las ramas relacionadas. Esto es correcto y funciona, pero hay una forma descubierta por la comunidad de usuarios que es más efectiva.

Consiste en utilizar una instancia de Vue intermedia, un bus. Éste puede emitir y escuchar eventos de componentes sin necesidad del padre.
