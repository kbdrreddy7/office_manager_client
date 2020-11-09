<template>
        <q-card class="my-card q-ma-sm "  bordered>
               
                <q-item class="c-card__header">

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
                                                <span class="text-h5 q-ml-md" >{{name}} Details</span>
                                        </q-item-section>
                                <q-space></q-space>
                </q-item>
        <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md c-form"
        ref="c_form"
        >
         <q-card-section v-if=" sections &&sections.length"  class="container" >
                 <div  v-for="index in sections.length" :key="index">
                         
                        <span class="text-h6 c-text__underline" >{{  sections[index-1][0]?sections[index-1][0].section:' Section '+index}} :-</span>

                        <q-card-section :class="inputClasses" 
                        
                        >
                                 
                            <page-design-input
                             
                                 v-for="(field, i) in sections[index-1]" :key="i"       

                                 :class="'col-xs-12 col-sm-4 col-md-3'"                     
                                :disabled="mode==='view' || disabledFields[field.field] || (field.readonly) || (mode==='edit' && (field.only_insert)) "
                                :errors.sync="errors"
                                :value="value"
                                :field="field"
                                :rules="rules"

                                @focus="errors[field.field]=''"
                                @input="update(field.field,$event)"
                                @validate="updateErrors(field.field,$event)"
                                @on-image-upload="file=>$emit('on-image-upload',field.field,file)"
                                @on-image-remove="update(field.field,null)"

                            >
                            </page-design-input>     


                        </q-card-section>
                        <q-separator  />
                </div>

                 <div v-if="mode!=='create'" >
                         
                        <span class="text-h6 c-text__underline" >System Information :-</span>

                        <q-card-section :class="inputClasses" 
                        
                        >
                                <q-input 
                                v-if="value['created_by_']"
                                class="col-xs-12 col-sm-4 col-md-3"  
                                readonly filled autogrow  dense
                                :value="`${ userName( value['created_by_']) || value['created_by_']} at ${ formatDate(value ['created_at'])}`" 
                                :label="'Created By'" />
                               <q-input 
                                v-if="value['updated_by_']"
                                class="col-xs-12 col-sm-4 col-md-3"  
                                readonly filled autogrow dense
                                :value="`${ userName(value['updated_by_']) || value['updated_by_']} at ${ formatDate( value['updated_at'])}`" 
                                label="Modified By" 
                               
                                />


                        </q-card-section>
                </div>
                <q-separator  />
         </q-card-section>
        <q-card-actions :style="{'margin':'-5px 10px 5px 0px '}" align="right">
        <q-btn flat  @click="$emit('back')" color="primary">
                     Back
        </q-btn>
        <q-btn v-if="mode!=='view'" flat type="submit" color="positive" >
                Save
        </q-btn>
        <q-btn v-if="mode!=='view'" label="Reset" flat  @dblclick="()=>this.$refs.c_form.reset()"  color="info" >
                  <q-tooltip
                  :content-style="{'background-color':'aqua','color':'black'}"
                  >Double Click to Reset</q-tooltip>
        </q-btn>
      </q-card-actions>
 </q-form>       
    </q-card>
</template>

<script>
import {utilMixin,notificationMixin,validationMixin} from '../../../mixins'
import {  /* mapGetters */ } from 'vuex'

import { PageDesignInput} from '../../../components/input'
let yesOrNo={"Yes":true,"No":false}        

export default {
        props:[
                'back',
                'backendErrors',
                'controllingFields',
                'fields',
                'idField',
                'mode',
                'name',
                'on-image-upload',
                'rules',
                'reset-errors',
                'selectedId',
                'value',
                ],
        mixins:[utilMixin,notificationMixin,validationMixin],
        components:{
                'page-design-input':PageDesignInput,
        },


//--------------
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
                   sections:[],
                   systemInfo:[],
                   errors:{},
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
                users(){
                        return this.$store.state['ref'].users
                },
                userName(){
                        return (val)=> this.getRefText({data:this.users,val,fields:['_id','name']})
                }
              
        },
        methods:{
                     //  :rules="[ val => val && val.length > 0 || 'Please type something']"

                handleSections(fieldsArrsy){
                        let sections=[]
                        let systemInfo=[]

                       for(let field of fieldsArrsy)
                       {
                               if(field.section==="System Information")
                               {
                                       systemInfo.push(field)
                                       continue
                               }
                                 

                               if(!sections[field.section_no])
                                   sections[field.section_no]=[]


                               sections[field.section_no].push(field)    
                       }

                       this.sections=sections
                       this.systemInfo=systemInfo
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
               
                customValidation(eager=true){
                
                /* 
                some times ( when we pass rules as props ) auto validations--> onSubmit is not working,
                to fix this we are using this 
                */

                       let errors={}
                       outer:for( let fieldName in  this.rules)
                       {
                               for( let rule of this.rules[fieldName])
                               {
                                       let msg=rule(this.value[fieldName])
                                       if(typeof msg==='string')
                                          {
                                                  errors[fieldName]=msg
                                                  if(eager)
                                                    return errors
                                                 continue outer;   
                                          }
                               }
                       }
                      return errors  

                },
                update(key,event) {
                        // console.log({key,event})
                        // never modify the prop.
                        // emit a clone with updated fields.
                        var updatedCopy = Object.assign({}, this.value, {[key]:event })
                        
                        let newDisabledFields=this.manageDisabledFields(key,event,updatedCopy)
                        
                        this.disabledFields={...this.disabledFields,...newDisabledFields}
                        this.$emit('input', updatedCopy)
           
                },
                async onSubmit(){


                        let validationFields= this.$refs.c_form.getValidationComponents()
                        /* 
                          some times validations are coming empty( i.e valiadtios are not working ) then --- we are doing manually
                         */


                        if(!(validationFields.length&&this.isEmpty(this.rules)))
                        {
                           this.errors={...this.errors,...this.customValidation()}  
                        }
                     
                     if(!this.isEmpty(this.errors))
                        for(let key in this.errors)
                               if(this.errors[key])
                              {
                                      this.negative({message:"Please fix all errors"})
                                       return
                              }
                       
                       console.log(" onSubmit submitted ",this.value)
                         this.$emit('handle-submit')
                },
                onReset(){
                       this.$emit('input', {[this.idField]:this.selectedId})
                       this.$emit('reset-errors')
                       this.errors={}
                }
               
        },
        created(){

                this.handleSections(this.fields || [])
                
                if(this.mode!=='view')
                this.disabledFields=this.getAlldisabledFields()

        },
        
        watch:{
                backendErrors(newVal){
                        if(!this.isEmpty(newVal)){
                        console.log("--------------backendErrors ")

                                this.errors=Object.assign({},newVal)
                        }
                }
             
        }
}
</script>

<style>

</style>