<template>
  <h1 @click="changeHeader">{{header}}</h1>
</template>

<script>
import bus from '../bus';

export default {
    name: 'test',
    props: {
      header:{
      type: String
    }
    },
    methods:{
      changeHeader(){
        this.header ='header cambiado';
        bus.$emit('cambia:header', 'header cambiado');
      }
    }

}
</script>

<style>

</style>