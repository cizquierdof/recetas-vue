import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api/shop'
import cart from './cart';
import products from './products';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    cart,
    products
  },
  state: {
    checkoutError: false,
  },
  mutations: {
    setCheckoutError(state, error) {
      state.checkoutError = error;
    },
  },
  actions: {
    checkout({ commit, state }) {
      api.buyProducts(
        state.cart.cart,  //este ya no está en state, lo hemos trasladado a state.cart
        () => {
          commit('emptyCart');
          commit('setCheckoutError', false);
        },
        () => {
          commit('setCheckoutError', true);
        }
      )
    }
  },
  getters: {},
})
