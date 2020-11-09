import Vue from 'vue'
import VueRouter from 'vue-router'
import {authService} from '../services'
import store from '../store'

//------------------views
import {   
   HomeView,GlobalView,
  ServiceUserView,TaskView,ATPView,TreatemenstView,
  EvaluationView
} from '../views'


//------------------routes
import {  ServiceUserChildren,AtpChildren,TaskChildren,TreatmentsChildren,
  EvaluationChildren
} from '../views'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'default',
    redirect: '/home'
    
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {

      authService.logout()
      store.dispatch('auth/logout') // mutate the store--> hide navbar
      next('/login')
    }
  },
  
  {
    path: '/login',
    name: 'Login',
    beforeEnter: (to, from, next) => {

      authService.logout()
      store.dispatch('auth/logout') // mutate the store--> hide navbar
      next()
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path:'/task',name:'task',
    component:TaskView,
    children:TaskChildren

  },
  {
    path:'/atp',name:'atp',
    component:ATPView,
    children:AtpChildren

  },

  {
    path:'/treatmentplans',name:'treatmentplans',
    component:TreatemenstView,
    children:TreatmentsChildren

  },
  {
    path:'/treatmentapprovals',name:'treatmentapprovals',
    component:TreatemenstView,
    children:TreatmentsChildren

  },//treatmentevaldtl
  {
    path:'/treatmentevaldtl',name:'evaluation',
    component:EvaluationView,
    children:EvaluationChildren
  },
  {
    path:'/serviceuser',name:'serviceuser',///serviceuser/:componentName?
    component:ServiceUserView,
    children:ServiceUserChildren
  },  
  {path:'/:path/:mode?/:_id?',component:GlobalView,
    beforeEnter:(to,from,next)=>{

      let {path}=to.params

      /* 
        don't forget to keep the below list in global master also
       */
      let paths=['users','profiles']


      if(paths.includes(path))
          return next()

      next('/')
    },
    //children:globalRoutes
  },
  {path:"*",redirect:'/'}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {

    if(from.path===to.path)
        return;




  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  //const authorized = localStorage.getItem('user');
   const authorized= authService.isAuthorized()


   if (authRequired && (!authorized)) {
    return next('/login');
  }
 

   if((!authRequired) && authorized)
     return next('/home') 


  next();
})


export default router
