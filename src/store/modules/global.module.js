import {globalService,pageDesignService} from '../../services'
import { GLOBAL } from '../mutation-types'

const state=()=>({
   name:null,
   fields:[],
   columns:[],// required for table columns
   data:[],
   path:null,
   count:0, // totla records available in backend,
   idField:"_id",
   loading:false,
   order:null,
   fkFields:{},
   fkObjFields:{},
   tableViewFields:[],
   loadedObjs:{}, // to track loaded objs,
   rules:{}, // field:validation rules arry
   controllingFields:{}
})

const actions={

    getAll:async({state:{path ,order },commit},query={})=> {
        if(order)
          query.order=order
        let {data,count}= await globalService.getAll(path,{...query})//,sort:`${state.lastmodifieddt}`  
        commit(GLOBAL.SET_COUNT,count)
        commit(GLOBAL.SET_DATA,data)

    },
    setPath:({commit},path)=>{
            commit(GLOBAL.SET_PATH,path)
    },
    loadPageDesign:async({commit,dispatch,state:{path,fields}})=>{

            if(fields&& fields.length)
                  return;  // if already loaded

           let {data}= await globalService.getPageDesign(path)
           let {columns,fkFields,fkObjFields,tableViewFields,rules,controllingFields,order
                }=pageDesignService.handlePageDesign(data)
          
           commit(GLOBAL.SET_FIELDS,data)
           commit(GLOBAL.SET_FK_FIELDS,fkFields)
           commit(GLOBAL.SET_FK_OBJ_FIELDS,fkObjFields)

           await dispatch('ref/handleFkFields',fkFields,{root:true})
           await dispatch('ref/handleFkObjFields',fkObjFields,{root:true})


           commit(GLOBAL.SET_TABLE_VIEW_FIELDS,tableViewFields)
           //commit(GLOBAL.SET_NAME,name)
           commit(GLOBAL.SET_RULES,rules)
           commit(GLOBAL.SET_CONTROLLING_FIELDS,controllingFields)
           commit(GLOBAL.SET_COLUMNS,columns)
           //commit(GLOBAL.SET_ID_FIELD,idField)

           if(order)
           commit(GLOBAL.SET_ORDER_FIELD,`${order?order+":desc":null}`)
           
    },
    loadOne:async({commit,state},objId)=>{
        if(state.loadedObjs[objId])
            return state.loadedObjs[objId]
        let {data}=await globalService.getOne(state.path,objId)    
        commit(GLOBAL.SET_LOADED_OBJ,{objId,obj:data})
        return data
    },
    addOne:async({commit,state},{obj})=>{
        let {data}=await globalService.addOne(state.path,obj)
        let newData=[data,...state.data]
        commit(GLOBAL.SET_DATA,newData)
        commit(GLOBAL.SET_COUNT,newData.length)
        commit(GLOBAL.SET_LOADED_OBJ,{objId:data[state.idField],obj:data})


        return data

    },
    editOne:async({commit,state},{objId,obj})=>{

       let {data}= await globalService.updateOne(state.path,objId,obj)
       commit(GLOBAL.SET_LOADED_OBJ,{objId,obj:data})

        let newData=state.data.map(ele=>{
            if(ele[state.idField]===objId)
               return data
             else return ele  
        })

        commit(GLOBAL.SET_DATA,newData)

        return data

    },
    deleteOne:async({commit,state},{objId})=>{

         await globalService.deleteOne(state.path,objId)
         let newData=state.data.filter(ele=>ele[state.idField]!==objId)
         commit(GLOBAL.SET_DATA,newData)

    }

}

const mutations={
    [GLOBAL.SET_NAME]:(state,name)=>{
        state.name=name
    },
    [GLOBAL.SET_FIELDS]:(state,fields)=>{
        state.fields=fields
    },
    [GLOBAL.SET_FK_OBJ_FIELDS]:(state,fkObjFields)=>{
        state.fkObjFields=fkObjFields
    },

    [GLOBAL.SET_COLUMNS]:(state,columns)=>{
            state.columns=columns
    },
    [GLOBAL.SET_DATA]:(state,data)=>{
        state.data=data
    },
    [GLOBAL.SET_PATH]:(state,path)=>{
        state.path=path
    },
    [GLOBAL.SET_COUNT]:(state,count)=>{
        state.count=count
    },
    [GLOBAL.SET_ID_FIELD]:(state,idField)=>{
        state.idField=idField
    },
    [GLOBAL.SET_LOADING]:(state,loading)=>{
        state.loading=loading
    },
    [GLOBAL.SET_ORDER_FIELD]:(state,order)=>{
        state.order=order
    },
    [GLOBAL.SET_FK_FIELDS]:(state,fkFields)=>{
        state.fkFields=fkFields
    },
    [GLOBAL.SET_TABLE_VIEW_FIELDS]:(state,tableViewFields)=>{
        state.tableViewFields=tableViewFields
    },
    [GLOBAL.SET_LOADED_OBJ]:(state,{objId,obj})=>{
        state.loadedObjs[objId]=obj
    },
    [GLOBAL.SET_RULES]:(state,rules)=>{
        state.rules=rules
    },
    [GLOBAL.SET_CONTROLLING_FIELDS]:(state,controllingFields)=>{
        state.controllingFields=controllingFields
    }

}

const getters={
    name:({name})=>name,
    fields:({fields})=>fields,
    columns:({columns})=>columns,
    data:({data})=>data,
    path:({path})=>path,
    count:({count})=>count,
    idField:({idField})=>idField,
    loading:({loading})=>loading,
    sort:({sort})=>sort,
    fkFields:({fkFields})=>fkFields,
    tableViewColumns:({tableViewColumns})=>tableViewColumns,
    rules:({rules})=>rules



}

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
}