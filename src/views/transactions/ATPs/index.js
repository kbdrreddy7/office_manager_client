import Container from './Container.vue'
import Form from './Form.vue'
import Table from './Table.vue'
import {TabHeader} from '../../../components/other'

import   TaskView , /* ,{childrenRoutes as taskChildren} */{TaskForm,TaskTable} from '../tasks'




export const childrenRoutes=[
         { path: 'create',name:'atp_create', props:true,
                        components:{
                                default:Form,
                                'header':TabHeader
                        } 
          },
         { path: ':atpId',name:'atp_details', props:true,
                        components:{
                                default:Form,
                                'header':TabHeader
                        }
        },
         { path:':atpId/task',name:'task_container_atp_task', props:true,
                        components:{
                                default:TaskView,
                                'header':TabHeader
                        },
                   children:[
                        
                               
                                        {
                                                path:'create', name:'task_atp_task_create',
                                                props:true,components:{
                                                        default:TaskForm,
                                                        header:TabHeader
                                                }
                                        },
                                        {
                                                path:':taskId', name:'task_atp_task_details',
                                                props:true,components:{
                                                        default:TaskForm,
                                                        header:TabHeader
                                                }
                                        },
                                        {
                                                path :'',name:'task_atp_default_task',
                                                props:true,components:{
                                                        default:TaskTable,
                                                        header:TabHeader
                                                }
                                        }
                                    
                        
                            ]
         },
     
       { path: '',name:'default_atp', component: Table ,props:true, alias:['table']},	


]

export default Container;
