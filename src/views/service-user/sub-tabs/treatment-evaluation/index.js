import Container from './Container.vue'
import Form from './Form.vue'
import Table from './Table.vue'


export {default as EvaluationForm } from './Form.vue'
export {default as EvaluationTable } from './Table.vue'
export default Container;



export const childrenRoutes=[
         { path: 'create',name:'evaluation_create', component: Form ,props:true},
         { path: ':evaluationId',name:'evaluation_details', component: Form ,props:true},
         { path: '',name:'default_evaluation', component: Table ,props:true}	

]

