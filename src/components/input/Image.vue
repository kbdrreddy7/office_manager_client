<template>
<div class="flex-aroud" >
           <q-img
              v-if="src"
              :src="src"
              contain  class="image-adjust rounded-borders"
              style="width: 500px; height:350px"
               :hint="hint"
  
            >
               

                  <q-btn v-if="!disabled" class=" all-pointer-events" 
                    flat icon='fas fa-times' color="black" :style="{'font-size':'12px'}" 
                   @click="remove" >
                  <q-tooltip>remove</q-tooltip>
                </q-btn>
            </q-img> 

          <q-uploader
          
                v-if="!src&&!disabled"
                color="teal"
                flat
                bordered
                @added="added"
          > 

        <template v-slot:header="scope">
        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
       
          <div class="col">
            <div class="q-uploader__title">Upload Image</div>
          </div>
          <q-btn v-if="scope.canAddFiles" type="a" icon="cloud_upload" round dense flat>
            <q-uploader-add-trigger />
            <q-tooltip>Pick Files</q-tooltip>
          </q-btn>
     
        </div>
      </template>
       </q-uploader>
</div>
     
      
</template>

<script>

import {uploaderService} from '../../services'
export default {
  props:['value','on-image-remove','on-image-upload','disabled','hint'],
    data(){
      return ({
        imgObj:null,
      //  value:"serviceuser/profileimages/somid.jpeg",
        uploaderService:uploaderService
      })
    },
    computed:{
      src(){
        if(this.imgObj) return URL.createObjectURL(this.imgObj)
        if(this.value) return uploaderService.getImage(this.value)
        return null
      }
 
    },
  methods:{
    added(files){
      this.imgObj=files[0]
     this.$emit('on-image-upload',this.imgObj)
    },
     remove(){
            this.imgObj=null
            this.$emit('on-image-remove')

    }

  },
  watch:{
    
  }

}
</script>

<style>

</style>