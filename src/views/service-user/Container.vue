<template>
<q-card class="c-card q-ma-sm">
    
       <router-view name="header"
                       :selected-id="selectedId"
                        @back="back"
                        :base-path="`serviceuser/${selectedId}`"
                        :tabs="tabs"
                   ></router-view>

   <keep-alive>         

    <router-view  

                           :naam="name"
                          :tab-mode="true"
                          :base-path="`serviceuser/${selectedId}`"
                          :parent-query="childQuery"
                          :parent-values="childDefaultvalues" 
                          :parent-options="childOptipns"

        :data="data" :columns="columns" :idField="idField" 
        :filter="filter" :loading="loading" 
        :visible-columns.sync="visibleColumns"    :chips="chips"
        :filter-field="filterField" :field-options="fieldOptions"
        :filter-operation="filterOperation" :operation-values="operationValues"
        :filter-value="filterValue" :records-per-page="recordsPerPage" :limit-values="limitValues"
        :pagination-from="paginationFrom" :pagination-to="paginationTo" :count="count"
        :pagination="pagination" :adding-filter="addingFilter"
        :current-page-access="currentPageAccess"
  

        @refresh="refresh"
        @export-data="exportData"
        @add-obj="addObj" @show-filter-inputs="addingFilter=true"
        @add-copy-obj="addCopyObj"
        @add-filter="addFilter" @view-obj="viewObj" @delete-obj="deleteObj" @edit-obj="editObj"
        @fetch-with-filters="fetchWithFilters"
        @handle-pagination="handlePagination"
        @handle-column-select="cols=>visibleColumns=cols"
        @handle-filter-field-change="val=>handleFilterFieldChange(val)"
        @hanlde-filter-operation-change="val=>filterOperation=val"
        @handle-filter-value-change="val=>filterValue=val"

        @delete-filter="deleteFilter"
        @change-page-no="val=>pageNo=val"
         @update-filter="val=>filter=val"


                  :mode="mode"
                    :fields="fields" 
                    :id-field="idField"
                    :selected-id="selectedId"
                    @handle-submit="handleSubmit"
                    v-model="values"      
                    :rules="rules" :backend-errors="errors" @reset-errors="errors={}"
                    @back="back"
                    :controlling-fields="controllingFields"
                    @on-image-upload="onImageUpload"
    >

    </router-view>
  </keep-alive>       
      
  
</q-card>
</template>
<script>
import {   mapGetters/* , mapActions, mapState  */ } from 'vuex'
import {moduleRegisterMixin ,utilMixin,notificationMixin,validationMixin,basicViewMixin} from '../../mixins'
import {uploaderService} from '../../services'


const PAGE_MODES={
  "create":"create",
  "list":"list",
  "view":"view",
  "edit":"edit",
   "default":"list"
}

export default {
  mixins:[moduleRegisterMixin,utilMixin,notificationMixin,validationMixin,basicViewMixin],
  props:[],
  components:{
 
  },
  data () {
    return {
      mode:"list",// create //edit // list // view // delete
      filter:"",
      addingFilter:false,
      logical:true,
      loading: false,
      visibleColumns:[],
     // showAll:{rowsPerPage:0},// this to show all records ---> pass as props to tabel
        pagination: 
        {
          offset:0,
          limit:10
        },
       
        limitValues:{1:1,5:5,10:10,15:15,20:20,50:50,100:100,1000:1000,2000:2000,All:-1},
          query:{},
          filterField:"",filterOperation:"",filterValue:"",
          childQuery:{},// to pass to childs
          childDefaultvalues:{},// to pass cchild ---> efault inputs
          childOptipns:{},
       
         operationValues:[
           {value:"is",label:"is"},
           {value:"lte",label:"less than or equal to"},
           {value:"gte",label:"greater than or equal to"},
           {value:"ne",label:"not equal to"},
           {value:"like",label:"contains"},
         ],
         operationMapping:{
           "is":"is",
           "lte":"less than or equal to",
           "gte":"greater than or equal to",
           "ne":"not equal to",
           "like":"contains"
         },

         //-----------
         values:{},
         //rules:{},   will be loaded from pagedesign---module
         errors:{},
         files:{},
         selectedId:"",
         path:null,
         firstTime:true, // this is to manage calling getAll
         // ---> we wanna call only once...intial time ( event when route changes)
         tabs:[],
         
    }
  },
  computed:{
      
               ...mapGetters('auth',['userAccess']),

       // ...mapGetters('list',['data','fields','columns','visibleColumns','count','idField','name','sort']),

        /* 
          dynamic name spacing is not working so we mapping manually
        */
             currentPageAccess(){
            let key=this.path[0].toUpperCase()+this.path.substring(1)
            // for some pages ... 1st char is in Upper case 
            // list -> List

            return this.userAccess[this.path] || this.userAccess[key] || {}

          },
          data(){
            if(!this.$store.state[this.path]) return []
                
              return this.$store.state[this.path]['data']
          },

           fields(){
             if(!this.$store.state[this.path]) return []
              return this.$store.state[this.path]['fields']
          },
          fieldOptions(){
             /* 
             this.fieldOptions=this.$store.state[this.path]&&this.$store.state[this.path]['visibleColumns'] || []
              this.visibleColumns =this.$store.state[this.path]['visibleColumns'].map(ele=>ele.name)
              */
              if(!this.$store.state[this.path]) return []
              return this.$store.state[this.path]['visibleColumns']
           }, 
           columns(){
             if(!this.$store.state[this.path]) return []
              return this.$store.state[this.path]['columns']
          },
          count(){
            if(!this.$store.state[this.path]) return 0
              return this.$store.state[this.path]['count']
          },
           idField(){
             if(!this.$store.state[this.path]) return null
              return this.$store.state[this.path]['idField']
          },
          name(){
            if(!this.$store.state[this.path]) return null
              return this.$store.state[this.path]['name']
          },
        
           tabelViewFields(){
             if(!this.$store.state[this.path]) return []
              return this.$store.state[this.path]['visibleColumns']       
            },  
            rules(){
              if(!this.$store.state[this.path]) return {}
              return this.$store.state[this.path]['rules']  
            },
              controllingFields(){
                 if(!this.$store.state[this.path]) return {}
              return this.$store.state[this.path]['controllingFields']  
            },

        // pagination
          pageNo(){
            return (this.pagination.offset/this.pagination.limit)+1
          },
          recordsPerPage(){
              if(this.pagination.limit<0)
               return 'All'
               return this.pagination.limit
          },
          paginationFrom(){
            if(this.pagination.limit<0)
               return this.count
            return this.pagination.offset+1   
          },

          paginationTo(){
               if(this.pagination.limit<0)
               return ""

                if(this.count<=this.pagination.limit)
                   return this.count;

            return this.pagination.offset+this.pagination.limit
          },
         
          chips(){
              let chips=[]
              for(let field in this.query)
              {
                for(let operation in this.query[field])
                {
                    let fieldDeatil=this.fieldOptions.find(ele=>ele.pgdg_fieldname===field) || {}

                    let value=this.query[field][operation]

                    if(fieldDeatil.pgdg_fieldtype==='FK')
                         value=this.getRefTextFromFieldInfo({value,fieldInfo:fieldDeatil.pgdg_fieldvalue})

                    if(fieldDeatil.pgdg_fieldtype==='Date')
                         value=this.formatDate(value,'date')


                    let label=`${fieldDeatil['pgdg_fieldlabel'] || field} ${this.operationMapping[operation] || 'is'} ${value}`

                  chips.push({
                    label,title:label,field,operation
                  })

                }
              }
              return chips
          }
  },
  methods:{
      //  ...mapActions(this.path, ['getAll','loadPageDesign']),

      /* 
          dynamic name spacing is not working so we mapping manually
      */
     async loadTableView(){
              this.mode=PAGE_MODES.default
              await this.getAll({...this.pagination,
                          fields:this.visibleColumns.join(','),
                           ...this.query,...this.defaultQuery, ...this.propsQuery
                           })
        },
     

      //-------------------- CRUD methods
       async viewObj(id,push=true){
            this.mode=PAGE_MODES.view
            this.selectedId=id
            let path=`${this.path}/loadOne`
            let data= await  this.$store.dispatch(path,id)
            this.values=data

            this.childQuery={'treatment':{tr_serviceuser:[id]}}
            this.childDefaultvalues={'treatment':{
              tr_serviceuser:id,
              tr_category: data.su_category,
            }}
            this.childOptipns={
              'treatment':{
                'tr_disability':data.su_disability.split(",")
              }
            }

            if(push)
            this.$router.push(`/${this.path}/${id}?mode=view`) 

            this.tabs=[
              {name:'serviceuser',label:"Service User",path:`/serviceuser/${id}`},
              {name:'treatments',label:"Treatments",path:`/serviceuser/${id}/treatment`}
            ]

        },
      addObj(push=true){
            this.mode=PAGE_MODES.create
            if(push)
            this.$router.push(`${this.path}/${this.mode}`)///${this.path}/${this.mode}
            this.values={}

        },
        async addCopyObj(id,push=true){
            let path=`${this.path}/loadOne`

            if(this.data.length)
            {
             let obj= await  this.$store.dispatch(path,id || this.data[0][this.idField])
             this.values=Object.assign({},obj)
            }
            else this.values={}
           delete this.values[this.idField]

            this.mode=PAGE_MODES.create
            if(push)
            this.$router.push(`/${this.path}/${this.mode}`)

        },
       async editObj(id,push=true){
              this.mode=PAGE_MODES.edit
              let path=`${this.path}/loadOne`
             let data= await  this.$store.dispatch(path,id)

            this.values=data
            this.selectedId=id

            this.childQuery={'treatment':{tr_serviceuser:[id]}}
            this.childDefaultvalues={'treatment':{}}

            if(push)
            this.$router.push(`/${this.path}/${id}?mode=edit`)

            this.tabs=[
              {name:'serviceuser',label:"Service User",path:`/serviceuser/${id}`},
              {name:'treatments',label:"Treatments",path:`/serviceuser/${id}/treatment`}
            ]
          

        },
        deleteObj(id,obj)
        {
         
             this.$q.dialog({
              title: 'Confirm',
              message: 'Would you like to delete the record?',
              cancel: true,
              persistent: true
            }).onOk(async() => {
               let path=`${this.path}/deleteOne`
               await   this.$store.dispatch(path,{obj,objId:id})
            }).onCancel(() => {
            }).onDismiss(() => {
            })
        },
      async  uploadFiles(id){
            let payLoad={}
            for(let key in this.files){
                  if(key==='su_picture')
                  {
                    let obj={
                      id,
                      group:'serviceuser',
                      subgroup:'profileimages',
                      file:this.files[key]
                    }
                    let {url}= await uploaderService.uploadFile(obj)
                    payLoad[key]=url

                  }
            }
              if(!this.isEmpty(payLoad)){

               /*  let data= */ await  this.$store.dispatch(`${this.path}/editOne`,{obj:payLoad,objId:id})
              }
            
      },
        async handleSubmit(){

       

          try {
            
             let path=`${this.path}/${this.mode==='create'?'addOne':'editOne'}`
             let data= await  this.$store.dispatch(path,{obj:this.values,objId:this.selectedId})
             this.values=data 
            this.positive({message: `${this.mode==='create'?'added':'edited'} successfully`})

             await this.uploadFiles(data[this.idField]) 
             this.mode=PAGE_MODES.view

          } catch (error) {
             this.loading=false
            this.errors=error.errors
          }
        },
    
          async setUp(){
            this.loading=true
            this.path='serviceuser'
            this.query={}
            this.initializeModule(this.path)
            await this.loadPageDesign()
            this.firstTime=true
            this.pagination={offset:0,limit:10}
            this.visibleColumns =this.fieldOptions.map(ele=>ele.pgdg_fieldname)





            let {name,query:{mode},params:{suId}}=this.$route

            

            switch(name){

               case 'serviceuser_create':{ 
                await this.addObj(false) 
                break;
              } 
              case 'serviceuser_details':
            
                { 
                if(mode===PAGE_MODES.edit)
                  await this.editObj(suId,false)
                  else await this.viewObj(suId,false)
                break;
              }
              case 'treatments_container_serviceuser_treatments':
              case 'treatments_serviceuser_treatments_create':
              case 'treatments_serviceuser_treatments_details':
              case 'treatments_serviceuser_default_treatments':        
              { 
                await this.viewObj(suId,false)
                break;
              }
  

              default:{
                await   this.loadTableView() 
                 break;
              }

            }

           


                this.firstTime=false
                this.loading=false 
                
         
        }
  },
  watch:{
  
     $route( to) {  // (to, from)


          if(to.name==='default_serviceuser' || to.name==='serviceuser') {
            this.mode=PAGE_MODES.default   
            this.selectedId=null
           }


    }, 
   
   
  },
 async created(){
   
          this.setUp()
    },
   
    destroyed(){

    }

}
</script>

<style lang="scss">


</style>