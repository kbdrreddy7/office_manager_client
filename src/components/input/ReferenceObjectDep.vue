<template>

         <q-select                 
                outlined
                dense
                :disabled="disabled"
                options-dense
                options-cover
                map-options
                :label="label"
                
                :class="{'required__label':labelColor}"

                :value="value" 
                    @input="($event)=> disabled?'': $event&&$emit('input',$event)"   
                    @focus="($event)=> disabled?'':$event&&$emit('focus',$event)"                                
                    clearable
                    @clear="($event)=> disabled?'':$emit('input',null)"
                    :options="options"  
                    :rules="rules"  
                    :error="error"
                :error-message="errorMessage"
                 :hint="hint"
                />

<!-- 
        <q-select  
          outlined
         dense 
         :value="value"
         @input="handleInput($event)"
         use-input
         :disabled="disabled"
          @filter="filterFn"
          clearable
          @clear="clear"
         :options="filteredOptions" 
          options-dense
          options-cover
          map-options
         :option-value="returnField"
         :option-label="returnLabel"
         :emit-value="true"
         :label="label" 
        :class="{'required__label':labelColor}"

         :error="error"
         :error-message="errorMessage"
         /> -->

</template>

<script>

/* 
this is useful...when..input is controlled by other fields
and the controlling fields also from the same table
eg:   task_objective, task_activeity, task_subactivity
*/

import {validationMixin,utilMixin} from '../../mixins'
import {mapGetters} from 'vuex'
export default {
  mixins:[validationMixin,utilMixin],

   props:['value',/* 'options', */'fieldInfo','label','labelColor','disabled',
   'depFieldValue',
   'rules','error','errorMessage','validate','input','hint'],
    data () {
    return {
      path:null   
    }
  },
  computed:{
     ... mapGetters('ref',['getRef']),
     options(){

         /* 
            depFieldValue={
                ctrlFields:['field1']  // or ['f1','f2']
                ctrlvalues:['val1]      // or['v1','v2']
            }
          */
          let optionsObj= this.getRef(this.path)

            let refObj=optionsObj

           if(!this.depFieldValue)  // then this is root level vale
              return Object.keys(refObj)    
            
           if(typeof this.depFieldValue==='string') // level one
           {
                return Object.keys(refObj[this.depFieldValue])
           } 

            // else moren than one tontrolling field---and corresponding values array

            this.depFieldValue.forEach(ele=>{
                if(!refObj[ele])
                    return [this.value]
                refObj=refObj[ele]
            })

        return Object.keys(refObj)


     }
  },
  methods:{
      handleInput(val){
          if(!this.disabled)
          this.$emit('input',val)
      },
      clear()
        {   if(!this.disabled)
            this.$emit('input',null)
        },
       returnLabel(obj){

        if(!this.depFieldValue) // if the controlling field is null
           return null;

        let label
            // for the first time
          if(this.value===obj)
              {
                label=this.getRefText({data:this.options,val:this.value, fields:[this.returnField,...this.fields]})
               return (label || this.value)
             }

        label=this.fields.reduce((accumlater,current)=>{
                    return accumlater+" - "+obj[current]
                  },"").substring(3)

          return label

      } ,
     
       filterFn (val, update) {
          if(!this.options) return []
          if (val === '') {
            update(() => {
  
              this.filteredOptions = this.options
            })
            return
          }

          update(() => {
            const needle = val.toLowerCase()
            this.filteredOptions = this.options.filter(v => {
              return this.returnLabel(v).toLowerCase().indexOf(needle) > -1
            })
      })
    }

      
  },
   watch:{
        value(newval){
            this.$emit('validate',this.validateRules(newval,this.rules))
        }
    
   },
  created(){


    let [path]=this.fieldInfo.split('->')
        this.path=path


 }
  
}
</script>

<style>

</style>

