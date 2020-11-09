<template>
  <div class="q-pa-md">
    <div class="q-gutter-md">
      <q-date
        :events="events"
        :title="label"
        @input="handleInput"
        :value="date"
        :event-color="eventColor"

      />

    
    </div>
  </div>
</template>
<script>
import {utilMixin,validationMixin} from '../../mixins'

export default {
  mixins:[utilMixin,validationMixin],

  props:['value','label','options','colors'],
  data () {
    return {
     // value:'',
      // options:'2020-02-01T00:00:00.000Z,2020/02/01,2020/02/02,2020/02/03,2020/02/04,2020/02/10',
     /*  colors:{
        teal:'2020/02/01,2020/02/02',// or
        orange:['2020/02/03','2020/02/04','2020/02/10']
      } */
    }
  },
  computed:{
    date(){
      if(!this.value)
        return this.value

      

        return this.formatDate(this.value,'qDate')

    },

    events(){
          let events=this.options
          if(!this.options)
          return events
        
        if(typeof this.options==='string')
          events=this.options.split(',')

      
          //else array

          return events.map(ele=>this.formatDate(ele,'qDate'))

    },
    eventColorObj(){

      // converting all dates to qDate , 
      if(!this.colors)
        return {}

      let colorObj={}
       
       for(let key in this.colors)
           colorObj[key]=this.colors[key].map(ele=>this.formatDate(ele,'qDate'))

      return colorObj;
         
    }
  },

  methods: {
   handleInput(value){
      let formated=this.formatDate( value,'utcdate')
      this.$emit('input',formated)
      this.$emit('focus', formated)
   },
   eventColor(date){
     if(this.eventColorObj)
        {
          for(let key in this.eventColorObj )
          {
            if(this.eventColorObj[key].includes(date))
              return key;

          }
        }
   }
  }
}
</script>