<template>
    <q-item  class="c-card__header ">

                        <q-tabs          

                                v-model="tab"
                                indicator-color="white"
                                narrow-indicator
                                dense
                                no-caps
                                align="justify"

                        >               <q-tab class="text-white" icon="fas fa-arrow-left" 
                                                 @click="$emit('back')"
                                        >
                                                 <q-tooltip>Back</q-tooltip>
                                        </q-tab>


                                    
                                        <q-tab class="text-white" v-for="(tab,index) of tabs" :key="index"
                                                 :name="tab.name" :label="tab.label"
                                                
                                                 @click="$router.push(tab.path)"
                                        >
                                                 <q-tooltip>{{tab.label}}</q-tooltip>
                                        </q-tab>

                                                                       
                        </q-tabs>

                </q-item>
</template>

<script>
export default {
    props:['back','tabs'],    
    data(){
        return({
            tab:''
        })
    },
      watch:{
       $route(to){
             this.tab=to.name.split('_')[0]  
             /* 
                name and route name shoud match
                or route name should start with name_
             */
      } 
    },
    created(){
         this.tab=this.$route.name.split('_')[0]
    },

}
</script>

<style>

</style>