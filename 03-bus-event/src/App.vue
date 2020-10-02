<template>
  <div id="app">
    <test v-bind:header='header'/>
    <test2 v-bind:header='header'/>
  </div>
</template>
<script>
import test from './components/test'
import test2 from './components/test2'
export default {
  name: 'App',
  components: {
    test,
    test2,
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
