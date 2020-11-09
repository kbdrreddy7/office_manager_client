<template>
  <q-input dense outlined 
        :disable="disabled"
        :value="date"
        :label="label" 
         :class="{'required__label':labelColor}"

        :error="error"
        :error-message="errorMessage"
        :autogrow="true" clearable
        @clear="clear"
         :hint="hint"
         >
      <template v-slot:prepend>
        <q-icon name="far fa-calendar-alt" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date :value="value" @input="calenderInput"  />
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="far fa-clock" class="cursor-pointer">
          <q-popup-proxy ref="qTimeProxy" transition-show="scale" transition-hide="scale">
            <q-time :value="value" @input="timeInput" mask="HH:mm:ss"  />
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
</template>

<script>
import {utilMixin,validationMixin} from '../../mixins'

export default {
mixins:[utilMixin,validationMixin],
 props:['value','input','focus','rules','label','labelColor','disabled',
            'error','errorMessage','hint'], 
    data(){
        return ({
            
        })
    },
    methods:{
        calenderInput(val){
             this.$emit('input',this.formatDate( val,'timestamp'))
                         this.$refs.qDateProxy.hide()

        },
        timeInput(val){
            this.$emit('input',this.formatDate( this.value.substring(0,11)+val,'timestamp'))
            this.$refs.qTimeProxy.hide()
        },
        clear()
        {
            this.$emit('input',null)
        }
    },
    computed:{
        date(){
              if(!this.value) return ""
            return this.formatDate(this.value)
        }
    },
     watch:{
        value(newval){
            this.$emit('validate',this.validateRules(newval,this.rules))
        }
    }
  
}
</script>

<style>

</style>