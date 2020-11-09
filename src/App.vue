<template > 
       <component v-bind:is="authorized?'main-layout':'blank-layout'" >
            <template v-slot:page>
                <router-view  ></router-view>
          </template>
     </component>
</template>

<script>
import { mapGetters,mapActions } from 'vuex'
import { MainLayout,  BlankLayout } from './layouts'

export default {
  name: 'LayoutDefault',
  meta:{
     title: 'Office Manager',
  },

  components: {
    'main-layout':MainLayout,
    'blank-layout':BlankLayout
  },

  data () {
    return {
      leftDrawerOpen: false
    }
  },
  computed:{
    ...mapGetters('auth', ['authorized']),
   
    },
  methods:{
    ...mapActions('auth',['handleRefresh']),
    ...mapActions('ref', ['loadRef']),
    loadMandatoryData(){
     // this.loadRef({path:'users',query:{attributes:'_id,name'}})
    //  this.loadRef({path:'list',query:{fields:'list_name,list_group,list_value'}})


    }

  },
    created()
    {
      this.handleRefresh()
      if(this.authorized)
          this.loadMandatoryData()
    }
}
</script>

<style >


</style>
