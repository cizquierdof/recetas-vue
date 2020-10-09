<template>
  <div id="app">
    <emisor v-bind:header='header'/>
    <receptor v-bind:header='header'/>
  </div>
</template>
<script>
import emisor from './components/emmiterComp'
import receptor from './components/receiverComp'
export default {
  name: 'App',
  components: {
    emisor,
    receptor,
  },
  data() {
    return {
      header:'header inicial'
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
