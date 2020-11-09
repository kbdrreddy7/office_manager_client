<template>
  <div class="c-table__footer" >
                <div class="actions" >
                      {{footerMessage}}

                     <q-btn no-caps flat  dense
                     v-for="(ele,index) of tableFooterActions || []" :key="index"
                      :color="ele.color"  :label="ele.label"  @click="()=>ele.onClick()" />

                </div>
              <div class="pagination" >
                <div >
                    Recorde per page {{recordsPerPage}}  
                    <q-btn-dropdown  flat >
                    <q-list >
                      <q-item  v-for="(val,key) in limitValues" :key="key"
                            clickable v-close-popup @click="($event)=>$emit('handle-parent-events','handle-pagination','limit',val)">
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
                      @input="e=>$emit('handle-parent-events','handle-pagination','offset',(e-1)*pagination.limit)"
                      :max="Math.ceil(count/pagination.limit)"
                      :max-pages="6"
                      :boundary-numbers="true"
                       color="black"
                      :boundary-links="true"
                      :icon-first="'fa fa-caret-left'"
                      :icon-last="'fa fa-caret-right'"
                    >
                </q-pagination>
               </div>   
              
  </div>
</template>

<script>
export default {
    props:['handle-parent-events',
        'recordsPerPage','limitValues','paginationFrom','paginationTo','count',
        'pagination','tableFooterActions','footerMessage'
        ]
}
</script>

<style>

</style>