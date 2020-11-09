<template>
        <q-card class="c-card q-ma-sm q-mt-md " :flat="tabMode" :bordered="false">
               
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
                                   :disabled="mode==='view' || disabledFields[field.pgdg_fieldname] || (field.pgdg_edit!==true) || (mode==='edit' && (field.pgdg_fieldupdateable===false)) "
                                   :errors.sync="errors"
                                   :value="value"
                                   :field="field"
                                   :rules="rules"
                                  @focus="errors[field.pgdg_fieldname]=''"
                                  @input="update(field.pgdg_fieldname,$event)"
                                  @validate="updateErrors(field.pgdg_fieldname,$event)"
                                  @on-image-upload="file=>$emit('on-image-upload',field.pgdg_fieldname,file)"
                                  @on-image-remove="update(field.pgdg_fieldname,null)"
                                  :options-obj="optionsObj"

                                  :join="false"
                                  :delimiter="','" 
                                  :field-types="fieldTypes"
                                  :hint-obj="hintObj"
                                  :colors="colors" 


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

        <q-card-actions :style="{'margin':'-5px 10px 5px 0px '}" align="right" >
           
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
import {utilMixin,validationMixin,notificationMixin} from '../../../../mixins'

//import {globalService} from '../../../../services'
import {PageDesignInput} from '../../../../components/input'

let yesOrNo={"Yes":true,"No":false}        

export default {
        name:'evaluation-form',
        props:['naam','master','pageMode'/* 'mode' */,'fields','value','idField','back',
        'controllingFields','on-image-upload',
        'rules','selectedId','backendErrors','backendError',
        'reset-errors','tabMode','optionsObj','update-options','currentPage',
        

        /* 
           we are unable to exclude from keep alive ...in atp 

           so we are not using mode directly...instead...using from pageMode
        */

        ],
        mixins:[utilMixin,validationMixin,notificationMixin],
        components:{
               'page-design-input':PageDesignInput,
              //  'scroll-area':ScrollArea
        },
        /* 
         ***
           if pass v-model prop---> that will be received as 'value'
           and that can be update by emitting  @input event
         */
        data(){
                return({
                  mode:'view',
                   inputClasses:{
                           'row':true,
                           'q-gutter-md':true,
                           'c-form__inputs':false
                   },
                   errors:{},// for field errors
                   error:null, // for specific errors
                   fieldTypes:{},// to change field types logically
                   hintObj:{},// to store hints
                   colors:{},// to pass colors to calender
                   //--------------
                disabledFields:{}, 
                /*   manage dependency fields
                 disabledFields:{
                        disabledField:true || false || null 
                        }
                
                */
                   options:[],
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
                        
                      let sysInfo=this.sections&&this.sections.find(ele=>ele[0]&&ele[0].pgdg_section==='System Information')
                        if(!sysInfo) sysInfo={}
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
                    
              
                validateBeforeSubmit(){
                               
                        //let newErrors={}       
                         
                      //  this.errors={...this.errors,...newErrors}


                      // this.error="Please Checkout"


                },
               async  update(key,event) {

                         if(this.error)
                            this.error=null
                        

                        // never modify the prop.
                        // emit a clone with updated fields.
                        var updatedCopy = Object.assign({}, this.value, {[key]:event })
                        
                                                          
                        let newDisabledFields=this.manageDisabledFields(key,event,updatedCopy)

                        if(newDisabledFields)
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

                        return Object.keys (newDisabledFields).length?newDisabledFields:null

                },

                // based on dependecy field
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
                getLogicalDisabledFields(){

                        let disabledFields={}
                      

                        return disabledFields;
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
       async created(){

               

               this.mode=this.pageMode
                let disabledFields={} 
                if(this.mode==='create'){
                        disabledFields =this.getAlldisabledFields()
                        disabledFields={...disabledFields,...this.getLogicalDisabledFields(this.mode)}
                }
               /*  if(this.mode==='edit'){
                        // make all option available for edit

                } */

                
                this.disabledFields=disabledFields
        },
        watch:{

                $route(to){
                        this.mode=to.query.mode 
                        /* 
                        when we use keep-alive ....exclude is not working..
                        if we click on view mode  the later clicked on edit mode         

                        */
                },
              
                backendErrors(newVal){
                        if(!this.isEmpty(newVal))
                            this.errors=Object.assign({},newVal)
                },
                backendError(newVal){
                        if(newVal)
                          this.error=newVal
                },
              async  pageMode(newVal){
                      // this is to handle when page is refreshed
   // whe it is used as child route --> second time it'll refresh...won't get created again
                        this.mode=newVal
                        let disabledFields={}
                        if(newVal==='create')
                        {
                                disabledFields={...this.getAlldisabledFields(),...this.getLogicalDisabledFields(this.mode)}
                        }
                       /*  if(newVal==='edit'){
                                 // make all option available for edit
                        } */
                        this.disabledFields=disabledFields
                       
                }
              
             
        }
}
</script>

<style>

</style>