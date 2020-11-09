import Container from './Container.vue'
import Form from './Form.vue'
import Table from './Table.vue'


export {default as TreatsmentForm } from './Form.vue'
export {default as TreatsmentTable } from './Table.vue'
export default Container;



export const childrenRoutes=[
         { path: 'create',name:'treatment_create', component: Form ,props:true},
         { path: ':treatmentId',name:'treatment_details', component: Form ,props:true},
         { path: '',name:'default_treatment', component: Table ,props:true, alias:['table']}	

]

