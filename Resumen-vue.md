# Apuntes: conceptos básicos de Vue.js

## Instalación

### Inclusión directa

En index.html añadir:

```html
<head>
    ...
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    ...
</head>
<body>
    ...
    <div class='app'>
        <!-- A partir de aquí insertamos el template -->
        <h1>
            {{msg}}  
        </h1>
    </div>
    ...
    <!--La última línea del body contiene la lógica de la app-->
   <script src="./app.js"></script>
</body>
```

En el archivo JavaScript instanciamos vue y le pasamos un objeto de propiedades que incluye datos y lógica de negocio

```javascript
const app = new Vue({
    el: '.app',
    data: {
        msg: 'Hellow World!',
    },
    methods: {},
    //funciones del ciclo de vida
    created(){
        console.log('Creado');
    },
    mounted(){
        //cuando se monta
    },
    ...
})
```

### Cli

Para aplicaciones complejas usar el cliente oficial, si no está instalado: ```npm install -g @vue/cli```

o ```yarn global add @vue/cli```

Una vez instalado para crear un proyecto: ```vue create mi-proyecto``` también puede utilizarse un cliente UI que se representará en el navegador por defecto mediante ```vue ui```. En ambos casos nos dará una serie de opciones de configuración como son la instalación del router, eslint, vuex, etc.

## Ciclo de vida

![Ciclo de vida de una Instancia de Vue](https://es.vuejs.org/images/lifecycle.png)

## Sintaxis de template

### Interpolaciones

#### Texto

```html
<span>Mensaje: {{msg}}</span>
```

el valor de *msg* se sustituirá dentro de las dobles llaves (conocidos como mostachos)

#### HTML

Supongamos que tenemos una propiedad de data ```rawHtml:'<span style="color:red">Esto es rojo</span>'```

podemos poner en el template la directiva *v-html* que representará el contenido de la propiedad como html y no como texto

```html
<p>
    Lo siguiente se escribirá en rojo: <span v-html='rawHtml'></span>
</p>
```

#### Expresiones 

Dentro de los enlaces de datos se pueden utilizar expresiones válidas de JavaScript

```javscript
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div v-bind:id="'list-' + id"></div>
```

### Directivas

Aplican efectos secundarios al DOM cuando cambia el valor de su expresión. ver más información en https://es.vuejs.org/v2/api/#Directivas

#### v-if

```html
<p v-if='visible'>
    Párrafo con visibilidad condicionada
</p>
```

El párrafo se renderiza si el valor de *visible* es true.

se puede hacer para un grupo entero:

```html
<template v-if="ok">
  <h1>Título</h1>
  <p>Párrafo 1</p>
  <p>Párrafo 2</p>
</template>
```

#### v-else

Siempre debe seguir a un *v-if* y es lo que se debe renderizar alternativamente si el anterior no lo hace

#### v-else-if

#### v-show

Muestra un elemento condicionalmente:

```html
<h1 v-show="ok">Hola!</h1>
```

la diferencia con v-if es que v-show sí que renderiza el elemento pero lo muestra o no, v-if lo que es condicional es el propio renderizado.

#### v-bind

Enlazar una propiedad.

```javascript
const app = new Vue(
    {
        el: ".vue",
        data: {
         image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"
```

```html
<img v-bind:src="image" alt="" width="200px">
```

se puede abreviar como ```:src```

#### v-on

Escucha los eventos del DOM

```html
<!-- método como manejador -->
<button v-on:click="doThis"></button>

<!-- declaración en línea (inline) -->
<button v-on:click="doThat('hello', $event)"></button>

<!-- abreviación -->
<button @click="doThis"></button>

<!-- detener la propagación -->
<button @click.stop="doThis"></button>

<!-- prevenir el comportamiento por defecto -->
<button @click.prevent="doThis"></button>

<!-- prevenir el comportamiento por defecto sin expresión alguna -->
<form @submit.prevent></form>

<!-- modificadores en cadena -->
<button @click.stop.prevent="doThis"></button>

<!-- modificador de tecla utilizando keyAlias -->
<input @keyup.enter="onEnter">

<!-- modificador de tecla utilizando keyCode -->
<input @keyup.13="onEnter">

<!-- el evento click será lanzado a lo sumo una vez -->
<button v-on:click.once="doThis"></button>

<!-- sintaxis de objeto (2.4.0+) -->
<button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
```

#### v-for

Renderiza el elemento o plantilla múltiples veces basado en la fuente de información. El valor de la directiva debe utilizar la sintaxis especial `alias in expression` para proveer un alias para el elemento actual en el cual se está iterando. 

La fuente de información puede ser cualquier iterable como un array, un objeto, etc.

```html
<div v-for="item in items">  {{ item.text }}</div>
```

Alternativamente, usted también puede especificar un alias para índice (o la clave si es utilizado con un Objeto):

```html
<div v-for="(item, index) in items"></div>
<div v-for="(val, key) in object"></div>
<div v-for="(val, key, index) in object"></div>
```

El comportamiento por defecto de `v-for` intentará corregir los elementos *in-place* sin moverlos. Para forzar un reordenamiento de elementos, usted debe proveer una pista de ordenamiento con el atributo especial `key`:

```php+HTML
<div v-for="item in items" :key="item.id">
  {{ item.text }}
</div>
```

se pueden usar además argumentos para la clave y el índice

```html
<div v-for="(value, key, index) in object">
  {{ index }}. {{ key }}: {{ value }}
</div>
```

```javascript
 data: {
    object: {
      primerNombre: 'John',
      apellido: 'Doe',
      edad: 30
    }
  }
```

Resultado:

```shell
0. primerNombre: Jhon
1. apellido: Doe
2. edad: 30
```

Es conveniente proporcionar un valor único a *key* por lo general será el id del item

```html
<div v-for="item in items" :key="item.id">
  <!-- content -->
</div>
```

v-for también se puede usar con un entero para repetir una plantilla varias veces:

```html
 <span v-for="n in 10">{{ n }}</span>
```

esto devuelve: 12345678910



#### v-model

## Propiedades computadas y observables

### Propiedades computadas y métodos

El template vue admite expresiones, pero estas deben limitarse las lógicas complejas ya que si no, acabaremos teniendo un código poco mantenible. Cuando se necesiten expresiones más complejas se deben usar propiedades computadas o métodos.

```html
<div id="example">
  <p>Mensaje original: "{{ message }}"</p>
  <p>Mensaje invertido computado: "{{ computedReversedMessage }}"</p>
  <p>Mensaje invertido método: "{{ reversedMessage() }}"</p>
</div>
```
```javascript
var vm = new Vue({
    el: "#example",
    data: {
        message: "Hola",
    },
    computed: {
        // un getter computado
        computedReversedMessage: function () {
            // `this` apunta a la instancia vm
            return this.message.split("").reverse().join("");
        },
    },
    methods: {
        reversedMessage: function () {
            return this.message.join(' ');
        },
    }
});
```

**Nota** el método computado devuelve una propiedad y el método es una función a la que hay que llamar como tal

Las propiedades computadas solo se ejecutan cuando varía alguna de sus dependencias, mientras que los métodos se ejecutan siempre que son llamados. Aunque los resultados que se obtienen son los mismos utilizaremos un tipo u otro en función de esto.

### Observables watch

La forma genérica de observar cambios de datos en Vue es la propiedad *watch*

```html
<div id="demo">{{ fullName }}</div>
```

```javascript
var vm = new Vue({  
    el: '#demo',  
    data: {    
        firstName: 'Foo',    
        lastName: 'Bar',    
        fullName: 'Foo Bar'  
    },  
    watch: {    
        firstName: function (val) {      
            this.fullName = val + ' ' + this.lastName    
        },    
        lastName: function (val) {      
            this.fullName = this.firstName + ' ' + val    
        }  
    }
})
```

este código observará los cambios en *^firstName* y *lastName* y modificará en *fullName* consecuencia. En la mayoría de los casos es menos engorroso utilizar una propiedad computada. Lo siguiente hace lo mismo de forma más sencilla:

```javascript
var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    fullName: function () {
      return this.firstName + ' ' + this.lastName
    }
  }
})
```

Sin embargo en situaciones en donde la respuesta es asíncrona o costosa es preferible utilizar watch

## Clases y estilos

### Enlace de clases HTML

Asignación dinámica de clases, se pueden asignar las clases dinámicamente:

```html
<div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
```

Pasar una lista de clases:

```html
<div v-bind:class="[activeClass, errorClass]"></div>
```

```javascript
data: {  
    activeClass: 'active',  
        errorClass: 'text-danger'
}
```

Activación condicional

```html
<div v-bind:class="[isActive ? activeClass : '', errorClass]"></div>
```

### Bindeo de estilos

#### Sintaxis de objeto

```html
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

```javascript
data: {  activeColor: 'red',  fontSize: 30}
```

o también enlazando directamente un objeto de estilo:

```html
<div v-bind:style="styleObject"></div>
```

```javascript
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

o pasar un array de objetos de estilo:

```html
<div v-bind:style="[baseStyles, overridingStyles]"></div>
```

## Eventos

Para escuchar los eventos DOM se utiliza la directiva v-on

```html
 <button v-on:click="counter += 1">Add 1</button>
```

si la lógica es compleja se pueden utilizar métodos

```html
 <button v-on:click="saludar">Saludar</button>
```

```javascript
  methods: {
    saludar: function (event) {
      // `this` dentro de los métodos apunta a la instancia de Vue
      alert('Hola ' + this.name + '!')
      // `evento` es el evento DOM nativo
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
```

o también

```html
 <button v-on:click="di('hola')">Di hola</button>
```

```javascript
 methods: {
    di: function (mensaje) {
      alert(mensaje)
    }
  }
```

### Modificadores de eventos

```html
<!-- Se detendrá la propagación del evento click. -->
<a v-on:click.stop="hasEsto"></a>

<!-- El evento de enviar ya no volverá a cargar la página. -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- Los modificadores pueden encadenarse -->
<a v-on:click.stop.prevent="hazEsto"></a>

<!-- solo el modificador -->
<form v-on:submit.prevent></form>

<!-- utilizar el modo de captura al agregar el detector de eventos -->
<!-- es decir, un evento dirigido a un elemento interno se maneja aquí antes de ser manejado por ese elemento -->
<div v-on:click.capture="hazEsto">...</div>

<!-- solo activa el controlador si event.target es el elemento en sí -->
<!-- es decir, no de un elemento hijo -->
<div v-on:click.self="hazEso">...</div>

<!-- El evento de clic se activará como máximo una vez. -->
<a v-on:click.once="hasEsto"></a>
```

### Modificadores de teclas

Identificar la tecla que dispara el evento mediante código o alias

```html
<!-- solo llame a `vm.submit ()` cuando el `keyCode` es 13 -->
<input v-on:keyup.13="submit">

<!-- lo mismo que arriba -->
<input v-on:keyup.enter="submit">

<!-- También funciona como abreviacion. -->
<input @keyup.enter="submit">
```

alias de las teclas:

- `.enter`
- `.tab`
- `.delete` (captura ambas teclas “Delete” y “Backspace”)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

También puede [definir alias modificadores de tecla personalizados](https://es.vuejs.org/v2/api/#keyCodes) a través del objeto global `config.keyCodes`:

```javascript
// habilita `v-on:keyup.f1`
Vue.config.keyCodes.f1 = 112
```

Puede usar los siguientes modificadores para activar eventos listeners de raton o teclado solo cuando se presiona la tecla modificadora correspondiente:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta` (tecla Windows o command en Mac)

```html
<!-- Alt + C -->
<input @keyup.alt.67="clear">

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

### Modificador de botón del ratón

- `.left`
- `.right`
- `.middle`

## v-model: binding en formularios

v-model proporciona una forma de enlazar datos bidireccionales en elementos de formulario como *input, textarea y select*

### input

```html
<input v-model="message" placeholder="edíteme">
<p>El mensaje es: {{ message }}</p>
```

### textarea

```html
<span>El mensaje multilínea es:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<br>
<textarea v-model="message" placeholder="agregar múltiples líneas"></textarea>
```

### checkbox

```html
<input type="checkbox" id="checkbox" v-model="checked">
<label for="checkbox">{{ checked }}</label>
```

checkbox múltiples

```html
<div id='example-3'>
  <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">
  <label for="jack">Jack</label>
  <input type="checkbox" id="john" value="John" v-model="checkedNames">
  <label for="john">John</label>
  <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">
  <label for="mike">Mike</label>
  <br>
  <span>Checked names: {{ checkedNames }}</span>
</div>
```

```javascript
data: {
    checkedNames: []
  }
```

### radio

```html
<input type="radio" id="uno" value="Uno" v-model="picked">
<label for="uno">Uno</label>
<br>
<input type="radio" id="Dos" value="Dos" v-model="picked">
<label for="Dos">Dos</label>
<br>
<span>Eligió: {{ picked }}</span>
```

### select

Selección única

```html
<select v-model="selected">
  <option disabled value="">Seleccione un elemento</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<span>Seleccionado: {{ selected }}</span>
```

```javascript
  data: {
    selected: ''
  }
```

Selección múltiple, en este caso *selected* será un array

```html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
<br>
<span>Seleccionados: {{ selected }}</span>
```

Opciones desde un array

```html
<select v-model="selected">
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Seleccionado: {{ selected }}</span>
```

```javascript
data: {
    selected: 'A',
    options: [
      { text: 'Uno', value: 'A' },
      { text: 'Dos', value: 'B' },
      { text: 'Tres', value: 'C' }
    ]
  }
```

## Plugins

Para utilizar plugins de vue:

```javascript
// llamados a `MyPlugin.install(Vue)`
Vue.use(MyPlugin, {pluginOptions:true})

new Vue({
  //... opciones
})
```

## Single file components

En proyectos pequeños se definen los componentes mediante ```vue.component```, seguido de ```new vue({el: '#container'})```. Esto es correcto para proyectos pequeños, pero para proyectos complejos es mejor utilizar componentes de archivo único con extensión .vue

```javascript
<template>
  <div>
    <p>{{ msg }} World!</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "hello",
    };
  },
};
</script>

<style>
p {
  font-size: 2em;
  text-align: º;
}
</style>
```

Este es el tipo de archivos que se van a utilizar cuando se crea un proyecto con vue-cli