<template>
                                    <q-select                 
                                        outlined
                                        dense
                                        options-dense
                                        options-cover

                                        :class="{'required__label':labelColor}"
                                        :label="label"
                                        :disable="disabled"
                                       

                                        :value="value" 
                                         @input="($event)=> disabled?'': $event&&$emit('input',$event.value?$event.value:$event)"   
                                         @focus="($event)=> disabled?'':$event&&$emit('focus',$event.value?$event.value:$event)"                                
                                          clearable
                                          @clear="($event)=> disabled?'':$emit('input',null)"
                                         :options="options"  
                                          :rules="rules"  
                                          :error="error"
                                        :error-message="errorMessage"
                                         :hint="hint"


                                          map-options
                                         :option-value="valueField"
                                         :option-label="labelField"
                                         :emit-value="emitValue"

                                        />


</template>

<script>
export default {
    props:[
    'label','labelColor','value','options','rules','error','errorMessage','disabled',
    'emitValue','labelField','valueField',
    
    //-----
    'input','focus','hint'
    ]
}
</script>

<style>

</style>