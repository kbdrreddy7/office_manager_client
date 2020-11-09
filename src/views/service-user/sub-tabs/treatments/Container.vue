<template>
<div>
   <keep-alive exclude="treatments-form" >
    <router-view
        :tab-mode="tabMode"

        :naam="name"
        :data="data" :columns="columns" :idField="idField" 
        :filter="filter" :loading="loading" 
        :visible-columns.sync="visibleColumns" 
         :chips="chips"
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
        @add-filter="addFilter" @view-obj="viewObj" @delete-obj="deleteObj" 
        @edit-obj="editObj"
        @fetch-with-filters="fetchWithFilters"
        @handle-pagination="handlePagination"
        @handle-column-select="values=>visibleColumns=values"
        @handle-filter-field-change="val=>handleFilterFieldChange(val)"
        @hanlde-filter-operation-change="val=>filterOperation=val"
        @handle-filter-value-change="val=>filterValue=val"

        @delete-filter="deleteFilter"
        @change-page-no="val=>pageNo=val"
        @update-filter="val=>filter=val"



        :master="master"   
        :mode="mode"
        :page-mode="mode"
        :fields="fields" 
        :selectedId="selectedId"
        @handle-submit="handleSubmit"
        v-model="values"      
        :rules="rules" 
        :backend-errors="errors" 
        :backend-error="error"
        @reset-errors="errors={}"
        @back="back"
        @on-image-upload="onImageUpload"
        :controlling-fields="controllingFields"

        :selectable="selectable"
        :selected-objs.sync="selectedObjs"
        :selected-all="selectedAll"
        @handle-select-all="handleSelectAll"
        @handle-select="handleSelect"

        :table-footer-actions="tableFooterActions"
        :footer-message="footerMessage"

        :options-obj="{...optionsObj,...propOptions}"
        @update-options="event=>optionsObj=event"
       :currentPage="currentPage"

       :holidays-dates="holidaysDates"
       @load-holidays="loadHolidays"
    >

    </router-view>
    </keep-alive>

    <planning-form
      v-if="planning"

       

        :fields="planningFields" 
        @handle-submit="submitPlans"
         v-model="palnningInputs"      
        :rules="rules" 
        :backend-errors="errors" 
        :backend-error="error"
        @reset-errors="errors={}"
        @close="plan"

        :controlling-fields="controllingFields"

        :options-obj="{...optionsObj,...propOptions}"
        @update-options="event=>optionsObj=event"
       :currentPage="currentPage"

       :holidays-dates="holidaysDates"
       @load-holidays="loadHolidays"


    >

    </planning-form>


</div>
</template>
<script>
import {   mapGetters , mapActions, mapState   } from 'vuex'
import {moduleRegisterMixin ,utilMixin,notificationMixin,basicViewMixin} from '../../../../mixins'
import {uploaderService,globalService} from '../../../../services'

import PlanningForm from './PlanningForm'

const PAGE_MODES={
  "create":"create",
  "list":"list",
  "view":"view",
  "edit":"edit",
   "default":"list"
}

export default {
  mixins:[moduleRegisterMixin,utilMixin,notificationMixin,basicViewMixin],
  props:['tabMode','basePath','parentQuery','parentValues','parentOptions'],
  components:{
      'planning-form':PlanningForm
  },
  data () {
    return {
      componentName:"table-view",
      master:"",
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
          defaultQuery:{}, // to set query using logic
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
         defaultFormValues:{
          
         },
         values:{},
         optionsObj:{},
         //rules:{},   will be loaded from pagedesign---module
         errors:{}, // for field verrors
         error:null, // specific error
         files:{},


         selectedId:"",
         path:null,
         firstTime:true, // this is to manage calling getAll
         // ---> we wanna call only once...intial time ( event when route changes)

        selectable:true,
        selectedObjs:{},
        selectedAll:false,
        planning:false ,
        palnningInputs:{}
       // footerMessage:''

         
    }
  },
  computed:{
        ...mapGetters('auth',['userAccess','user']),
        ...mapState('root',['holidays']),
         
         currentPage(){
           let {path}=this.$route
           if(path.includes('treatmentplans'))
              return 'treatmentplans'
              else if(path.includes('treatmentapprovals'))
                  return 'treatmentapprovals'
               else return 'treatment'
         },

          propsQuery(){
              return (this.parentQuery || {})['treatment']
          },
          propsValues(){
            return (this.parentValues || {})['treatment']
          },
          propOptions(){
              return (this.parentOptions || {})['treatment']
          },

         footerMessage(){
           if(this.selectable)
           return `${Object.keys(this.selectedObjs).length} Selected`
           else return null
         },
         

        /* 
          dynamic name spacing is not working so we mapping manually
        */
        currentPageAccess(){

            let key=this.currentPage[0].toUpperCase()+this.currentPage.substring(1)

            if(this.$route.params.suId)
              key='serviceuser/treatments'
            // for some pages ... 1st char is in Upper case 
            // list -> List
            return this.userAccess[this.currentPage] || this.userAccess[key] || this.userAccess['serviceuser/treatments'] ||{}
            

          },
          data(){
            if(!this.$store.state[this.path]) return []
                
              return this.$store.state[this.path]['data']
          },

           fields(){
             if(!this.$store.state[this.path]) return []
              return this.$store.state[this.path]['fields']
          },
          planningFields(){
            if(this.fields)
            {
              return this.fields.filter(ele=>ele.pgdg_section==='Treatment Planning')
              
            }
            return []
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
          },
          tableFooterActions(){

            let plan={label:'Plan',color:'primary',
                onClick:()=>{
                        if(this.checkSelected())
                          this.plan()
                    }
                }

            let reject={label:'Reject',color:'negative',
                onClick:()=>{
                   if(this.checkSelected())
                  this.raiseDialog({
                    title:'Confirm',message:'Would you like to reject the plans?',
                    onOk:this.reject
                      })
                }
              }

            let approve={label:'Approve',color:'positive',
                  onClick:()=>{
                    if(this.checkSelected())
                    this.raiseDialog({
                      title:'Confirm',message:'Would you like to approve the plans?',
                      onOk:this.approve
                        })
                  }
                }
              let path=this.$route.path
              if(path.includes('treatmentplans'))
                return [plan]
                else if(path.includes('treatmentapprovals'))
                    return [reject,approve]
                else return []

            
          },
          treatmentDates(){
            return ""
          },
          holidaysDates(){
            let dates=this.holidays
            if(!dates) return []
            return dates.map(ele=>ele.hol_date)
          }

  
  },
  methods:{
      //  ...mapActions(this.path, ['getAll','loadPageDesign']),

      /* 
          dynamic name spacing is not working so we mapping manually
      */    
    ...mapActions('root', ['setData']),

      checkSelected(){
         if(!(this.selectedObjs&&Object.keys(this.selectedObjs).length))
          {
            this.negative({message:"Please select at least one record"})
             return
          }
          return true
      },
      plan(){
         
          this.planning=!this.planning
          window.scrollBy(0, -window.innerHeight/2)// not working
          this.palnningInputs={}
      },
     async submitPlans(){

       if(!this.checkSelected()) // again they may deselect
            return

       let payload=[]
         for(let key in this.selectedObjs)
             payload.push({[this.idField]:key,...this.palnningInputs,tr_status:'Waiting For Approval'})
       
               this.loading=true
       await globalService.upsert(this.path,payload)
               this.loading=false

                this.plan()
                this.handleSelectAll()
        //await this.loadTableView()


      },
    async  approve(){
     

      let payload=[]
         for(let key in this.selectedObjs)
             payload.push({[this.idField]:key,...this.selectedObjs[key],tr_status:'Rejected'})
      
        this.loading=true
        await globalService.put('treatment/approve',payload)
        this.loading=false

        this.handleSelectAll()


      },
    async  reject(){
        
      let payload=[]
         for(let key in this.selectedObjs)
             payload.push({[this.idField]:key,tr_status:'Approved'})
      
        this.loading=true
           await globalService.upsert(this.path,payload)
            this.loading=false

        this.handleSelectAll()     
       },
     async loadHolidays(startDate=new Date()){

        let {data}=await globalService.getAll('/holiday',
                    {fields:'hol_date,hol_desc',hol_date:{gte:startDate},sort:'hol_date:asc'})
            
            let old=this['holidays']
              old=old?old:[]
            this.setData({holidays:[...old,...data]}) 

      },
      manageConditinalQuery(){

        let path=this.$route.path

        if(path.includes('treatmentplans')){
          this.defaultQuery={
            tr_status:['Created','Rejected']
          }
         }
          else if(path.includes('treatmentapprovals')){
          this.defaultQuery={
                tr_status:['Waiting For Approval']
              }
          }
        else
          {
            this.defaultQuery={}
            this.selectable=false
          }

      },

    async  manageCoditionalSUData(suId){

        // assessmentOptions

        let {data:assmntRes}=await globalService.getAll("/form",
        {form_serviceuser:suId,form_status:"Completed",
           form_isActive:true,limit:-1,fields:"form_type",})

        let assmntsNames=new Set()//unique names

        assmntRes.forEach(ele => assmntsNames.add(ele.form_type));

        assmntsNames=[...assmntsNames]

        let index=assmntsNames.indexOf('General Assessment')
        if(index>=0)
        assmntsNames.splice(index,1)

        this.optionsObj['tr_assessment']=assmntsNames
        


      },

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

            if(push)
            this.$router.push(`/${this.basePath?this.basePath+'/'+this.currentPage:this.currentPage}/${id}?mode=view`) 
          
        },
        addObj(push=true){
            this.mode=PAGE_MODES.create

            if(push)
            this.$router.push(`/${this.basePath?this.basePath+'/'+this.currentPage:this.currentPage}/${this.mode}`)

            this.values={...this.defaultFormValues,...this.propsValues,tr_status:'Created'}


          // remove the previous options
          this.optionsObj['tr_problem']=[]
          this.optionsObj['tr_goal']=[]
          this.optionsObj['tr_treatment']=[]





        },
        async addCopyObj(id,push=true){
            let path=`${this.path}/loadOne`

            if(this.data.length)
            {
             let obj= await  this.$store.dispatch(path,id || this.data[0][this.idField])
             this.values=Object.assign({},obj)
            }
            else this.values={...this.defaultFormValues,...this.propsValues}
           delete this.values[this.idField]

            this.mode=PAGE_MODES.create
            if(push)
            this.$router.push(`/${this.basePath?this.basePath+'/'+this.currentPage:this.currentPage}/${this.mode}`)

        },
       async editObj(id,push=true){
              this.mode=PAGE_MODES.edit
              let path=`${this.path}/loadOne`
             let data= await  this.$store.dispatch(path,id)

            this.values=data
            this.selectedId=id
            if(push)
            this.$router.push(`/${this.basePath?this.basePath+'/'+this.currentPage:this.currentPage}/${id}?mode=edit`) 
          

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
                   await uploaderService.uploadFile(obj)
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


          } catch (error) {
             this.loading=false
            this.errors=error.errors
            this.error=error.error
          }



        },
   
      //------------------------ Other methods



    async setUp(){

          this.path='treatment'

          if(!this.$route.name.includes('treatment'))
              return ;

            this.loading=true

             this.query={}
             this.defaultQuery={}

             this.manageConditinalQuery()

              

            this.initializeModule(this.path)
            await this.loadPageDesign()
            this.firstTime=true
            this.pagination={offset:0,limit:10}
            this.visibleColumns =this.fieldOptions.map(ele=>ele.pgdg_fieldname)


            // if the case ---route is /:master/:id  and the page is refreshed

              let {name,query:{mode},params:{suId,treatmentId}}=this.$route

              if(suId)
                this.manageCoditionalSUData(suId)


                // switch case is not working with regex or endsWith
              
                if(name.endsWith('treatment_create'))  {
                    this.addObj(false)
                  }   
              else if(name.endsWith('treatment_details'))  {
                    if(mode==='edit' && this.currentPageAccess.auas_edit)
                      await this.editObj(treatmentId,false)
                      else
                    await this.viewObj(treatmentId,false)
                  }
                  else {
                      await  this.loadTableView() 
                  }

              //
              /* 
                we are making  this.firstTime=true..  before calling the setUp  (in watch of route)
                sothat other watching...effects won't call get All

                eg:  visibleColumns,pagination  ... we are changing these values ...here
              */
         
            this.firstTime=false
            this.loading=false

         
    }
  },
  
  watch:{
   async propsQuery(){

     if(this.$route.params.suId)
        this.manageCoditionalSUData(this.$route.params.suId)

       if(!this.firstTime && this.mode===PAGE_MODES.list)
        await this.loadTableView()

    },
   async $route( to,from) {
             
//             console.log("in treat watch route ",{to,from})

            if(!to.name.includes('treatment'))
              return ;
        

            if(to.name==='default_treatment' || to.name==='treatment') {
            this.mode=PAGE_MODES.default   
            this.selectedId=null

              if(to.path.includes('treatmentplans') && (!from.path.includes('treatmentplans')))
              {  // comes from treatmentapprovals
                    this.manageConditinalQuery()
                    await this.loadTableView()
              }
              if(to.path.includes('treatmentapprovals') && (!from.path.includes('treatmentapprovals')))
              {  // comes from treatmentplans
                    this.manageConditinalQuery()
                     await this.loadTableView()
              }


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