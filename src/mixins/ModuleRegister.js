import {globalModule} from '../store/modules'

export default{
    methods:{
        initializeModule(path){
           
            if(!this.$store._modules.root._children[path])
            {
                this.$store.registerModule(path,globalModule)
                this.$store.dispatch(path+"/setPath",path)
            }
        
        }
    }
}