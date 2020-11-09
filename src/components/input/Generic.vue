<template>
        <div>
        <component :is="'text-input'" v-if="type==='text' || type==='FK' || type==='Logical' "
                                
                                    :disabled="disabled"
                                    :value="value" 
                                    :label="label" 
                                    :label-color="labelColor"

                                    :rules="rules"
                                    :error="error"
                                    :error-message="errorMessage"
                                    @focus="$emit('focus',$event)"
                                    @input="$emit('input',$event)"
                                    @validate="$emit('validate',$event)"

                                    :type="type"
                                    :mask="mask"
                                    :hint="hint"

            >

            </component>

            <component
            :is="'password-input'"
            v-if="type==='password'"
                                    :disabled="disabled"
                                    :value="value" 
                                    :label="label" 
                                    :label-color="labelColor"

                                    :rules="rules"
                                    :error="error"
                                    :error-message="errorMessage"
                                    @focus="$emit('focus',$event)"
                                    @input="$emit('input',$event)"
                                    @validate="$emit('validate',$event)"
                                    :mask="mask"
                                    :hint="hint"
            >
            </component>

            <number-input v-if="type==='number'"
                                
                                    :disabled="disabled"
                                    :value="value" 
                                    :label="label" 
                                    :label-color="labelColor"

                                    :rules="rules"
                                    :error="error"
                                    :error-message="errorMessage"
                                    @focus="$emit('focus',$event)"
                                    @input="$emit('input',$event)"

                                    :mask="mask"
                                     :hint="hint"

            >

            </number-input>    



         <decimal-input v-if="type==='decimal'"
                                
                                    :disabled="disabled"
                                    :value="value" 
                                    :label="label" 
                                    :label-color="labelColor"

                                    :rules="rules"
                                    :error="error"
                                    :error-message="errorMessage"
                                    @focus="$emit('focus',$event)"
                                    @input="$emit('input',$event)"
                                     :hint="hint"

            >

            </decimal-input>    


            <radio-input v-if="type==='radio'"
                                                                   
                                    :options="options"

                                    :disabled="disabled"
                                    :value="value" 
                                    :label="label" 
                                    :label-color="labelColor"

                                    :rules="rules"
                                    :error="error"
                                    :error-message="errorMessage"
                                    @focus="$emit('focus',$event)"
                                    @input="$emit('input',$event)"
                                    @validate="$emit('validate',$event)"
                                     :hint="hint"

                >

            </radio-input> 
            <checkbox-input v-if="type==='checkbox'"


                        :options="options"

                        :disabled="disabled"
                        :value="value" 
                        :label="label" 
                        :label-color="labelColor"

                        :rules="rules"
                        :error="error"
                        :error-message="errorMessage"
                        @focus="$emit('focus',$event)"
                        @input="$emit('input',$event)"
                        @validate="$emit('validate',$event)"

                        :join="join"
                        :delimiter="delimiter"
                         :hint="hint"

            >
                            
            </checkbox-input>

            <select-input v-if="type==='select'" 

                        :options="options"

                        :disabled="disabled"
                        :value="value" 
                        :label="label" 
                        :label-color="labelColor"

                        :rules="rules"
                        :error="error"
                        :error-message="errorMessage"
                        @focus="$emit('focus',$event)"
                        @input="$emit('input',$event)"
                        @validate="$emit('validate',$event)"
                        :hint="hint"

                        

            >

            </select-input>
            <date-input
                v-if="type==='date'"


                    :disabled="disabled"
                    :value="value" 
                    :label="label" 
                    :label-color="labelColor"

                    :rules="rules"
                    :error="error"
                    :error-message="errorMessage"
                    @focus="$emit('focus',$event)"
                    @input="$emit('input',$event)"
                    @validate="$emit('validate',$event)"

                >

            </date-input>
            <date-time-input
                v-if="type==='datetime'"

                    :disabled="disabled"
                    :value="value" 

                    :label="label" 
                    :label-color="labelColor"

                    :rules="rules"
                    :error="error"
                    :error-message="errorMessage"
                    @focus="$emit('focus',$event)"
                    @input="$emit('input',$event)"
                    @validate="$emit('validate',$event)"
                     :hint="hint"
            >

            </date-time-input>
            <reference-select
              v-if="type==='reference'"

                :value="value"
                :field-info="fieldInfo"

                @focus="$emit('focus',$event)"
                @input="$emit('input',$event)"
                @validate="$emit('validate',$event)"
                :label="label"
                :label-color="labelColor"

                :rules="rules"
                :error="error"
                :error-message="errorMessage"
                :disabled="disabled"
                :emit-value="emitValue"
                :hint="hint"


            >
                
            </reference-select>
            <reference-input-dep
             v-if="type==='referenceDep'"
                :dep-field-value="depFieldValue"
              :value="value"
              :field-info="fieldInfo"

             @focus="$emit('focus',$event)"
              @input="$emit('input',$event)"
             @validate="$emit('validate',$event)"
              :label="label"
              :label-color="labelColor"
            
                :rules="rules"
                :error="error"
                :error-message="errorMessage"
                 :disabled="disabled"
                  :hint="hint"
            >

            </reference-input-dep>
            <reference-input-dep-obj
               v-if="type==='referenceObjDep'"
                :dep-field-value="depFieldValue"
              :value="value"
              :field-info="fieldInfo"

             @focus="$emit('focus',$event)"
              @input="$emit('input',$event)"
             @validate="$emit('validate',$event)"
              :label="label"
              :label-color="labelColor"
            
                :rules="rules"
                :error="error"
                :error-message="errorMessage"
                 :disabled="disabled"
                  :hint="hint"
            >

            </reference-input-dep-obj>

            <image-input
             v-if="type==='image'"
              @on-image-remove="$emit('on-image-remove')"
             @on-image-upload="file=>$emit('on-image-upload',file)"
              :disabled="disabled"
                :value="value"
                :hint="hint"
            >

            </image-input>
            <calender-input v-if="type==='Calender'"

              :value="value"
              :field-info="fieldInfo"

             @focus="$emit('focus',$event)"
              @input="$emit('input',$event)"
             @validate="$emit('validate',$event)"

             :options="options"

             :label="label"
             :label-color="labelColor"
              :rules="rules"
              :error="error"
              :error-message="errorMessage"
              :disabled="disabled"
              :hint="hint"
              :colors="colors"


            ></calender-input>


        </div>
             
</template>

<script>

//                    :dep_field_value="depFieldValue"

import {TextInput,NumberInput,DecimalInput, /* ,RadioInput */} from '.'
import RadioInput from "./Radio.vue"
import CheckBoxInput from "./CheckBox.vue"
import SelectInput from './Select.vue'
import DateInput from './Date.vue'
import DateTimeInput from './DateTime.vue'
import ReferenceSelect from './ReferenceSelect.vue'
import ReferenceSelectDep from './ReferenceSelectDep.vue'
import ReferenceObjectDep from './ReferenceObjectDep.vue'

import ImageInput from './Image.vue'
import Calender from './Calender'
import Password from './Password'


/* 
Note*:   import by destructuring is not working...for radio and checkbox..giving error...
     component name not registerd properly
*/



export default {
    components:{
        'text-input':TextInput,
        'number-input':NumberInput,
        "decimal-input":DecimalInput,
        "radio-input": RadioInput,
        "checkbox-input":CheckBoxInput,
        "select-input":SelectInput,
        "date-input":DateInput,
        "date-time-input":DateTimeInput,
        "reference-select":ReferenceSelect,
        "reference-input-dep":ReferenceSelectDep,
        "reference-input-dep-obj":ReferenceObjectDep,
        "image-input":ImageInput,
        "calender-input":Calender,
        "password-input":Password

    },
    props:[
        'autogrow',
        'cssClass',
        'debounce',
        'disabled',
        'depFieldValue',
        'errorMessage',
        'error',
        'emitValue',
        'fieldInfo',
        'label',
        'labelColor',
        'mask',
        'rules',
        'type',
        'options',
        'value',


            //
        'colors', // for calender
        'delimiter',
        'focus',
        'hint',
        'input',
        'join',
        'on-image-remove',
        'on-image-upload',
        'validate',

            ],
    /* props:{
        cssClass:{type:String,default:'col-xs-12 col-sm-4 col-md-3'},
        debounce:{type:Number,default:500},
        disabled:{type:Boolean,default:false},
        value:{type:[String,Array]},
        label:{type:String},
        labelColor:{type:String,default:''},
        rules:{type:Array},
        error:{type:Boolean,default:false},
        errorMessage:{type:String,default:null},
        type:{type:String,default:'text'},
        autogrow:{type:Boolean,default:true},
        mask:{type:String},
        options:{type:Array},


        //events
        focus:{type:Function},
        input:{type:Function},
        validate:{type:Function}
s
    }, */
    data(){
        return ({
            
        })
    },
    methods:{
        
    },
    created(){

    }


}
</script>

<style>

</style>