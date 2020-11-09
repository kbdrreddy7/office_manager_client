<template>
    <q-card class="c-card q-ma-sm" :flat="tabMode" :bordered="false">

          <table-head
          :tab-mode="tabMode"
          :name="naam"
          @handle-parent-events="handleParentEvents"
          :current-page-access="currentPageAccess"
         >

         </table-head>

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
             <table-head-actions
              @handle-parent-events='handleParentEvents'
              :filter='filter'
              :filter-value='filterValue'
              :operation-values='operationValues'
              :filter-operation='filterOperation'
              :field-options="fieldOptions"
              :filter-field="filterField"
              :columns="columns"
              :visible-columns="visibleColumns"
              :chips="chips"
              :adding-filter="addingFilter"
            ></table-head-actions>
      </template>
      

         <template v-slot:header="props">
                     <table-rows-head :props="props"></table-rows-head>       
       </template>

      <template v-slot:body="props">
          <table-rows
            :props="props"
            @handle-parent-events='handleParentEvents'
            :id-field="idField"
            :current-page-access="currentPageAccess"

          >
          </table-rows>
      </template>

            <template v-slot:bottom>
                <table-footer
                    @handle-parent-events="handleParentEvents"
                    :records-per-page="recordsPerPage"
                    :limit-values="limitValues"
                    :pagination-from="paginationFrom"
                    :pagination-to="paginationTo"
                    :count="count"
                    :pagination.sync="pagination"
                  >
                  </table-footer>
            </template>

    </q-table>
    </q-card>
</template>

<script>
import {TableHeader,TableHeaderActions,TableRowsHeader,TableRows,
TableFooter} from '../../../components/table'

export default {

  components:{
    'table-head':TableHeader,
    "table-head-actions":TableHeaderActions,
    "table-footer":TableFooter,
    "table-rows-head":TableRowsHeader,
    "table-rows":TableRows
  },
  props:[
    "data","columns","idField","filter","loading","visibleColumns",
    "naam","chips","filterField","fieldOptions","filterOperation","operationValues",
    "filterValue", "recordsPerPage","limitValues","paginationFrom","paginationTo","count",
      "addingFilter","currentPageAccess",
    "pagination",'tabMode',

    //-------------------
    //  for events declaration of props is not required
  "refresh"
  //"exportData","addObj","showFilterInputs","addFilter","viewObj","editObj","deleteObj"
  ,"export-data","add-obj",'add-copy-obj','show-filter-inputs','add-filter','view-obj','delete-obj',
  //"fetchWithFilters"
  'fetch-with-filters',"handle-pagination",'update-filter'
   
  ],
  data(){
    return({
      showAll:{rowsPerPage:0},
      current:2
    })
  },
  methods:{
    handleParentEvents(evntName,...args){
      this.$emit(evntName,...args)
    }
  },
  watch:{
  
  },
  created(){
    
  }
}
</script>

<style>

</style>