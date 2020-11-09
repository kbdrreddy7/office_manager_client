<template>
<div>
        <component :is="'generic-input'"
        
                    :colors="colors"
                    :delimiter="delimiter"
                    :disabled="disabled"
                    :dep-field-value="field.pgdg_depfieldname&&getDepValues(value,field.pgdg_depfieldname)"
                    :error="!!errors[field.field]"
                    :error-message="errors[field.field]"
                    :emit-value="emitValue"
                    :field-info="field.value" 
                    :hint="hintObj&&hintObj[field.field]"
                    :join="join"
                    :label="field.label" 
                    :label-color="field.mandatory?'negative':''"
                    :options=" (optionsObj&& optionsObj[field.field]) || options"
                    :type="fieldTypeMappings[ fieldTypes&&fieldTypes[field.field] || field.type]"
                    :value="value[field.field]" 
                    :rules="rules[field.field]"

                  
                    @focus="$emit('focus', $event)"
                    @input="$emit('input', $event)" 
                    @on-image-remove="$emit('on-image-remove')"
                    @on-image-upload="file=>$emit('on-image-upload',file)"
                    @validate="$emit('validate',$event)"

        >              
        </component>
        

 </div>       
</template>

<script>

/* 
    value  --> is entire object, which holds record fields
*/

import {GenericInput,/* NumberInput */} from '.'
import {utilMixin} from '../../mixins'
import {mapGetters} from 'vuex'

export default {
        mixins:[utilMixin],
        components:{
            'generic-input':GenericInput,
        },

        props:[
            // variables
            'colors',
            'delimiter',
            'disabled',
            'emitValue',
            'errors',
            'field',// pageDesignField
            'optionsObj',
            'rules',
            'type',
            'value',

            // events
            'focus',
            'fieldTypes',
            'hintObj',// for calender
            'input',
             'join', // for checkbox( multi select)
            'on-image-upload',
            'on-image-remove',


        ],
        data(){
            return ({
             fieldTypeMappings:    //  pageDesignFieldType:quasarFieldType
                {
                    "text":"text",
                    "password":"password",
                    "date":"date",
                    "datetime":"datetime",
                    "number":"number",
                    "fk":"reference",
                    "select":"select",



                    "Checkbox":"checkbox",
                    "FK_Checkbox":"checkbox",
                    "Decimal":"decimal",
                    "Dropdown":"select",
                    "FK_Dropdown":"select",
                    "FK":"reference",
                    "FK_dep":"referenceDep", // su_panchayat, su_block  here panchat is dependent on block
                    "FK_obj":"referenceObjDep",
                    "Logical":"radio",
                    "Number":"number",
                    "Image":"image",
                    "Calender":"Calender"

                }
         
            })
        },
        computed:{
            ...mapGetters('ref',['getRef']),
            options(){

                let {type,value}=this.field

                let options;

                if(type==='select')
                   return value?value.split(','):[]
                   // return value?value.split(',').map(ele=>({value:ele,label:ele})):[]


                if(type==='Logical')
                {
                    options=[
                        {value:true,label:"Yes"},  // 1- for true in db
                        {value:false,label:"No"}     // 0- for falses 
                    ]
                    return options
                }

                if(type==='FK_Dropdown' || type==='FK_Checkbox')
                {
                    

                    let data=this.getRef('list') || []

                    let [list_name,list_group]=value&&value.split('->')[1].split(',') || []

                   /*  if((!data) || !Array.isArray(data))
                    {
                        console.log(" data in pageDesign list data ",data)
                    } */

                    let find=data.find((ele=>ele['list_name']===list_name && ele['list_group']===list_group)) || ({})
                            
                              
                        options=find&&find['list_value']?find['list_value'].split(',').map(ele=>({label:ele,value:ele})):[]
                    return options
                }

                options=(!value)?[]:value.split(',').map(ele=>({value:ele,label:ele}))
                return options

            }
        },
        methods:{
           getDepValues(values,fields){  // su_block  // task_objective, task_activity

                if(values[fields])
                  return values[fields]
              
              if(fields&&fields.includes(',')) // more than on dep fields
              {
                    // 'task_objective, task_activity -> ['task_ojectiveValue','task_actyivityVal]

                  return fields.split(',').map(ele=>values[ele])
   
              } 

              return null

           }

        },
        created(){

        },
        watch:{
            
        }

}
</script>

<style>

</style>