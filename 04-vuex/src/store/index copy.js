import Vue from 'vue'
import Vuex from 'vuex'
import shop from '../api/shop'
import api from '../api/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products: [],
    cart: [],
    checkoutError: false,
    selectedProduct: {}
  },
  mutations: {
    setProducts(state, products) {
      state.products = products;
    },
    incrementProductQuantity(state, item) {
      item.quantity++;
    },
    decrementProductInventory(state, product) {
      product.inventory--;
    },
    incrementProductInventory(state, item) {
      //encontramos el producto que queremos restituir el inventario
      const product = state.products.find(product => product.id === item.id)

      //añadimos la cantidad que había en el carrito
      product.inventory += item.quantity;
    },
    addProductToCart(state, product) {
      state.cart.push(
        //solo necesitamos guardar en el carrito el id y la catidad
        {
          id: product.id,
          quantity: 1
        }
      )
    },
    removeProductFromCart(state, index) {
      state.cart.splice(index, 1); //eliminanmos un elemento a partir del índice
    },
    emptyCart(state) {
      state.cart = [];
    },
    setCheckoutError(state, error) {
      state.checkoutError = error;
    },
    setSelectedProduct(state, product) {
      state.selectedProduct = product
    },
    //mutación para editar el título del producto
    editProduct(state, data) {
      //buscar el índice del producto
      const index = state.products.findIndex(product => product.id === state.selectedProduct.id)

      //componer el producto en base a las propiedades cambiadas
      const product = Object.assign({}, state.products[index], data)

      //actualizar de forma reactiva
      Vue.set(state.products, index, product)

    }
  },
  actions: {
    //acción para recuperar los productos
    getProducts({ commit }) {
      //devolvemos una promesa porque puede ser asincrono
      return new Promise(resolve => {
        //llamamos a la api que nos recupera  products
        api.getProducts(products => {
          //lanzamos la mutación que actualiza el estado
          commit('setProducts', products);
          resolve()
        });
      })
    },
    //acción para añadir un producto al carrito
    addProductToCart(context, product) {
      // hay inventario?
      if (product.inventory === 0) return;

      //existe el producto en el carrito?
      const item = context.state.cart.find(item => item.id === product.id)

      // Si es así, añadir uno más a la compra
      if (item) {
        context.commit('incrementProductQuantity', item)
      } else {
        //si no es así, añade el producto al carrito
        //esta es la mutación, no la acción con el mismo nombre
        context.commit('addProductToCart', product);
      }

      // restar uno del inventario
      context.commit('decrementProductInventory', product);
    },
    //acción para eliminar producto del carrito
    removeProductFromCart(context, index) {
      //este será el elemento a borrar
      const item = context.state.cart[index]

      //eliminar este elemento del carrito
      context.commit('removeProductFromCart', index);

      //restaurar el inventario
      context.commit('incrementProductInventory', item)

    },
    // accion para aahcer el checkout de la compra
    checkout({ commit, state }) {
      //lsmsmopd a la función de la api que simula una compra
      shop.buyProducts(state.cart,
        // callback de éxito
        () => {
          //mutación para vaciar el carrito
          commit('emptyCart');
          //establecer que no hay errores
          commit('setCheckoutError', false);
        },
        //callback de fracaso
        () => {
          // establecer que no ahy errores
          commit('setCheckoutError', true);

        }
      )

    }
  },
  getters: {
    //obtener solo los productos con valor de inventory > 0
    productsOnStock(state) { 
      return state.products.filter(
        product => { return product.inventory > 0 }
      )
    },
    //obtener los productos del carrito y le añadimos los datos que nos faltan
    // recordar que solo tenemos en el carrito la cantidad y el id del producto
    //precio y nombre lo buscamos de [productos]
    getProductsOnCart(state) {
      return state.cart.map(item => {
        const product = state.products.find(product => product.id === item.id)
        return {
          title: product.title,
          price: product.price,
          quantity: item.quantity
        }
      })
    },
    //obtener el total del carrito
    cartTotal(state, getters) {
      //este getter devuelve un valor en base a otros getters
      return getters.getProductsOnCart.reduce(
        (total, current) => total = total + current.price * current.quantity, 0
      );
    },
    //obtene producto seleccionado
    selectedProduct(state) {
      return state.selectedProduct
    },
    //getter como fución
    nearlySoldOut(state) {
      // el getter devuelve una función a la que sí le pasamos un parámetro, el id del producto
      // a punto de agotarse
      return id => {        
        return state.products.find(product => product.id === id).inventory < 2
      }
    }

  },
  modules: {
  }
})
