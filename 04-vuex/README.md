# 01-vuex

Para la gestión del estado, Vue.js proporciona varios métodos, props, buses, eventos. Vuex es una librería oficial que permite el control del estado global al estilo de Redux. El estado de la aplicación se mantiene en un solo sitio, el *store* y desde ahí se distribuye a todas partes.

En esta receta seguimos paso a paso el propio ejemplo oficial de vuex para demostrar su funcionamiento.

## Funcionamiento básico

- Con VueCli: al hacer vue create [aplicacion] si escogemos la configuración manual podemos elegir vuex como una de las dependencias, este es el método más sencillo ya que además de registrar la dependencia, ya inyecta vuex en el archivo main.js y crea el store. En seguida veremos que es el store.
- De forma manual: *npm install vuex*. En este caso además deberemos inyectar vuex en main.js:

```javascript
import Vue from 'vue'
import App from './App.vue'
import store from './store' //<--

Vue.config.productionTip = false

new Vue({
  store,  //<--
  render: h => h(App)
}).$mount('#app')
```

y crear el store, Vuex se basa en mantener un POJO como única fuente de verdad para el estado. Este objeto se guarda en el Store. Cuando se instala vuex manualmente hay que generarlo, normalmente se hace en una carpeta *store* y dentro de un archivo index.js,  En su estado original tiene el siguiente aspecto:

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```

## Estado

Con vuex, en vez de tener los datos en el componente, los guardamos aquí. Imaginemos que mantenemos una base de datos de tres artículos con los siguientes datos id, nombre, precio y cantidad de inventario. Los guardaríamos así dentro del store:

```javascript
  state: {
    products:[
      {id:1, name: 'pelota', price: 25.3, inventory: 3},
      {id:1, name: 'gorra', price: 37.9, inventory: 4},
      {id:1, name: 'gafas', price: 203.2, inventory: 2},
    ]
  },

```

A partir de aquí cualquier componente puede acceder a estos datos del estado. Veamos como se hace.

el diagrama de vuex es el siguiente:

![vuex](vuex.png)

Ahora para acceder a los productos desde un componente tenemos que crear una propiedad computada que devuelva los componentes desde el estado. En el ejemplo ilustrado abajo queremos mostrar la lista de productos anterior recorriendo el array productos; La propiedad computada es una función que devuelve el array de productos utilizando la variable *$store* que es la que accede al store.

```javascript
    <ul>
      <li v-for="product in products" :key="product.id">
        {{ product.title }} | {{ product.price }}
        <i>{{ product.inventory }}</i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "appProductList",
  created() {},
  computed: {
      products(){
          return this.$store.state.products
      }
  },
};
</script>
```

El nombre del método suele coincidir con el de los datos del store, pero no es obligatorio. Esto habría funcionado igual si al método le hubiéramos llamado *cosas* y en la vista recorriéramos *cosas* en vez de *productos*.

Así es como el componente recoge los datos del estado, además como es un elemento computado, cada vez que el origen de datos cambie, también lo hará la vista.

Sin embargo si nos fijamos en el gráfico de como funciona vuex, veremos que el componente no modifica el estado, solo lo lee, así que ¿cómo podemos modificar el estado?

## Mutaciones

Mirando otra vez el diagrama, la única forma de modificar el estado es a través de mutaciones. Las mutaciones son métodos que modifican alguna propiedad del estado, estas mutaciones se llamaran posteriormente para hacer los cambios en el estado.
Por ejemplo para cambiar *products* en el estado, añadiriamos en *store*:

```javascript

      { id: 3, title: "Charli XCX - Sucker CD", price: 19.99, inventory: 5 }
    ]
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    }
  },

```

veamos como funciona esto.

Supongamos que ya no tenemos los datos guardados en el store, sino que los recuperamos de una api cualquiera, en nuestro ejemplo mockeamos esta api en la carpeta api que tiene un shop.js con el siguiente contenido:

```javascript
/**
 *  Mocking client-server processing
 */
const _products = [
  { id: 1, title: "iPad 4 Mini", price: 500.01, inventory: 2 },
  { id: 2, title: "H&M T-Shirt White", price: 10.99, inventory: 10 },
  { id: 3, title: "Charli XCX - Sucker CD", price: 19.99, inventory: 5 }
];

export default {
  getProducts(cb) {
    setTimeout(() => cb(_products), 100);
  },

  buyProducts(products, cb, errorCb) {
    setTimeout(() => {
      // simulate random checkout failure.
      Math.random() > 0.5 || navigator.userAgent.indexOf("PhantomJS") > -1
        ? cb()
        : errorCb();
    }, 100);
  }
};
```

vemos que consta del array de productos que teníamos inicialmente y de un par de métodos que simulan transacciones de la api.

ahora desde el componente, podemos importar la api y ejecutar el método que nos trae los datos (supuestamente externos) e invocamos el método que trae los datos, y hacemos un commit de la mutación *setProducts* a la que le enviamos los datos que nos hemos traido.

```javascript
<script>
import api from '../api/shop' //traemos la api

export default {
  name: "appProductList",
  // invocamos el método parra importar los datos
  created() {
      api.getProducts(products=>{
          this.$store.commit('setProducts', products)
      })
  },
  computed: {
      products(){
          return this.$store.state.products
      }
  },
};
</script>
```

Ahora ya no nos hacen falta los datos locales de *store*:

```javascript
export default new Vuex.Store({
  state: {
    products: []
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    }
  },
```

El resultado que obtenemos es el mismo, solo que ahora los datos los traemos de fuera y los inyectamos en el estado con una mutación.

## Acciones

Bueno, lo visto hasta ahora no es incorrecto, pero tampoc tiene mucho sentido si vamos a tener un único sitio para el estado, que descarguemos los datos desde el componente. Lo normal si vamos a utilizar vuex, es hacer las llamadas a la api desde el store, de eso se encargan las acciones. Sigue siendo válido el que sean las mutaciones y solo ellas las que modifiquen el estado, pero son las acciones las que ejecutan llamadas asíncronas y demás procesos para trerse los datos, posteriormente la propia acción lanza una mutación que cambie el estado con los nuevos datos.

las acciones son métodos que reciben un objeto *context* que contiene todos los métodos/propiedades del estado, uno de los cuales es el commit, asi que para recuperar los productos :

```javascript
export default new Vuex.Store({
  state: {
    products: []
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    }
  },
  actions {
    getProducts({ commit }){
      //devolvemos una promesa porque puede ser asincrono
      return new Promise(resolve=>{
        //llamamos a la api que nos recupera  products
        api.getProducts(products=>{
          //lanzamos la mutación que actualiza el estado
          commit('setProducts',products);
          resolve()
        });
      })
    }
  }
```

y ya podemos quitar la llamada de la api del componente y sustituirla con la acción, la cual vamos a llamarla de forma asincorna, cuando nos responda actualizaremos el estado.

```javascript

<script>
// ya no necesitamos la api
//import api from '../api/shop'

export default {
  name: "appProductList",
  async created() { // hacemos asincrona
      // api.getProducts(products=>{
      //     this.$store.commit('setProducts', products)
      // })
      try {
        //esperamos que nos responda la acción
        await this.$store.dispatch('getProducts')
      } catch(error){
        console.error(error);
      }
  },
  computed: {
      products(){
          return this.$store.state.products
      }
  },
};
```

Con esto obtendremos el mismo resultado que hasta ahora pero recuperamos los datos con la api pero desde el store con una acción.

## Getters

Ahora que ya podemos  recuperar los datos desde el store, quizá queramos obtener dinamicamente alguna propiedad del estado modificada pero sin cambiar realmente los datos originales. Por ejemplo queremos obtener los productos que tengan cantidad de stock. Esto lo podemos hacer con getters. Podríamos sustituir en el computed del componente y en vez de escuchar a todos los productos, escuchamos solo a estos. Esto se hace:

en el store creamos el getter:

```javascript
  },
  getters: {
    //obtener solo los productos con valor de inventory > 0
    productsOnStock(state) {
      return state.products.filter(
        product => { return product.inventory > 0 }
      )
    }

  },
  modules: {
  }
```

y en el componente cambiamos el computed:

```javascript
  computed: {
      products(){
        // ya no escuchamos a todos los productos
          //return this.$store.state.products

          // ahora escucahomos solo al getter de productos con stock
          return this.$store.getters.productsOnStock;
      }
  },
```

Si ahora vamos a /api/shop.js y ponemos a cero alguno de los valores de inventory de cualquiera de los productos, este ya no aparece en listado del componente.

En el ejemplo se aplican unas cuantas mutaciones, acciones y getters con los que manejaremos un carrito de la compra. El propio código está documentado explicando brevemente que es lo que hace.

## Uso de v-model con vuex

Imaginemos que queremos poder editar el título de los productos de la lista, podríamos modificar el componente AppProductList para que al hacer click sobre un elemento nos habriera un formulario donde poder editar el elemento:

```javascript
      <li @click="selectProduct(product)" v-for="product in products" :key="product.id">
        {{ product.title }} | {{ product.price }}

    ...

      },
  methods: {
    addToCart(product) {
      this.$store.dispatch('addProductToCart', product);
    },
    //deja en el estado el elemento que queremos modificar
    selectProduct(product){
      this.$store.commit('setSelectedProduct', product)
    }
  },

```

el formulario sería el componente AppProductList que contiene lo siguiente:

```javascript
<template>
  <div>
    <hr />
    <input type="text" v-model="selectedProduct.title" placeholder="Selecciona producto" />
  </div>
</template>

<script>
export default {
  name: "AppProductEdit",
  computed: {
    selectedProduct(){
      return this.$store.getters.selectedProduct;
    },
```

Esto está modificando el elemento selectedProductList de forma directa en vez de a través de uan mutación, lo cual está prohibido en vuex.

Una de las posibles soluciones consiste enutilizar una propiedad computada dividida en una parte getter y otra setter, con el get obtenemos el valor desde vmodel mientras que con la partes setter, se lanza una mutación que se encarga de modificar el correspondiente estado desde dentro.

Para ello en el componente AppProductEdit hariamos:

```javascript
<template>
  <div>
    <hr />
    <input type="text" v-model="title" placeholder="Selecciona producto" />
  </div>
</template>

<script>
export default {
  name: "AppProductEdit",
  computed: {
    // selectedProduct(){
    //   return this.$store.getters.selectedProduct;
    // },
    //propiedad computada que contiene el getter y el setter
    title:{
      get(){
       return this.$store.getters.selectedProduct.title;
      },
      set(value){
        this.$store.commit('editProduct', {title: value})
      }
    }
```

y en el store tendremos que hacer una mutación que modifique la lista de productos con los nuevos datos:

```javascript

    //mutación para editar el título del producto
    editProduct(state, data){
      //buscar el índice del producto
      const index = state.products.findIndex(product=>product.id===state.selectedProduct.id)

      //componer el producto en base a las propiedades cambiadas
      const product= Object.assign({}, state.products[index], data)

      //actualizar de forma reactiva
      Vue.set(state.products, index, product)

    }
```

## Getters como funciones

los getters no pueden acetar parámetros de forma directa, sin embargo si que pueden devolver funciones que si que los aceten, de esta forma se pueden utilizar getters pasándoles parámetros. Por ejemplo imaginemos que queremos qe cuando solo quede un artículo en stock, se cambie la clase para que aparezca en rojo y nos avise de que está apunto de agotarse.

En AppProductList hacemos:

```html
      <li :class="{'sold-out': $store.getters.nearlySoldOut(product.id)}"

...

.sold-out{
  background-color: lightpink;
  border: solid red;
  margin: 3px;
}
</style>
```

lo que aplica la clase .sold-out a la línea de lista cuando el getter nearlySoldOut, al que pasamos el id del producto, como parámetro devuelva true.

Este getter comprobará si un producto está por debajo de dos unidades. Lo añadimos al store.

```javascript
    nearlySoldOut(state) {
      // el getter devuelve una función a la que sí le pasamos un parámetro, el id del producto
      // a punto de agotarse
      return id => {
        return state.products.find(product => product.id === id).inventory < 2
      }
    }
```

## Map Helpers

Los helpers son enlaces entre las propiedades del store y las propiedades del componente local. Sirven para simplificar la escritura de código.

### Aplicación de helpers en AppProductList

en este componente tenemos una llamada a un getter:

```javascript
  computed: {
    products() {
      return this.$store.getters.productsOnStock;
    },
  },
```

para utilizar el helper primero tenemos que importarlo en el componente desde vuex:

```javascript
<script>
import {mapGetters} from 'vuex';
```

y después hay que asociarlo, como solo tenemos un getter, podemos sustituiro todo por:

```javascript
  computed: mapGetters({
    products: 'productsOnStock'
  })
```

donde 'mapeamos' la propiedad del state, en este caso products, con el getter correspondiente que es productsOnStock. Y esto funciona exáctamente igual que el código original, solo que es más corto.

Si la propiedad local tiene el mismo nombre que el getter el mapeo es aun más sencillo, por ejemplo vamos a cambiar el nombre de la propiedad local para que se llame igual que el getter. donde teníamos:

```javascript
@click="selectProduct(product)" v-for="product in products" :key="product.id">
```

ponemos ahora

```javascript
@click="selectProduct(product)" v-for="product in productsOnStock" :key="product.id">

```

y ahora en el componente el mapeo es solo:

```javascript
  computed: mapGetters(['productsOnStock'])
```

De la misma amnera que para los getters, podemos utilizar helpers para las mutaciones, para las occiones o incluso para el state. Siguiendo con el componente AppProductList, si aplicamos todos los helpers pasamos de:

```javascript
  },
  methods: {
    addToCart(product) {
      this.$store.dispatch('addProductToCart', product);
    },
    selectProduct(product){
      this.$store.commit('setSelectedProduct', product)
    }
  },
  computed: {
    productsOnStock() {
      return this.$store.getters.productsOnStock;
    },
  },
};
```

a esto:

 ```javascript
     }
  },
  methods: {
    ...mapActions({
      addToCart: 'addProductToCart'
    }),
    ...mapMutations({
      selectProduct: 'setSelectedProduct'
    })
  },
  computed:{
    ...mapGetters(['productsOnStock'])
    }
};
 ```

que deja un código algo más corto. Como puede verse el ahorro no es enorme, por lo que la utilización de esto se hace conveniente cuando se observe que se está llamando una y otra vez a los mismos getters, actions, etc. Para esos casos vale la pena, en el resto es perfectamente aceptable utilizar el método normal.

## Módulos

A medida que aumenta la complejidad de la aplicación, el store puede llegar a crecer mucho haciendose muy dificil de mantener, por eso vuex prevee la posibilidad de repartir la lógica en varios submódulos. En este ejemplo dejaré un archivo /store/index_original.js en el estado en el que se encuentra actualmente con el fin de que se pueda consultar apra seguir las explicaciones anteriores. Después voy a separar els tore en tres módulos uno el index.js común, otro para el carrito que llamaré cart.js y otro para productos products.js.

A continuació limpio el index.js de comentarios lo dejo bien formateado y por último localizo los elementos que corresponden con el carrito y los que corresponden con los productos y los paso a sus respectivos archivos.

También hay que importar los módulos en el store y declararlos. En products.js también ahcemos uso de la api y de Vue, así que allí también hay que importarlos.

En este punto ya ccompila, ppero seguiremos teniendo errores, porque las cosa ya no están en el mismo sitio. En index.js *store.cart* es ahora *store.cart.cart*.

En cart.js también tenemos un problema en:

```javascript
        getProductsOnCart(state) {
            return state.cart.map(item => {
              const product = state.products.find(product => product.id === item.id)
              return {
                title: product.title,
```

*state.products* ya no está en el estado local, debe buscarlo en el estado principal y para ello debe conectarlo con el getter, lo que se hace es añadir un tercer parámetro, el segundo es getters que no lo utiliza pero hay que ponerlo porque es el tercero el que nos interesa *rootState*, de hecho el segundo parámetro lo puedes llamar como te de la gana porque no le va a hacer ni caso, aunque ya puestos ponle getters que es lo que corresponde:

```javascript
    getters:{
        getProductsOnCart(state, getters, rootState) {
            return state.cart.map(item => {
              const product = rootState.products.products.find(product => product.id === item.id)
              return {
                title: product.title,
```

ahora products lo buscamos en rootState.products y ya no debería dar ningún problema, la aplicación funcionará como antes pero con el store repartido en varias instancias.

## Fin

Vuex puede llegar a ser una herramienta que nos simplifique la vida cuando la aplicación empiece a hacerse grande, cumple la misma función que vuex pero es bastante más fácil de aplicar.
