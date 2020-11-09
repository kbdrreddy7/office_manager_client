<template>
        <text-input
                    :autogrow="false"

                    :disabled="disabled"
                    :value="parseFloat(value).toFixed(decimals)" 
                    :label="label" 
                    :label-color="labelColor"
                    :rules="rules"
                    :error="error"
                    :error-message="errorMessage"
                    @input="$emit('input', $event)"  
                    :mask="mask" 
                    :fill-mask="0"
                    :reverse-fill-mask="true"
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
        decimals:{type:Number,default:2},
        hint:{type:String,default:''}

    },
    computed:{
        mask(){
            let mask=""
            for(let i=0; i<this.decimals; i++ )
                mask+='#'
             return `#.${mask}`;   

        }
    },
    created(){
    },
    components:{
        'text-input':TextInput
    }
}
</script>

<style>

</style>