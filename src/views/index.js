
export { default as LoginView } from  './Login.vue'
export { default as HomeView } from  './Home.vue'


export { default as ServiceUserView} from"./service-user"

export { default as TreatemenstView, childrenRoutes as TreatmentsChildren} 
from"./service-user/sub-tabs/treatments"

export { default as EvaluationView, childrenRoutes as EvaluationChildren} 
from"./service-user/sub-tabs/treatment-evaluation"



export { TaskView,ATPView} from"./transactions"


// masters
export {
     
      TestView,testRoutes,
      GlobalView,globalRoutes 
 } from  './masters'



 //-----------------children routes

 export { childrenRoutes as ServiceUserChildren} from"./service-user"
 export { childrenRoutes as AtpChildren} from"./transactions/ATPs"
 export { childrenRoutes as TaskChildren} from"./transactions/tasks"



