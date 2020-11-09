<template>
        <text-input
                    :autogrow="false"
                    :type="'number'"
                    :class="{'required__label':labelColor}"

                    :disabled="disabled"
                    :value="value" 
                    :label="label" 
                    :rules="rules"
                    :error="error"
                    :error-message="errorMessage"
                    @input="$emit('input', $event)"   
                    @focus="$emit('focus',$event)"
                     :hint="hint"

        >

        </text-input>
</template>

<script>
import {TextInput} from '.'
export default {
     props:{
        cssClass:{type:String,default:'col-xs-12 col-sm-4 col-md-3'},
        debounce:{type:Number,default:500},
        disabled:{type:Boolean,default:false},
       value:[Number,String],
        label:{type:String},
        labelColor:{type:String,default:''},
        rules:{type:Array},
        error:{type:Boolean,default:false},
        errorMessage:{type:String,default:null},


        //events
        focus:{type:Function},
        input:{type:Function},
        hint:{type:String,default:''}

    },
    components:{
        'text-input':TextInput
    }
}
</script>

<style>

</style>