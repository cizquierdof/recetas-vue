# bus-event

Comunicar dos componentes no relacionados directamente se hace transmitiendo de hijos a padres un evento a través de toda la rama, lo cual, cuando se tiene una estructura compleja puede ser un verdadero embrollo. Vue propone una manera más simple de hacer esto mediante un *bus* de eventos. Este no es más que una instancia vacía de vue que se puede utilizar para emitir eventos o escucharlos.

El bus normalmente se instancia en un un fichero bus.js aparte:

```javascript
import Vue from 'vue';

const bus = new Vue();

export default bus;
```

después un componente puede utilizarlo para lanzar un evento, por ejemplo *emmiterComp.vue:

```vue
<template>
  <h1 @click="changeHeader">{{ header }}</h1>
</template>

<script>
import bus from "../bus";

export default {
  name: "emisor",
  props: {
    header: {
      type: String,
    },
  },
  methods: {
    changeHeader() {
      this.header = "header cambiado";
      bus.$emit("cambia:header", "header cambiado");
    },
  },
};
</script>

<style></style>
```

y el componente que lo necesita está escuchando

```vue
<template>
  <h1>{{ header }}</h1>
</template>

<script>
import bus from "../bus";
export default {
  name: "receptor",
  props: ["header"],
  created() {
    bus.$on("cambia:header", (event) => {
      this.header = event;
    });
  },
};
</script>

<style></style>
```

