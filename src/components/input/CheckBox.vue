<template>
<div>
        <scroll-area :scroll="availableOptions&&availableOptions.length>4" >
             <template v-slot:scroll_content >
                    <div class="c-input__outline">
                          <span :class="{'c-input__label':true,'required__label__pure':labelColor}" :style="{'color':labelColor}" >{{label}}:-</span>
                        <q-option-group
                            :disabled="disabled"
                            :options="availableOptions"
                            :value="values" 
                            @input="hanldeInput"  
                            color="primary"
                            type="checkbox"
                            inline
                            dense
                             :hint="hint"
                            /> 
                          
                    </div>
                    </template>
               </scroll-area>

                    <div v-if="error" class="c-input__error" >{{errorMessage}}</div>  
     </div>                 

</template>

<script>
import {validationMixin} from '../../mixins'
import {ScrollArea} from '../other'
export default {
        components:{
            "scroll-area":ScrollArea
        },
        mixins:[validationMixin],
        name:"radio-input",
        props:['value','options','disabled','label','labelColor',
                'rules','error','errorMessage','input','validate',
                 'delimiter','join','hint'
                ],

    data(){
        return ({
        })
    },
    computed:{
        values(){
            let {value}=this
            if(!value) return []
            if(typeof value==='string') return value.split( this.delimiter ||  ',')
            return value /// array
        },
        availableOptions(){
            if(this.options && this.options.length)
              return this.options
            if(this.value)
            {
                  let optionVales=this.value
                 if(typeof this.value==='string') 
                  optionVales=this.value.split(this.delimiter ||  ',')

                return optionVales.map(ele=>({label:ele,value:ele}))
            }  

            return []
        }
    },
    methods:{
        
      hanldeInput(val){
        if(!this.disabled)
          { 
           if(this.join===false || this.join==='false')
              this.$emit('input',val)     
           else  this.$emit('input',val.join(  this.delimiter ||  ','))

            this.$emit('validate',this.validateRules(val.join(this.delimiter ||  ','),this.rules))
            }
      }
    },
    watch:{
    
    },
    created()
    {
    }

}
</script>

<style>

</style>