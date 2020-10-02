<template>
  <div id="app">
    <div class="container">

    <appProductList/>
    <appShoppingCart/>
    <appProductEdit/>
    </div>
  </div>
</template>

<script>
import appProductList from './components/AppProductList';
import appShoppingCart from './components/AppShoppingCart';
import appProductEdit from './components/AppProducctEdit';

export default {
  name: 'App',
  components: {
    appProductList,
    appShoppingCart,
    appProductEdit
  }
}
</script>

<style>
#app {
  max-width: 800px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  margin-left: auto;
  margin-right: auto;
}
.container{
  display: flex;
  justify-content: space-between;
  background-color: lavender;
  flex-wrap: wrap;
}
.container > *{
  flex-basis: 49%;
}

#app div:last-of-type{
  flex-basis: 100%;
}
</style>
