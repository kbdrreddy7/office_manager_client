<template>
    <q-card class="c-card q-ma-sm"  :bordered="false">

      <q-item  class="c-card__header" >
      
             <q-item-section>
               <span class="text-h5 q-ml-md" >{{name}}</span>
             </q-item-section>
                  <q-space></q-space>
          <q-item-section class="float__left c-card__header__actions" >
                  
                <q-item :style="{'padding':'1px 10px'}" >
                    <q-btn flat icon='fas fa-redo' :style="{'font-size':'12px'}" 
                          @click="e=>$emit('refresh')" >
                      <q-tooltip>Refresh</q-tooltip>
                  </q-btn>
                  <q-btn flat icon='fas fa-download' @click="e=>$emit('export-data')" >
                      <q-tooltip>Export To CSV</q-tooltip>
                  </q-btn>
                <q-btn  :disabled="!currentPageAccess.create" flat icon='fas fa-plus-square' 
                      @click.exact="e=>$emit('add-obj')"
                      @click.ctrl.exact="e=>$emit('add-copy-obj')"
                    :style="{'font-size':'12px'}" >
                    <q-tooltip>Add Record</q-tooltip>
                </q-btn>
              
                                                      
              </q-item>                             
                                               
        </q-item-section>

    </q-item>


    <q-table
      class="my-sticky-header-column-table c-table-view"
      :separator="'cell'"
      :data="data"
      :columns="columns"
      :row-key="idField"
      :filter="filter"
      :dense="false"
      :loading="loading"
      
      :pagination.sync="showAll"
      :visible-columns="visibleColumns"
    >

               <template v-slot:loading>
                     <q-inner-loading showing color="primary" />
                </template>     


          <template v-slot:top>
            <div class="container c-table__top">
               
                <div class=" row c-table__head-row c-table__sub-header"  >

                            <div  :class="{'q-mt-xs':true, 'truncate-chip-labels':false}" >  
  
                                        <q-chip   
                                            v-for=" (chip,index) in chips " :key="index"
                                              :v-model="true" 
                                              size="16px"  
                                              removable 
                                              @remove="$emit('delete-filter',chip)" 
                                              :label="chip['label']"
                                       
                                             > 
                                              <q-tooltip >{{chip['label']}}</q-tooltip>
                                             </q-chip>              
                                       
                                     

                                        <q-chip   
                                         :v-model="true" 
                                          size="16px"                                         
                                           clickable @click="e=>$emit('show-filter-inputs',true)"
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
                                  @input="$emit('handle-column-select',$event)"
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
                            <div class="q-mt-xs col-xs-6 col-sm-4 col-md-1">
                                <q-chip   
                                       :v-model="true"   
                                       size="16px"                   
                                       clickable @click="e=>$emit('fetch-with-filters')"
                                        label="Fetch"
                                        color="primary"
                                        text-color="white"
                                      >
                                         <q-tooltip>Fetch</q-tooltip>

                                      </q-chip>
                            </div>
                             <q-space></q-space>
                             <div class="col-xs-12 col-sm-4 col-md-2" >
                                <q-input class="float__left" 
                                    dense debounce="300" color="primary" v-model="filter" placeholder="Search">
                                    <template v-slot:append>
                                         <q-icon v-if="filter === ''" name="fas fa-search" />
                                         <q-icon v-else name="fas fa-times" class="cursor-pointer" @click="filter = ''" />                                   
                                       </template>
                                  </q-input>


                             </div>
                     
                </div>


                <div v-if="addingFilter" class="q-mt-xs q-gutter-md row filter-inputs c-table__head-row "  >

                                    <q-select 
                                     :class="'col-xs-12 col-sm-4 col-md-2'" 
                                        outlined
                                        dense
                                        options-dense
                                        options-cover
                                        map-options
                                        option-value="name"
                                        option-label="label"
                                        :value="filterField" 
                                        @input="$emit('handle-filter-field-change',$event)"
                                     
                                        :options="fieldOptions" label="Field" />


                                      <q-select 
                                     :class="'col-xs-12 col-sm-4 col-md-2'" 
                                        outlined
                                        dense
                                        options-dense
                                        options-cover
                                        map-options
                                        emit-value
                                       option-value="value"                                     
                                      :value="filterOperation" 
                                      @input="$emit('hanlde-filter-operation-change',$event)"
                                     
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
                                        :value="{[filterField.name]:filterValue}"
                                        :field="filterField"
                                        :rules="[]"

                                        @focus="()=>{}"
                                        @input="val=>$emit('handle-filter-value-change',val)"
                                        @validate="()=>{}"
                                        @on-image-upload="()=>{}"
                                        @on-image-remove="()=>{}"
                                       
                                    />

                                    

                                      <span  class="col-xs-2 col-sm-1">
                                       <q-btn   
                                        no-caps
                                        square
                                        @click="e=>$emit('add-filter')"
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
      

         <template v-slot:header="props">
          <q-tr :props="props">
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

      <template v-slot:body="props">
        <q-tr :props="props">
        
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            v-html="col.value"
          >
           
          </q-td>
          <q-td  >



               <q-btn :disabled="!currentPageAccess.read" flat icon='fas fa-eye' color="green" :size="'sm'" 
                   @click.exact="e=>$emit('view-obj',props.row[idField],props.row)"
                   @click.ctrl.exact="e=> currentPageAccess.create&& $emit('add-copy-obj',props.row[idField])"
                    >
                  <q-tooltip>View</q-tooltip>
             </q-btn>

            <q-btn :disabled="!currentPageAccess.edit" flat icon='fas fa-edit' color="blue" :size="'sm'" 
                @click.exact="e=>$emit('edit-obj',props.row[idField],props.row)" >
                <q-tooltip>Edit</q-tooltip>
             </q-btn>

             <q-btn :disabled="!currentPageAccess.delete" flat icon='fas fa-trash-alt' color="red" :size="'sm'" 
                @click.exact="e=>$emit('delete-obj',props.row[idField],props.row)" >
                <q-tooltip>Delete</q-tooltip>
             </q-btn>

          </q-td>
        </q-tr>
      
      </template>

            <template v-slot:bottom>
                <div>

                </div>
                <q-space></q-space>
                <div>
                    Recorde per page {{recordsPerPage}}  
                    <q-btn-dropdown  flat >
                    <q-list >
                      <q-item  v-for="(val,key) in limitValues" :key="key"
                            clickable v-close-popup @click="e=>$emit('handle-pagination','limit',val)">
                        <q-item-section>
                          <q-item-label>{{key}}</q-item-label>
                        </q-item-section>
                      </q-item>

                    </q-list>
                   </q-btn-dropdown>

                    {{` ${paginationFrom}-${paginationTo}`}} of {{count}}  {{`  `}}
                  

              </div>
                <q-pagination
                     :value="(pagination.offset/pagination.limit)+1"
                      @input="e=>$emit('handle-pagination','offset',(e-1)*pagination.limit)"
                      :max="Math.ceil(count/pagination.limit)"
                      :max-pages="6"
                      :boundary-numbers="true"
                       color="black"
                      :boundary-links="true"
                      :icon-first="'fa fa-caret-left'"
                      :icon-last="'fa fa-caret-right'"
                    >
                </q-pagination>
            </template>


    </q-table>
    </q-card>
</template>

<script>

import {PageDesignInput} from '../../../components/input'

export default {
  components:{
    "page-design-input":PageDesignInput
  },
  props:[
    "data","columns","idField","filter","loading","visibleColumns",
    "name","chips","filterField","fieldOptions","filterOperation","operationValues",
    "filterValue", "recordsPerPage","limitValues","paginationFrom","paginationTo","count",
      "addingFilter",
    "pagination","currentPageAccess",

    //-------------------
    //  for events declaration of props is not required
  "refresh"
  //"exportData","addObj","showFilterInputs","addFilter","viewObj","editObj","deleteObj"
  ,"export-data","add-obj",'add-copy-obj','show-filter-inputs','add-filter','view-obj','delete-obj',
  //"fetchWithFilters"
  'fetch-with-filters',"handle-pagination"
   
  ],
  data(){
    return({
      showAll:{rowsPerPage:0},
      current:2
    })
  },
  methods:{
  
  },
  watch:{

  }
 
}
</script>

<style>

</style>