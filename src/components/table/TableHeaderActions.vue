<template>
  
            <div class="container c-table__top">
               
                <div class=" row c-table__head-row c-table__sub-header"  >

                            <div  :class="{'q-mt-xs':true, 'truncate-chip-labels':false}" >  
  
                                        <q-chip   
                                            v-for=" (chip,index) in chips " :key="index"
                                              :v-model="true" 
                                              size="16px"  
                                              removable 
                                              @remove="()=>$emit('handle-parent-events','delete-filter',chip)" 
                                              :label="chip['label']"
                                       
                                             > 
                                              <q-tooltip >{{chip['label']}}</q-tooltip>
                                             </q-chip>              
                                       
                                     

                                        <q-chip   
                                         :v-model="true" 
                                          size="16px"                                         
                                           clickable @click="()=>$emit('handle-parent-events','show-filter-inputs',true)"
                                           label="Add Filter"
                                           color="primary"
                                          text-color="white"
                                        >
                                         <q-tooltip>Add Filter</q-tooltip>

                                        </q-chip>
                
                          </div>
                          <q-space></q-space>
                            <div class="q-mt-xs col-xs-6 col-sm-4 col-md-1">
                                <q-select
                                  class="q-pt-xs c-select"
                                  :value="visibleColumns"
                                  @input="($event)=>$emit('handle-parent-events','handle-column-select',$event)"
                                  multiple
                                  rounded outlined
                                  dense
                                  options-dense
                                  map-options
                                  :options="columns"
                                  option-value="name"
                                  emit-value
                                  options-cover
                                  style="min-width: 150px"
                                  display-value="Columns"

                                />

                              
                   
                            </div>
                              <q-space></q-space>
                            <div class="q-mt-xs  col-xs-6 col-sm-5 col-md-1">
                                <q-chip   
                                       :v-model="true"   
                                       size="16px"                   
                                       clickable @click="()=>$emit('handle-parent-events','fetch-with-filters')"
                                        label="Fetch"
                                        color="primary"
                                        text-color="white"
                                      >
                                         <q-tooltip>Fetch</q-tooltip>

                                      </q-chip>
                            </div>
                             <q-space></q-space>
                             <div class="col-xs-12 col-sm-5 col-md-2" >
                                <q-input class="float__left" 
                                    dense debounce="300" color="primary" 
                                    :value="filter"
                                    @input="($event)=>$emit('handle-parent-events','update-filter',$event)"
                                    placeholder="Search">
                                    <template v-slot:append>
                                         <q-icon v-if="filter === ''" name="search" />
                                         <q-icon v-else name="clear" class="cursor-pointer"
                                          @click="()=>$emit('handle-parent-events','update-filter','')" />                                   
                                       </template>
                                  </q-input>


                             </div>
                     
                </div>


                <div v-if="addingFilter" class="q-mt-xs q-gutter-md row filter-inputs c-table__head-row "  >

                     

                                    <q-select 
                                       class="col-xs-6 col-sm-2"
                                        outlined
                                        dense
                                        options-dense
                                        options-cover
                                        map-options
                                        option-value="pgdg_fieldname"
                                        option-label="pgdg_fieldlabel"
                                        :value="filterField" 
                                        @input="($event)=>$emit('handle-parent-events','handle-filter-field-change',$event)"
                                     
                                        :options="fieldOptions" label="Field" />


                                      <q-select 
                                       class="col-xs-6 col-sm-2"
                                        outlined
                                        dense
                                        options-dense
                                        options-cover
                                        map-options
                                        emit-value
                                       option-value="value"                                     
                                      :value="filterOperation" 
                                      @input="($event)=>$emit('handle-parent-events','hanlde-filter-operation-change',$event)"
                                     
                                      :options="operationValues" label="Operation" />


                                        
                                       <q-input
                                       v-if="!filterField" 
                                       outlined
                                        dense
                                            :class="'col-xs-12 col-sm-4 col-md-2'"   
                                        name="dummy" label="value" />

                                       
                                       <page-design-input     
                                        v-if="filterField"     
                                        :class="'col-xs-12 col-sm-4 col-md-2'"   
                                        :key="filterValue+'key'"                  
                                        :errors="{}"
                                        :value="{[filterField.pgdg_fieldname]:filterValue}"
                                        :field="filterField"
                                        :rules="[]"
                                        @focus="{}"
                                        @input="val=>$emit('handle-parent-events','handle-filter-value-change',val)"
                                        @validate="{}"
                                        @on-image-upload="{}"
                                        @on-image-remove="{}"
                                       
                                    />


                                    

                                      <span  class="col-xs-6 col-sm-2">
                                       <q-btn   
                                        no-caps
                                        square
                                        @click="($event)=>$emit('handle-parent-events','add-filter')"
                                        label="Add"
                                        color="primary"
                                        text-color="white"
                                        >
                                        <q-tooltip>Add</q-tooltip>
                                        </q-btn>
                                    </span  >
                                     
                </div>
            </div>
          
  
</template>

<script>

import {PageDesignInput} from '../input'

export default {
  components:{
    "page-design-input":PageDesignInput
  },
  props:['handle-parent-events','filter',
        'filterValue','operationValues','filterOperation',
        'fieldOptions','filterField',
        'columns','visibleColumns','chips','addingFilter'
    ]

// filter -is value
// @input to change 'value'

}
</script>

<style>

</style>