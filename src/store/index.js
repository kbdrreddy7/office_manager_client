import Vue from 'vue'
import Vuex from 'vuex'

import {authModule,globalModule,referenceModule,rootModule} from './modules'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {

  },
  actions: {
     
  },
 
  modules: {
    auth:authModule,
    global:globalModule,
    ref:referenceModule,
    root:rootModule
  }
})
