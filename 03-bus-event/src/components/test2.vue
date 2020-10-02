<template>
  <h1>{{header}}</h1>
</template>

<script>
import bus from '../bus'
export default {
    name: 'test2',
    props: ['header'],
created() {
    bus.$on('cambia:header', event =>{
        this.header = event
    })
},


}
</script>

<style>

</style>