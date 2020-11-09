<template>
   <q-tr :props="props">

         <q-td v-if="selectable">
            <q-checkbox  
               @input="()=>$emit('handle-parent-events','handle-select',props.row[idField],props.row)"
               :value="!!selectedObjs[props.row[idField]]"
               :key="props.row[idField]"
              />
         </q-td>

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            v-html="col.value"
          >
           
          </q-td>
          <q-td  >



               <q-btn :disabled="!currentPageAccess.auas_read" flat icon='remove_red_eye' color="green" :style="{'font-size':'12px'}" 
                   @click.exact="e=>$emit('handle-parent-events','view-obj',props.row[idField],props.row)" 
                   @click.ctrl.exact="e=>currentPageAccess.auas_create&&$emit('handle-parent-events','add-copy-obj',props.row[idField])"
                   >
                  <q-tooltip>View</q-tooltip>
             </q-btn>

            <q-btn :disabled="!currentPageAccess.auas_edit" flat icon='fas fa-edit' color="blue" :style="{'font-size':'12px'}" 
                @click.exact="e=>$emit('handle-parent-events','edit-obj',props.row[idField],props.row)" >
                <q-tooltip>Edit</q-tooltip>
             </q-btn>

             <q-btn :disabled="!currentPageAccess.auas_delete" flat icon='delete' color="red" :style="{'font-size':'12px'}" 
                @click.exact="e=>$emit('handle-parent-events','delete-obj',props.row[idField],props.row)" >
                <q-tooltip>Delete</q-tooltip>
             </q-btn>
          </q-td>
        </q-tr>
</template>

<script>
export default {

props:['props','handle-parent-events','idField','currentPageAccess','selectable','selectedObjs'],


}
</script>

<style>

</style>