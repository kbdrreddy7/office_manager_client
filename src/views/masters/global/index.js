import Container from './Container.vue'
import Form from './Form.vue'
import Table from './Table.vue'



export const childrenRoutes=[
         { path: '', component: Table ,props:true},	
         { path: 'table', component: Table ,props:true},	
         { path: 'create', component: Form ,props:true},
         { path: ':id', component: Form ,props:true}
]

export default Container;
