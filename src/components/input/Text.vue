<template>
                                <q-input 

                                 dense 
                                 lazy-rules
                                 outlined 

                                 :autogrow="autogrow"
                                 :class="{'col-xs-12 col-sm-4 col-md-3':true,'required__label':labelColor}"
                                 :debounce="debounce"        
                                 :disable="disabled"
                                 :error-message="errorMessage"
                                 :error="error"
                                 :hint="hint"
                                 :label="label" 
                                 :mask="mask"
                                 :reverse-fill-mask="reverseFillMask"
                                 :rules="rules"
                                 :type="type"
                                 :value="value" 
                                 @input="$emit('input',$event)"
                                 @focus="$emit('focus',$event)"
                                >

        </q-input>
</template>

<script>
export default {
  /*   prfops:[
        //  variables
          'cssClass','debounce','disabled','value','label','labelColor',
          'rules','error','errorMessage','type','autogrow',

        //events
        'focus','input'
    ], */

    props:{
        cssClass:{type:String,default:'col-xs-12 col-sm-4 col-md-3'},
        debounce:{type:Number,default:500},
        disabled:{type:Boolean,default:false},
        value:[Number,String,Boolean],
        label:{type:String},
        labelColor:{type:String,default:''},
        rules:{type:Array},
        error:{type:Boolean,default:false},
        errorMessage:{type:String,default:null},
        type:{type:String,default:'text'},
        autogrow:{type:Boolean,default:true},
        mask:{type:String},
        reverseFillMask:{type:Boolean,default:false},


        //events
        focus:{type:Function},
        input:{type:Function},
        hint:{type:String,default:''}


    },
   
    created(){
    
    }


}
</script>

<style>

</style>