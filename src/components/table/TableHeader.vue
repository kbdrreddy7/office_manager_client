<template>
  <q-item  :class="{'c-card__header':true,'tab-mode-card__header':tabMode}"  >
      
             <q-item-section>
               <span class="text-h5 q-ml-md" >{{name}}</span>
             </q-item-section>
                  <q-space></q-space>
          <q-item-section class="float__left c-card__header__actions" >
                  
                <q-item :style="{'padding':'1px 10px'}" >
                    <q-btn flat icon='fas fa-redo' :style="{'font-size':'12px'}" 
                          @click="()=>$emit('handle-parent-events','refresh')" >
                      <q-tooltip>Refresh</q-tooltip>
                  </q-btn>
                  <q-btn flat icon='archive' @click="()=>$emit('handle-parent-events','export-data')" >
                      <q-tooltip>Export To CSV</q-tooltip>
                  </q-btn>
                <q-btn :disabled="!currentPageAccess.auas_create" flat icon='fas fa-plus-square' 
                      @click.exact="()=>$emit('handle-parent-events','add-obj')"
                      @click.ctrl.exact="()=>$emit('handle-parent-events','add-copy-obj')"
                    :style="{'font-size':'12px'}" >
                    <q-tooltip>Add Record</q-tooltip>
                </q-btn>
                                                      
              </q-item>                             
                                               
        </q-item-section>

    </q-item>
</template>

<script>
export default {

props:['name','handle-parent-events','currentPageAccess','tabMode'],

created(){
}
}
</script>

<style>

</style>