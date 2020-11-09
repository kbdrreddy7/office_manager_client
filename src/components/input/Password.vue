<template>
                                <q-input 

                                 dense 
                                 lazy-rules
                                 outlined 
                                 :class="{'col-xs-12 col-sm-4 col-md-3':true,'required__label':labelColor}"
                                 :debounce="debounce"        
                                 :disable="disabled"
                                 :error-message="errorMessage"
                                 :error="error"
                                 :hint="hint"
                                 :label="label" 
                                 :mask="mask"
                                 :rules="rules"
                                 :type="isPwd ? 'password' : 'text'"
                                 :value="value" 
                                 @input="$emit('input',$event)"
                                 @focus="$emit('focus',$event)"

                                >

                                 <template v-slot:append>
                                                  <q-icon
                                                    :name="isPwd ? 'fas fa-eye-slash' : 'fas fa-eye'"
                                                    class="cursor-pointer"
                                                    @click="isPwd = !isPwd"
                                                  />
                                </template>


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
        autogrow:{type:Boolean,default:true},
        mask:{type:String},
        reverseFillMask:{type:Boolean,default:false},


        //events
        focus:{type:Function},
        input:{type:Function},
        hint:{type:String,default:''}


    },
    data(){
        return({
            isPwd:true,
        })
    },
   
    created(){
    }


}
</script>

<style>

</style>