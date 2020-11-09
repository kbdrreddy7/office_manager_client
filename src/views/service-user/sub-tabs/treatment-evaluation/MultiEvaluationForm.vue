<template>
        <q-card class=" q-ma-sm q-mt-lg " :flat="false" >
           <q-item class="c-card__header">

                        <q-space></q-space>
                                        <q-item-section>
                                                <span class="text-h5 q-ml-md" >Planning Details</span>
                                        </q-item-section>
                        <q-space></q-space>
                         <q-item-section class="float__right c-card__header__actions" >
        
                                <q-item :style="{'padding':'1px 10px'}" >
                                        <q-btn flat icon='far fa-window-close' :style="{'font-size':'12px'}" 
                                               @click="$emit('close')" >
                                                <q-tooltip>Close</q-tooltip>
                                        </q-btn>
                                </q-item>
                         </q-item-section>
                </q-item>
        <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md c-form"
       
        >
         <q-card-section v-if=" sections &&sections.length"  class="container" >
                 <div  v-for="index in sections.length" :key="index">
                         

                        <q-card-section :class="inputClasses" 
                        
                        >
                                 <page-design-input 
                                   :class="sections[index-1].length!==1? 'col-xs-12 col-sm-4 col-md-3':'col-xs-12'"                     
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
                                  :delimiter="'<>'"
                                  :field-types="fieldTypes"
                                  :hint-obj="hintObj"
                                  :colors="colors" 


                                />



                        </q-card-section> 
                      
                </div>

                 
                <q-separator  />
         </q-card-section>

                 <span v-if="error" class="c-error" >{{error}}</span>

        <q-card-actions :style="{'margin':'-5px 10px 5px 0px '}" align="right" >
           
           <q-item>

                     
        <q-btn flat  @click="$emit('close')" color="primary">
                     Close
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
import {  /* mapGetters */ } from 'vuex'

import {PageDesignInput} from '../../../../components/input'

let yesOrNo={"Yes":true,"No":false}        

export default {
        name:'planning-form',
        props:['fields','value','back',
        'controllingFields',
        'rules','backendErrors','backendError',
        'reset-errors','optionsObj','update-options',
        'holidaysDates','load-holidays'

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
                  mode:'create',
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
                   checkedIn:null
                })
        },
        computed:{
                       
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
                
              
        },
        methods:{
                    
               
               
                validateBeforeSubmit(){
                               
                        let newErrors={}       

                        for(let field of this.fields)
                        {
                            if(!this.value[field.pgdg_fieldname])
                              newErrors[field.pgdg_fieldname]= 'field is mandatory'
                        }
                         
                       if(this.value.tr_freq==='Custom' || this.value.tr_freq==='Weekly'){

                           if(!this.value.tr_freq_sub)  
                             newErrors.tr_freq_sub='Field is mandatory'
                           else delete newErrors.tr_freq_sub 
                       } 
                           else delete newErrors.tr_freq_sub 

                        this.errors={...this.errors,...newErrors}


                      // this.error="Please Checkout"


                },
               async  update(key,event) {

                         if(this.error)
                            this.error=null
                      
                        // never modify the prop.
                        // emit a clone with updated fields.
                        var updatedCopy = Object.assign({}, this.value, {[key]:event })
                        
                        
//--------------------------Manage Logical Actions-------------------


//---------------------------------------------


                                   
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
                       this.$emit('input', {})
                       this.$emit('reset-errors')
                       this.errors={}
                }
               
        },  
       async created(){

                if(!(this.holidaysDates&&this.holidaysDates.length))
               {
                       this.$emit('load-holidays')
               }
               this.colors['red']=this.holidaysDates 

        },
        watch:{

                holidaysDates(newDates){
                        this.colors['red']=newDates

                        let options=[]
                          if(this.value.tr_treatmentdates)
                             options.push(...this.value.tr_treatmentdates.split(','))
                          options.push(...newDates)   

                          var updatedCopy = Object.assign({}, this.optionsObj, {'tr_treatmentdates':options })

                        this.$emit('update-options',updatedCopy) 
                }
             
        }
}
</script>

<style>

</style>