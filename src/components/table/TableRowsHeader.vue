<template>
      <q-tr :props="props">
            <q-th v-if="selectable">
               <q-checkbox dark  @input="()=>$emit('handle-parent-events','handle-select-all')" :value="selectedAll" />
            </q-th>
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
            <q-th>Actions</q-th>
          </q-tr>
</template>

<script>
export default {
    props:['props','selectable','selectedAll','handle-select-all'],
    data(){
      return({
          teal:''
        })
    },
    methods:{
      select(val){
        this.teal=val
      }
    },
    watch:{
      
    }
}
</script>

<style>

</style>