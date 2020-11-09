<template>
        <q-select  
          outlined
          dense 


         :disable="disabled"
         :value="value"
         @input="($event)=> disabled?'': $event&&$emit('input',$event)"   
         use-input
          @filter="filterFn"
          clearable
          @clear="()=> disabled?'': $event&&$emit('input',null)"   

         :options="filteredOptions" 
          options-dense
          options-cover
          map-options
         :option-value="valueField"
         :option-label="getLabel"
         :emit-value="emitValue===false?false: true"
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
   'emitValue',
   'rules','error','errorMessage','validate','input','hint'],
    data () {
    return {
      filteredOptions:[],
      path:null,
      valueField:null,
      fields:[]
   
    }
  },
  computed:{
     ... mapGetters('ref',['getRef']),
     options(){
       return this.getRef(this.path)
     }
  },
  methods:{
      
      
       getLabel(obj){


    let label
            // for the first time
          if(this.value===obj)
              {
                label=this.getRefText({data:this.options,val:this.value, fields:[this.valueField,...this.fields]})
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
              return this.getLabel(v).toLowerCase().indexOf(needle) > -1
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
    let [valueField,...fields]=allFields.split(',')

    this.fields=fields
    this.valueField=valueField
    this.path=path
 }
  
}
</script>

<style>

</style>