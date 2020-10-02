<template>
  <div>
    <h1>Carrito</h1>
    <hr />
    <ul>
      <li v-for="(item, $index) in cartItems" :key='item.id'>
          {{item.title}} ({{item.quantity}})
          <button @click='removeItem($index)'>Del</button>
      </li>
    </ul>
    <button v-if="cartItems.length" @click="checkout">Checkot</button>
    <hr>
    <h2>Total: {{cartTotal}}</h2>
    <div v-if='$store.state.checkoutError'>
      <p>Error procesando los productos...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "appShoppingCart",
  computed: {
      cartItems(){
          return this.$store.getters.getProductsOnCart
      },
      cartTotal(){
          return this.$store.getters.cartTotal;
      }
  },
  methods: {
      removeItem(index){
          this.$store.dispatch('removeProductFromCart', index);
      },
      checkout(){
        this.$store.dispatch('checkout');
      }
  }
};
</script>

<style scoped>
ul {
  text-align: left;
}
</style>
