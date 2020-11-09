import Container from './Container.vue'
import Form from './Form.vue'
import Table from './Table.vue'


export {default as TaskForm } from './Form.vue'
export {default as TaskTable } from './Table.vue'
export default Container;



export const childrenRoutes=[
         { path: 'create',name:'task_create', component: Form ,props:true},
         { path: ':taskId',name:'task_details', component: Form ,props:true},
         { path: '',name:'default_task', component: Table ,props:true, alias:['table']}	

]

