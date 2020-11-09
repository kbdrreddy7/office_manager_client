<template>
  <q-layout view="hHh lpR fff">

    <q-header elevated class="bg-primary text-white c">
      <q-toolbar>
       
              <q-btn dense v-if="$q.screen.lt.md" flat round icon="fas fa-bars" @click="left = !left" />
            <q-toolbar-title>
              <q-avatar class="c__avatar" >
                <img :src="logo">
              </q-avatar>
              <span class="c__title" >Durvah</span>
            </q-toolbar-title>

             <q-space v-if="$q.screen.gt.xs" ></q-space>

            <q-input class="c-global-search" dark dense standout v-model="text">
              <template v-slot:append>
                <q-icon v-if="text === ''" name="fas fa-search" />
                <q-icon v-else name="fas fa-times" class="cursor-pointer" @click="text = ''" />
              </template>
          </q-input>

        <q-space></q-space>

        <template v-if="!$q.screen.lt.md"> 

                         <q-btn :no-caps="true" dense flat  v-for="(value,key) in leftMenu" :key="`${value.tab}${value._id}${key}`" >
                              <div class="row items-center no-wrap">
                                 {{value.tab}}
                                <q-icon name="fas fa-caret-down" size="16px" style="margin-left: -2px" />
                              </div>
                                     <q-menu auto-close>
                                        <q-list dense style="min-width: 100px">
                                          <q-item clickable :to="`/${menuItem['url']}`" v-for=" (menuItem,key) in value['items']" :key="`${menuItem['name']}${menuItem['_id']}${key}`" >
                                                  <q-item-section>{{menuItem['name']}}</q-item-section>
                                          </q-item>
                                        </q-list>
                                     </q-menu>
                         </q-btn>
        
    </template>

    <q-space></q-space>
       

        <q-btn round flat :icon=" menu['icon']" v-for="(menu,index) in rightMenu" :key="`${menu['tab']}${menu['_id']}${index}`" >
       
            <q-tooltip>{{menu['tab']}}</q-tooltip>

          <q-menu auto-close>
              <q-list dense style="min-width: 100px">
                <q-item clickable :to="`/${menuItems['url']}`" v-for="(menuItems ,i) in menu['items']" :key="`${menuItems['name']}${menuItems['_id']}${i}`" >
                        <q-item-section>{{menuItems['name']}}</q-item-section>
                </q-item>
              </q-list>
          </q-menu>
        </q-btn>
      
   
     </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay bordered :width="240">
  <template>
      
    <q-list bordered class="rounded-borders">


        <q-expansion-item  v-for="(value,key ) in leftMenu" :key="`${value.tab}${value['_id']}${key}`"
        :label="value.tab"  
          dense-toggle expand-separator

      >
           <q-item clickable v-ripple :to="`/${menuItem['url']}`" 
              
            v-for="(menuItem,key) in value.items" :key="`${key}${menuItem['name']}${menuItem['_d']}`" >       
                <q-item-section>{{menuItem['name']}}</q-item-section>       
         </q-item>
      </q-expansion-item>

    </q-list>
  </template>
    </q-drawer>

    <q-page-container>
      <slot name="page"></slot>
    </q-page-container>

    <q-footer  elevated class="bg-primary text-white c__footer">
      <q-toolbar class="c-footer__content" >
      
        <span >
          &copy; {{new Date().getFullYear()}} Copyright:&nbsp;
          <a target="_blank" href="https://durvah.com"> Durvah IT Consulting </a> &nbsp;&nbsp;
        </span>
         
         <span  >
                Powered By &nbsp; <a target="_blank" href="https://durvah.com"> 
              <img :src="footer" class="c__inline-img" alt="" />&nbsp; Durvah IT Consulting</a>

         </span>

      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      left: false,
      logo:require("../assets/logo-1-min.png"),
      footer:require("../assets/footer.png"),
      search:"",
      text:"",
      menus:
    [
              {
                  "name": "Users","url": "users","icon": "Users",
                  "tab": "Masters","tab_no": 0,"menu_no": 0,"_id":0
              },
              {
                  "name": "Profiles","url": "profiles","icon": "Users",
                  "tab": "Masters","tab_no": 0,"menu_no": 1,"_id":1
              },
              {
                  "name": "Users","url": "users","icon": "Users",
                  "tab": "Masters","tab_no": 0,"menu_no": 3,"_id":2
              },
            
      //-------------------

             {
                  "name": "Users","url": "users","icon": "Users",
                  "tab": "Masters","tab_no": 1,"menu_no": 0,"_id":3
              },
              {
                  "name": "Users","url": "users","icon": "Users",
                  "tab": "Masters","tab_no": 1,"menu_no": 1,"_id":4
              },
              {
                  "name": "Users","url": "users","icon": "Users",
                  "tab": "Masters","tab_no": 1,"menu_no": 3,"_id":5
              },


      //---------------------------------------------

              {
                  "name": "Users","url": "users","icon": "Users",
                  "tab": "Masters","tab_no": 2,"menu_no": 0,"_id":6
              },
              {
                  "name": "Users","url": "users","icon": "Users",
                  "tab": "Masters","tab_no": 2,"menu_no": 1,"_id":7
              },
              {
                  "name": "Users","url": "users","icon": "Users",
                  "tab": "Masters","tab_no": 2,"menu_no": 3,"_id":8
              },

      //----------------------------------------------

            //-------------------

             {
                  "name": "Users","url": "users","icon": "fas fa-user-circle",
                  "tab": "Masters","tab_no": 100,"menu_no": 0,"_id":9
              },
              {
                  "name": "Users","url": "users","icon": "fas fa-user-circle",
                  "tab": "Masters","tab_no": 100,"menu_no": 1,"_id":10
              },
              {
                  "name": "Logout","url": "logout","icon": "fas fa-cog",
                  "tab": "Masters","tab_no": 100,"menu_no": 3,"_id":11
              },
             


      //---------------------------------------------

              {
                  "name": "Users","url": "users","icon": "fas fa-cog",
                  "tab": "Masters","tab_no": 101,"menu_no": 0,"_id":12
              },
              {
                  "name": "Users","url": "users","icon": "fas fa-cog",
                  "tab": "Masters","tab_no": 101,"menu_no": 1,"_id":13
              },
               {
                  "name": "Users","url": "users","icon": "fas fa-user-circle",
                  "tab": "Masters","tab_no": 101,"menu_no": 3,"_id":14
              },



      ],

     
    }
  },
   methods:{
    
   },
  created(){
      let {menus}=this

      let menuObj={}


      for(let menu of menus)
      {
        if(!menuObj[menu.tab_no])
            menuObj[menu.tab_no]={items:[]}
       
        if(menu.menu_no===0)
        {
          menuObj[menu.tab_no]={...menuObj[menu.tab_no],...menu}
        }
        else
        {
           menuObj[menu.tab_no].items.push(menu)
        }

      }

      let leftMenu=[]
      let rightMenu=[]

      for (let menuKey in menuObj)
      {
        if(menuKey<100)
          leftMenu.push(menuObj[menuKey])

        else   rightMenu.push(menuObj[menuKey])
      }

      leftMenu.sort((a,b)=>a.tab_no-b.tab_no)

      rightMenu.sort((a,b)=>b.tab_no-a.tab_no)

      this.leftMenu=leftMenu
      this.rightMenu=rightMenu


  }
}
</script>
<style lang="scss" scoped>

 .c{
   &__title {
          margin-left: 5px;
          @media only screen and (max-width: 1046px) {
          display: none;
        }
      }
 
  &__footer{
    font-size: small;
    a{
      color: whitesmoke;
    }
  }
  &__inline-img{
        margin: 6px 0 -6px 0;
  }
 }


  .side{
   &__menu{
     background-color: rgb(107, 184, 252);
     color: white;
   }
   &__menu-item{
     background-color: white;
     color: black;
   }
 } 
 

</style>