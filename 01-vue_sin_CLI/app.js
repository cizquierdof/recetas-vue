console.log('App. js cargado');

const app = new Vue({
    el: ".app",
    // data es el equivalente al estado de react
    data: {
        msg: " Hola Carlos!",
        rawHtml:'<span style="color:red">Rojo</span>',
        image: 'https://victorroblesweb.es/wp-content/uploads/2017/03/vuejs2-victorroblesweb.jpg',
        primero: 0,
        segundo: 0,
        tercero: 0,
        cuarto: 0,
    },


    methods: {
        holaMetodo: function () {
            return 'Este responde mi método'
        },
        msgMayusculas: function () {
            return this.msg.toUpperCase()
        },
        cambiarMsg: function () {
            this.msg = 'Nuevo mensaje!!!'
        },
        destruir: function () {
            this.$destroy()
        },
        incrementaPrimero: function () {
            this.primero++
        },
        incrementaSegundo: function () {
            this.segundo++
        },
        incrementaTercero: function () {
            this.tercero++
        },
        incrementaCuarto: function () {
            this.cuarto++
        },
    },
    beforeCreate() {
        console.log('Antes de crear');
    },
    created() {
        console.log('Se ha creado');
    },
    beforeMount() {
        console.log('antes de montar');
    },
    mounted() {
        console.log('montado');
    },
    beforeUpdate() {
        console.log('antes de actualizar');
    },
    updated() {
        console.log('actualizado');
    },
    beforeDestroy() {
        console.log('antes de destruir');
    },
    destroyed() {
        console.log('destruido');
    },
    computed: {
        suma: function(){
            return this.primero+this.segundo+this.tercero+this.cuarto
        }
    },

})