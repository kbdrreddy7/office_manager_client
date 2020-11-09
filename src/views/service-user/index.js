import Container from './Container.vue'
import Form from './Form.vue'
import Table from './Table.vue'
import {TabHeader} from '../../components/other'


//---------child

import TreatmentsView,{TreatsmentForm,TreatsmentTable} from './sub-tabs/treatments'



export const childrenRoutes=[

         { path: 'create',name:'serviceuser_create', props:true,
               components:{
                  default:Form,
                  'header':TabHeader
                  }  
         },
         { path: ':suId',name:"serviceuser_details",props:true,
            components:{
               default:Form,
               'header':TabHeader
               }  
         },
         { path: ':suId/treatment',name:"treatments_container_serviceuser_treatments",props:true,
            components:{
               default:TreatmentsView,
               'header':TabHeader
               },
               children:
               [
                  {
                     path:'create', name:'treatments_serviceuser_treatments_create',
                     props:true,components:{
                             default:TreatsmentForm,
                             header:TabHeader
                     }
                  },
                  {
                           path:':treatmentId', name:'treatments_serviceuser_treatments_details',
                           props:true,components:{
                                 default:TreatsmentForm,
                                 header:TabHeader
                           }
                  },
                  {
                           path :'',name:'treatments_serviceuser_default_treatments',
                           props:true,components:{
                                 default:TreatsmentTable,
                                 header:TabHeader
                           }
                  }
               ]  
         },
         { path: '',name:'default_serviceuser', component: Table ,props:true},	
]

export default Container;
