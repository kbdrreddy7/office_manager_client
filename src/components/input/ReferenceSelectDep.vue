<template>
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
          :hint="hint"
         />

</template>

<script>


/*        we can pass this prop also
           :display-value="getRefText(options,value,[returnField,...fields])"

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
      filteredOptions:[],
      path:null,
      returnField:null,
      fields:[],
      matchField:null
   
    }
  },
  computed:{
     ... mapGetters('ref',['getRef']),
     options(){
         if(!this.depFieldValue&& this.matchField) // if any one field is not there...all options
       return this.getRef(this.path)

        let options=this.getRef(this.path)

            options =options.filter(ele=>ele[this.matchField]===this.depFieldValue)
            return options;

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


    let [path,allFields]=this.fieldInfo.split('->')
    let [returnField,...fields]=allFields.split(',') // paccnchayat-> pct_id,pct_name,pct_block

        /* 
        eg: [pct_id,pct_name,pct_block]
        */

        this.matchField=fields.pop()//pct_block

        this.fields=fields//[pct_id,pct_name]
        this.returnField=returnField
        this.path=path


 }
  
}
</script>

<style>

</style>