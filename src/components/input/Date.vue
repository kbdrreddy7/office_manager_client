<template>
             <q-input outlined dense 
                    :disable="disabled"
                    :value="date"
                    :label="label" 
                    :class="{'required__label':labelColor}"
                    :error="error"
                    :error-message="errorMessage"
                    clearable
                    @clear="clear"
                    :autogrow="true"
              >
                <template v-slot:append>
                    <q-icon name="far fa-calendar-alt" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date 
                        :value="date"                   
                         @input="calenderInput"
                         :title="label"
                          :hint="hint"
                          />
                    </q-popup-proxy>
                    </q-icon>
                </template>
            </q-input>
</template>

<script>
import {utilMixin,validationMixin} from '../../mixins'
export default {
        mixins:[utilMixin,validationMixin],
        props:['value','input','focus','rules','label','labelColor','disabled','validate',
                'error','errorMessage','hint'],

    data(){
        return ({
            
        })
    },
    methods:{     
        calenderInput(val){

            let formated=this.formatDate( val,'utcdate')
            this.$emit('input',formated)
             this.$emit('focus', formated)
            this.$refs.qDateProxy.hide()
        },
        clear()
        {
            this.$emit('input',null)
        }
    },
    computed:{
        date(){
            if(!this.value) return ""
            return this.formatDate(this.value,'date')
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