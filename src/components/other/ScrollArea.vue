<template>
  <div>
        <q-scroll-area 
          v-if="scroll"
         :thumb-style="thumbStyle"
        :bar-style="barStyle"
        style="height: 200px;">
              <slot  name="scroll_content"></slot>
        </q-scroll-area>

      <slot v-else  name="scroll_content"></slot>

  </div>
  
</template>

<script>
export default {
    props:['scroll'],

    data(){
      return({
         thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: '#027be3',
        width: '5px',
        opacity: 0.75
      },

      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: '#027be3',
        width: '9px',
        opacity: 0.2
      }
      })
    },
    created(){
    }
}
</script>

<style lang="scss" scoped>

 
</style> >

