import {globalModule} from '../store/modules'

export default{
    methods:{
        initializeModule(path){
           
            if(!this.$store._modules.root._children[path])
            {
                this.$store.registerModule(path,globalModule) // dynamic module registration
                this.$store.dispatch(path+"/setPath",path)
            }
        
        }
    }
}