<template>
        <q-card   bordered>
               
                <q-item v-if="!tabMode" class="c-card__header">

                          <q-item-section class="float__left c-card__header__actions" >
        
                                <q-item :style="{'padding':'1px 10px'}" >
                                        <q-btn flat icon='fas fa-arrow-left' :style="{'font-size':'12px'}" 
                                               @click="$emit('back')" >
                                                <q-tooltip>Back</q-tooltip>
                                        </q-btn>
                                </q-item>
                         </q-item-section>

                        <q-space></q-space>
                                        <q-item-section>
                                                <span class="text-h5 q-ml-md" >{{naam}} Details</span>
                                        </q-item-section>
                                <q-space></q-space>
                </q-item>

        <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md c-form"
       
        >
         <q-card-section v-if=" sections &&sections.length"  class="container" >
                 <div  v-for="index in sections.length-1" :key="index">
                         
                        <span class="text-h6 c-text__underline" >{{  sections[index-1][0]?sections[index-1][0].pgdg_section:' Section '+index}} :-</span>

                        <q-card-section :class="inputClasses" 
                        
                        >
                                 <page-design-input          
                                   :class="'col-xs-12 col-sm-4 col-md-3'"                     
                                   v-for="(field, i) in sections[index-1]" :key="i"                                  
                                   :disabled="mode==='view' || disabledFields[field.pgdg_fieldname] || (!field.pgdg_edit) || (mode==='edit' && (field.pgdg_fieldupdateable==false)) "
                                   :errors.sync="errors"
                                   :value="value"
                                   :field="field"
                                   :rules="rules"
                                  @focus="errors[field.pgdg_fieldname]=''"
                                  @input="update(field.pgdg_fieldname,$event)"
                                  @validate="updateErrors(field.pgdg_fieldname,$event)"
                                  @on-image-upload="file=>$emit('on-image-upload',field.pgdg_fieldname,file)"
                                  @on-image-remove="update(field.pgdg_fieldname,null)"


                                />


                        </q-card-section>
                        <q-separator  />
                </div>

                 <div v-if="mode!=='create'" >
                         
                        <span class="text-h6 c-text__underline" >System Information :-</span>

                        <q-card-section :class="inputClasses" 
                        
                        >
                                <q-input 
                                class="col-xs-12 col-sm-4 col-md-3"  
                                readonly filled autogrow  dense
                                :value="`${ userName( value[systemInfo.createdBy]) || value[systemInfo.createdBy]} at ${ formatDate(value [systemInfo.createdDt])}`" 
                                :label="'Created By'" />
                               <q-input 
                                class="col-xs-12 col-sm-4 col-md-3"  
                                readonly filled autogrow dense
                                :value="`${ userName(value[systemInfo.modifiedBy]) || value[systemInfo.modifiedBy]} at ${ formatDate( value[systemInfo.modifiedDt])}`" 
                                label="Modified By" 
                               
                                />


                        </q-card-section>
                </div>
                <q-separator  />
         </q-card-section>

                 <span v-if="error" class="c-error" >{{error}}</span>

        <q-card-actions :style="{'margin':'-5px 10px 5px 0px '}" class="flex-between" >
           <q-item :style="{'margin':'auto auto auto 15px '}" >
                        <template v-if="mode==='edit'">
                                <q-btn 
                                v-if="value.task_status==='Open'&&(!value.task_checkin_time)" 
                                flat  @click="()=>travelAction('task_checkin_time')" 
                                        color="primary">
                                        Check-In
                                </q-btn>
                                <q-btn 
                                v-if="value.task_status==='Closed'&&(!value.task_checkout_time)" 
                                flat  @click="()=>travelAction('task_checkout_time')"
                                        color="positive" >
                                        Check-Out
                                </q-btn>
                       </template> 
                       
          </q-item>   
           <q-item>

                     
        <q-btn flat  @click="$emit('back')" color="primary">
                     Back
        </q-btn>
        <q-btn v-if="mode!=='view'" flat type="submit" color="positive" >
                Save
        </q-btn>
        <q-btn v-if="mode!=='view'" label="Reset" flat @dblclick="onReset"  color="info" >
                  <q-tooltip
                  :content-style="{'background-color':'aqua','color':'black'}"
                  >Double Click to Reset</q-tooltip>
        </q-btn>
          </q-item>  
          
      </q-card-actions>
 </q-form>       
    </q-card>
</template>

<script>
import {utilMixin,validationMixin,notificationMixin} from '../../../mixins'
import {  /* mapGetters */ } from 'vuex'

import {taskService} from '../../../services'

import {PageDesignInput} from '../../../components/input'
let yesOrNo={"Yes":true,"No":false}        

export default {
        props:['naam','master','mode','fields','value','idField','back',
        'controllingFields','on-image-upload',
        'rules','selectedId','backendErrors','backendError',
        'reset-errors','tabMode'
        ],
        mixins:[utilMixin,validationMixin,notificationMixin],
        components:{
                'page-design-input':PageDesignInput,
        },
        /* 
         ***
           if pass v-model prop---> that will be received as 'value'
           and that can be update by emitting  @input event
         */
        data(){
                return({
                   inputClasses:{
                           'row':true,
                           'q-gutter-md':true,
                           'c-form__inputs':false
                   },
                   errors:{},// for field errors
                   error:null, // for specific errors
                   //--------------
                disabledFields:{}, 
                /*   manage dependency fields
                 disabledFields:{
                        disabledField:true || false || null 
                        }
                
                */
                   options:[],
                   checkedIn:null
                })
        },
        computed:{
                        //...mapGetters('ref', ['user']),
                        user(){
                                return this.$store.state['ref'].user
                        },

                sections(){
                        let sections=[]

                       for(let field of this.fields)
                       {

                               if(!sections[field.pgdg_secno])
                                   sections[field.pgdg_secno]=[]


                               sections[field.pgdg_secno].push(field)    
                       }
                       return sections;         

                },
                systemInfo(){
                        
                      let sysInfo=this.sections&&this.sections[this.sections.length-1] || [] 

                        let createdBy,createdDt,modifiedBy,modifiedDt

                            for(let field of sysInfo)
                            {
                                         if(/creat(.*?)y/.test(field.pgdg_fieldname) )
                                         createdBy=field.pgdg_fieldname

                                         if(/creat(.*?)t/.test(field.pgdg_fieldname) )
                                         createdDt=field.pgdg_fieldname

                                         if(/modified(.*?)y/.test(field.pgdg_fieldname) )
                                         modifiedBy=field.pgdg_fieldname

                                         if(/modified(.*?)t/.test(field.pgdg_fieldname) )
                                         modifiedDt=field.pgdg_fieldname
                            }    

                        return ({createdBy,createdDt,modifiedBy,modifiedDt})

                },               
                userName(){
                        return (val)=> this.getRefText({data:this.user,val,fields:['usr_id','usr_name']})
                }
              
        },
        methods:{
                         async travelAction(key){

                         if(key==='task_checkin_time'){
                                 if(this.checkedIn===null)
                                 {
                                        let{data}= await taskService.getUserCheckInStatus(this.value.task_owner)
                                        this.checkedIn=data
                                 }
                              if(this.checkedIn){
                                      this.negative({message:"You have already checked in other task...please checkout that"})
                                        return;
                              }


                         }       

                        var updatedCopy = Object.assign({}, this.value, {[key]:new Date() })
                        this.$emit('input', updatedCopy)

                         if(this.error)
                            this.error=null

                },
                validateBeforeSubmit(){
                               
                },
               async  update(key,event) {

                         if(this.error)
                            this.error=null

                        // never modify the prop.
                        // emit a clone with updated fields.
                        var updatedCopy = Object.assign({}, this.value, {[key]:event })
                        
                        let newDisabledFields=this.manageDisabledFields(key,event,updatedCopy)
                               
                        if(key==='atp_startdt' ){

                         let months=['January','February','March','April','May','June','July','August','September','October','November','December']


                        let [year,month]=event?event.split('-'):[]
                        month=month?parseInt(month):month
                        year=year?parseInt(year):year
                        updatedCopy.atp_month=months[month]
                        updatedCopy.atp_year=year

                        }     
                        
                     
                                   
                        
                        this.disabledFields={...this.disabledFields,...newDisabledFields}
                        this.$emit('input', updatedCopy)
           
                },
                manageDisabledFields(key,val,updatedCopy)
                {
                         let newDisabledFields={}


                        if(this.controllingFields[key])
                        {
                                for(let depField in this.controllingFields[key])
                                {       
                                        if(!val) // in clear case
                                        {
                                                newDisabledFields[depField]=true
                                                  updatedCopy[depField]=null
                                                  continue;  
                                        } 
                                        
                                        // when all values are accepted
                                        if( this.controllingFields[key][depField]==='*'){
                                                 newDisabledFields[depField]=null
                                                  updatedCopy[depField]=null
                                                  continue;
                                        }

                                        if(val=== this.controllingFields[key][depField] ||
                                           val=== yesOrNo[this.controllingFields[key][depField]] 
                                        )
                                        newDisabledFields[depField]=null
                                        else {
                                                newDisabledFields[depField]=true
                                                updatedCopy[depField]=null
                                        }


                                }
                        }

                        return newDisabledFields

                },

                getAlldisabledFields(){
                        let newDisabledFields={}
                        for(let key in this.controllingFields){

                                for(let depField in this.controllingFields[key])
                               {
                                
                                       if(this.value[key] && 
                                               ( this.value[key]=== this.controllingFields[key][depField] ||
                                                this.value[key]=== yesOrNo[this.controllingFields[key][depField]]
                                                )
                                       )
                                       newDisabledFields[depField]=null
                                       else {
                                               newDisabledFields[depField]=true
                                       }


                               }
                        }

                        return newDisabledFields
                },
                updateErrors(key,event){
                       // this.errors[key]=event
                  this.errors = Object.assign({}, this.errors, {[key]:event })

                        // default ...validations is not working for checkbox and radios...so

                },
                onSubmit(){
                         
                         
                         this.validateBeforeSubmit()

                        for(let key in this.errors)
                               if(this.errors[key])
                              {
                                      this.negative({message:"Please fix all errors"})
                                       return
                              }
                         
                         if(this.error)
                         {
                                 this.negative({message:this.error})
                                return
                         }

                       
                         this.$emit('handle-submit')
                },
                onReset(){
                       this.$emit('input', {[this.idField]:this.selectedId})
                       this.$emit('reset-errors')
                       this.errors={}
                }
               
        },
        created(){
                let disabledFields={}
                if(this.mode!=='view')
                disabledFields =this.getAlldisabledFields()

                if(this.mode==='create')
                {
                        disabledFields.atp_status=true
                }
                this.disabledFields=disabledFields
        },
        watch:{
                backendErrors(newVal){
                        if(!this.isEmpty(newVal))
                            this.errors=Object.assign({},newVal)
                },
                backendError(newVal){
                        if(newVal)
                          this.error=newVal
                }
             
        }
}
</script>

<style>

</style>