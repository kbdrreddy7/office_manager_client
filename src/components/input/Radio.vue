<template>
        <div >
                    <div class="c-input__outline">
                          <span :class="{'c-input__label':true,'required__label__pure':labelColor}" >{{label}}:-</span>
                       
                        <q-option-group
                            :disabled="disabled"
                            :options="options"
                            :value="value" 
                            @input="hanldeInput"  
                            color="primary"
                            inline
                            dense
                            clearable
                             :hint="hint"
                            />
                       
                    </div>
                    <div v-if="error" class="c-input__error" >{{errorMessage}}</div>
                       
         
        </div>
</template>

<script>
import {validationMixin} from '../../mixins'

export default {
          mixins:[validationMixin],
        name:"radio-input",
        props:[
            'value','options','disabled','label','labelColor','rules','error',
            'errorMessage','input','validate','hint'
        ],
        
    data(){
        return ({
        })
    },
    methods:{
      hanldeInput(val){
        if(!this.disabled)
        {
          this.$emit('input',val)
          this.$emit('validate',this.validateRules(val,this.rules))

        }

      }
    }

}
</script>

<style>

</style>