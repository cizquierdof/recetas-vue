<template>
  <div>
    <h1>Listado de productos</h1>
    <hr />
    <ul>
      <li :class="{'sold-out': $store.getters.nearlySoldOut(product.id)}"
       @click="selectProduct(product)" v-for="product in productsOnStock" :key="product.id">
        {{ product.title }} | {{ product.price }}
        <i>{{ product.inventory }}</i>
        <button @click="addToCart(product)">Añadir</button>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
//import api from '../api/shop'


export default {
  name: "appProductList",
  async created() {
    // api.getProducts(products=>{
    //     this.$store.commit('setProducts', products)
    // })
    try {
      await this.$store.dispatch("getProducts");
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    // addToCart(product) {
    //   this.$store.dispatch('addProductToCart', product);
    // },
    ...mapActions({
      addToCart: 'addProductToCart'
    }),
    //deja en el estado el elemento que queremos modificar
    // selectProduct(product){
    //   this.$store.commit('setSelectedProduct', product)
    // }
    ...mapMutations({
      selectProduct: 'setSelectedProduct'
    })
  },
  // computed: {
  //   products() {
  //     // ya no escuchamos a todos los productos
  //     //return this.$store.state.products

  //     // ahora escuchamos solo al getter de productos con stock
  //     return this.$store.getters.productsOnStock;
  //   },
  // },
  computed:{ 
    ...mapGetters(['productsOnStock'])
    }
};
</script>

<style>
ul {
  text-align: left;
}

.sold-out{
  background-color: lightpink;
  border: solid red;
  margin: 3px;
}
</style>
