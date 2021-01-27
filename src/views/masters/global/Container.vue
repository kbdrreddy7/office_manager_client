<template>
<div>
    <!-- 
          <router-view></router-view>
          // we are not using child route bcz...we can't pass slots

          <component :is="component" ></component>
          // we can use dynamic component...but all (view) props we need to pass...becomes more data
          

    -->
    <table-view  v-if="mode==='list'"

        :current-page-access="currentPageAccess"
        :adding-filter="addingFilter"
        :chips="chips"
        :count="count"
        :columns="columns" 
        :data="data" 
        :filter="filter" 
        :filter-field="filterField" 
        :field-options="fieldOptions"
        :filter-operation="filterOperation" 
        :filter-value="filterValue" 
        :idField="idField" 
        :loading="loading"  
        :limit-values="limitValues"
        :name="name" 
        :operation-values="operationValues"
        :pagination="pagination" 
        :pagination-from="paginationFrom" 
        :pagination-to="paginationTo" 
        :records-per-page="recordsPerPage" 
        :visible-columns.sync="visibleColumns" 
  





        @add-obj="addObj" 
        @add-filter="addFilter" 
        @add-copy-obj="addCopyObj"
        @change-page-no="val=>pageNo=val"
        @delete-obj="deleteObj" 
        @delete-filter="deleteFilter"
        @edit-obj="editObj"
        @export-data="exportData"
        @fetch-with-filters="fetchWithFilters"
        @handle-pagination="handlePagination"
        @handle-column-select="values=>visibleColumns=values"
        @handle-filter-field-change="val=>handleFilterFieldChange(val)"
        @hanlde-filter-operation-change="val=>filterOperation=val"
        @handle-filter-value-change="val=>filterValue=val"
        @refresh="refresh"
        @show-filter-inputs="addingFilter=true"
        @view-obj="viewObj" 



    >

    </table-view>
    <form-view v-if="mode==='create' || mode==='edit' || mode==='view'" 
       
       
       
        :backend-errors="errors" 
        :controlling-fields="controllingFields"
        :fields="fields" 
        :idField="idField"
        :mode="mode"
        :name="name" 
        :rules="rules" 
        :selectedId="selectedId"
        v-model="values"      
       
        @back="back"
        @handle-submit="handleSubmit"
        @on-image-upload="onImageUpload"
        @reset-errors="errors={}"



    ></form-view>
</div>
</template>
<script>
import {   mapGetters/* , mapActions, mapState */  } from 'vuex'
import {moduleRegisterMixin ,utilMixin,notificationMixin} from '../../../mixins'
import {uploaderService} from '../../../services'
import TableView from './Table.vue'
import FormVue from './Form.vue'

const PAGE_MODES={
  "create":"create",
  "list":"list",
  "view":"view",
  "edit":"edit",
  "default":"list"
}

export default {
  mixins:[moduleRegisterMixin,utilMixin,notificationMixin],
  props:['defaultQuery','propsQuery'],
  components:{
      "table-view":TableView,
      "form-view":FormVue
  },
  data () {
    return {
     
      mode:PAGE_MODES.list,
      filter:"",
      addingFilter:false,
      logical:true,
      loading: false,
      idField:"_id",
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
         firstTime:true // this is to manage calling getAll
         // ---> we wanna call only once...intial time ( event when route changes)
         
    }
  },
  computed:{

        ...mapGetters('auth',['userAccess']),
       // ...mapGetters('list',['data','fields','columns','visibleColumns','count','idField','name','sort']),

        /* 
          dynamic name spacing is not working so we mapping manually
        */
          
          currentPageAccess(){
            return this.userAccess[this.path]  || {}
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
           
              if(!this.$store.state[this.path]) return []
              return this.$store.state[this.path]['columns']
           }, 
          tabelViewFields(){

            if(!this.$store.state[this.path]) return []
           return this.$store.state[this.path]['tableViewFields']       

          },
           columns(){
             if(!this.$store.state[this.path]) return []
              return this.$store.state[this.path]['columns']
          },
          count(){
            if(!this.$store.state[this.path]) return 0
              return this.$store.state[this.path]['count']
          },
         
          name(){
             return this.currentPageAccess['name']
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
                    let fieldDeatil=this.fieldOptions.find(ele=>ele.field===field) || {}

                    let value=this.query[field][operation]

                    if(fieldDeatil.type==='fk')
                         value=this.getRefTextFromFieldInfo({value,fieldInfo:fieldDeatil.value})

                    if(fieldDeatil.type==='date')
                         value=this.formatDate(value,'date')


                    let label=`${fieldDeatil['label'] || field} ${this.operationMapping[operation] || 'is'} ${value}`

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


      //------ set up methods
     
      async loadPageDesign(){
            let path=`${this.path}/loadPageDesign`
            await this.$store.dispatch(path)
        },
      async  getAll(query={}){
        let path=`${this.path}/getAll`
          await this.$store.dispatch(path,query)
      },

      async loadTableView(push=true){
              this.mode=PAGE_MODES.list

                let path=`${this.path}/${this.mode}`
                if(push)
                this.$router.push(path) 

            await this.getAll({...this.pagination,
                        attributes:this.visibleColumns.join(','),
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

            /* 
            //----this will cause many effects...some of them are handleComponent
             */
            if(push)
            this.$router.push(`/${this.path}/${this.mode}/${id}`) 

        },
      addObj(push=true){
            this.mode=PAGE_MODES.create
            if(push)
            this.$router.push(`/${this.path}/${this.mode}`)
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
            if(push)
            this.$router.push(`/${this.path}/${this.mode}/${id}`)
          

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
            for(let key in this.files){
                  if(key==='su_picture')
                  {
                    let obj={
                      id,
                      group:'serviceuser',
                      subgroup:'profileimages'
                    }
                  /*  let res= */ await uploaderService.uploadFile(obj)
                  }
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

              this.loading=false


            } catch (error) {
              this.loading=false
              this.errors=error.errors
            }



      },

    // ----------------------other methods

        onImageUpload(key,file){
            this.files[key]=file
        },
        back(){
          this.selectedId=null
          this.mode=PAGE_MODES.list
          this.$router.push(`/${this.path}/${this.mode}`)
        },

      

        // pagination
        async handlePagination(key,val){

                this.loading=true
                      
                if(this.pagination[key]===val)
                    return // if already same 

                if(key==='limit') // when we change limit(per page) --> fetch first page  default
                    {
                      this.pagination['offset']=0
                    }  

                  this.pagination[key]=val
    
                if(!this.firstTime){
                    await this.getAll({...this.pagination,
                            attributes:this.visibleColumns.join(','),
                            ...this.query})
                }
              
                this.loading=false
            
        },
        addFilter(){

          // https://012.vuejs.org/guide/best-practices.html

          this.addingFilter=false
          let {filterField,filterOperation,filterValue,query}=this

          if(filterField && filterOperation && filterValue)
          {
              if(filterOperation==="is")
              {
                  // if filter is not there or ...if operation already exists( other than 'is')
                  if((!query[filterField.field]) || (!Array.isArray(query[filterField.field])) )                  
                        this.$set(query,filterField.field,[]) //  query[filterField.field]=[]

                        /* 
                            once we use $set -> then the nested obj becomes reactive (Vue keeps watching)
                         */
                         query[filterField.field].push(filterValue)
              }
              else
                {
                // if filter operation is not there or ...already  filter(array) exists..eg: name:['ram']
                if((!query[filterField.field]) || Array.isArray(query[filterField.field]) )
                     this.$set(query,filterField.field,{})
                    query[filterField.field][filterOperation]=filterValue

              }
          }

            this.filterField="",this.filterOperation="",this.filterValue=""
        },
        deleteFilter(chip){

            let {field,operation}=chip
            this.$delete(this.query[field],operation)

        },
        exportData(){
            this.notify({message:"downloading....please wait",pregress:true})
            let headerColumns=this.columns.filter(col=>this.visibleColumns.includes(col.name))
            this.exportToCSV({columns:headerColumns,data:this.data,fileName:`${this.name}(${this.pageNo})`})
        },
      
  
        async fetchWithFilters(){
            this.pagination={
              offset:0,
              limit:this.pagination.limit
            }

             if(!this.firstTime)
          await this.getAll({...this.pagination,
                          attributes:this.visibleColumns.join(','),
                          ...this.query
                          })
          this.positive({message:"Data fetched successfully"})

        },
        handleFilterFieldChange(field){

          if(field.type==='FK_dep'){
              field.type='fk'
          }
          if(field.type==='timestamp'){
              field.type='date'
          }
          this.filterField=field


        },
    
       async refresh(){
         
         this.loading=true
            if(!this.firstTime)
           await this.getAll({...this.pagination,
                         attributes:this.visibleColumns.join(','),
                          ...this.query,...this.defaultQuery,...this.propsQuery
                         })
             this.positive({message:"Page data is refreshed"})

         this.loading=false    
           
       },

      async hanldePageMode(){

              // '/:path/:mode?/:_id?'
          let {mode,_id}=this.$route.params
              //this.mode=PAGE_MODES[mode || "default" ]

              switch(mode){
                case PAGE_MODES.list:{
                    await this.loadTableView(false)
                    break
                }
                case PAGE_MODES.edit:{
                  await this.editObj(_id,false)
                  break
                }
                case PAGE_MODES.view:{
                   await this.viewObj(_id,false)
                   break
                }
                case PAGE_MODES.create:{
                  await this.addObj(false)
                  break
                }

                default:{
                   await this.loadTableView(true)
                    break
                }
              }



      },
      async setUp(){
        try {
          
            this.loading=true
            


            this.path=this.$route.params.path
            this.query={}
            this.initializeModule(this.path)
            await this.loadPageDesign()


            this.firstTime=true
            this.pagination={offset:0,limit:10}
        
            this.visibleColumns =this.tabelViewFields.map(ele=>ele.name)

            await this.hanldePageMode()
              //
              /* 
                we are making  this.firstTime=true..  before calling the setUp  
                sothat other watching (in watch of route)...effects won't call get All

                eg:  visibleColumns,pagination  ... we are changing these values ...here
              */
         
                        
            this.firstTime=false
            this.loading=false

        } catch (error) {
          console.log("error ",error)
        }
            

         
      }
  
  },
  watch:{
  
    $route( to, from ) {
              // this.$forceUpdate();

         // this.path= this.$route.params.path

          if(to.params.path!==from.params.path){
                 this.firstTime=true
                 this.setUp()// react to route changes...  
                 return
          }


            /* 
                        when user is on other than list view ( i.e create,edit.. eg: state/create) and 
                        want to go '/somepath'....(eg: /serviceuser)

                        then ...router treats '/somepath' as its child route..
                        and shows the current page
                        this issue is fixed in the below way

            */

         /*    let viewName=to.params.componentName

          if(viewName && (viewName!==this.selectedId) && (!PAGE_MODES[viewName]))
          {
            return this.$router.push(`/${viewName}`)
          } */


    },

    async visibleColumns(newVal){


        if( !this.firstTime)
        {
             
            await this.getAll({...this.pagination,
                          attributes:newVal.join(','),
                           ...this.query,...this.defaultQuery, ...this.propsQuery
                           })        }
       
    } 
   
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