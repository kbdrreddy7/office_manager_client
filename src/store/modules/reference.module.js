import {globalService} from '../../services'
import {REFERENCE} from '../mutation-types'

const state=()=>({
    loading:false,
    loaded:{}  // key(path): true
 })
 
 const actions={
    
    loadRefObj:async({commit,state},{path,query})=>{

        if(state[path])
        return // already exists

      let {data}= await globalService.getAll(path,{...query,limit:-1})
            /*   target to achieve---
                row-> hi_subject, hi-activity, hi_subactivity1
                row-> hi_subject, hi-activity, hi_subactivity2
                
                data={
                    hi_subject:{
                        activity:{
                            hi_subactivity1:"hi_subactivity1",
                             hi_subactivity2:"hi_subactivity2"
                        }
                    }
                }
             */
            let fields=query.fields.split(',')// [hi_subject, hi-activity, hi_subactivity]

            const mangeDeepObject=(ref,index,fields,row)=>{
                // [hi_subject, hi-activity, hi_subactivity]

                let field=fields[index]
                let value=row[field]
            
                    if(!ref[value])
                    ref[value]={}
            
                    if(index===fields.length-1)
                    {
                        ref[value]=value
            
                        return
                    }
            
                  
                mangeDeepObject(ref[value], index+1, fields,row)  

            }

            let modifiedObj={}
             for (let row of data)
             {
                mangeDeepObject(modifiedObj,0,fields,row)
             }

             commit(REFERENCE.SET_REF,{path,data:modifiedObj})



    },

    loadRef:async({commit,state},{path,query={}})=>{
        
        if(state[path])
          return // already exists

          commit(REFERENCE.SET_REF,{path,data:[]})// set something...bcz ...while loading .it may call again

        let {data}= await globalService.getAll(path,{...query,limit:-1})    
        
        commit(REFERENCE.SET_REF,{path,data})
    },
    handleFkFields:async({dispatch},fkFields={})=>{
        for( let key in fkFields)
        {
                await dispatch('loadRef',{path:key,query:{attributes:fkFields[key]}})
        }

    },
    handleFkObjFields:async({dispatch},fkObjFields={})=>{
        for( let key in fkObjFields)
        {
                await dispatch('loadRefObj',{path:key,query:{attributes:fkObjFields[key]}})
        }
    }

 }
 
 const mutations={
     [REFERENCE.SET_REF]:(state,{path,data})=>{
         state[path]=data
     },
     [REFERENCE.SET_LOADING]:(state,loading)=>{
         state.loading=loading
     }
 }
 
 const getters={
    
    getRef:(state)=>(path)=>(state[path] || []),
    getRefMatch:(state)=>({path,key,val})=>{

        if(!state[path]) return ({})

        return state[path].find(ele=>ele[key]===val) || ({})
    }

 }
 
 export default {
     namespaced: true,
     state,
     actions,
     mutations,
     getters
 }