
import {utilService,validationsService,httpService, globalService} from '..'
import store from '../../store'


export const handlePageDesign=(fieldsArray)=>{
 
  

        let idField="_id"
        let order='updated_at';
        let fkFields={}//[ user:'usr_id,usr_name' ]  path:fields
        let fkObjFields={}//[ hierarchy:'hi_objective,hi_activity,hi_subactivity' ]  path:fields

        let tableViewFields=[]
        let columns=[]
        let rules={}

        let controllingFields={}
      

        for(let ele of fieldsArray)
        {

            let { field,label,type,value,table_seq, validations,  control_field}=ele

                rules[field]=validationsService.getRules(validations)

              

                //-----------------
                if(control_field)
                {
                    let fieldControlers=control_field.split(';')
            // profile:Developer,Admin;team:mVBRI,ASSA... field1:value1,value2;field2

                    for(let contoldFieldDetails of fieldControlers)
                    {
                        let [controlField,controlValues]=contoldFieldDetails.split(":")
                        if(!controllingFields[controlField])
                         controllingFields[controlField]={}

                        controllingFields[controlField][field]=controlValues
                    }
                    
                }


            let format;

            switch(true){
                
                    case type==="date":{
                        format=(val)=>utilService.formatDate(val,'date')
                        break
                    }
                    case type==="timestamp":{
                        format=(val)=>utilService.formatDate(val)
                        break
                    }

                    case type==="fk":{ ///FK/.test(pgdg_fieldtype)

                        if(!value)
                             {
                                 format=(val)=>val;
                                 break;
                             }
                        let [path,fields]=value.split("->") // user->_id,name
                        fkFields[path]=fields

                        format=(val)=>utilService.getRefText({data:store.state.ref[path],
                                     val,fields:fields.split(',')}) || val;
                                     break;
                    }
                    case  type==="FK_dep":{ // panchayat dependent on block

                        if(!value)
                             {
                                 format=(val)=>val;
                                 break;
                             }
                        let [path,fields]=value.split("->")
                        fkFields[path]=fields// fields

                        // ignoring the last field fields.split(',').splice(-1,1)
                        format=(val)=>utilService.getRefText({data:store.state.ref[path],
                                     val,fields:fields.split(',')}) || val;
                                     break;
                    }
                    case type==='FK_obj':{
                        let [path,fields]=value.split("->")
                        fkObjFields[path]=fields// fields
                        break;
                    }

                    default :{
                        format=val=>val
                        break
                    }

                   
            }

            // here name means field name--> but in pageDesign name means pageDesignname
            let column={...ele,name: field,label,field,sortable:true,align:'left',format}

            columns.push(column)

            if( validationsService.isNumber(table_seq) && table_seq>=0)
            tableViewFields.push(column)


        }
        
        // if id column is not the first one--> swap it to first place
        if(columns[0] && columns[0]['name']!==idField)
        {
            let idIndex=columns.findIndex(ele=>ele['name']===idField)
            if(idIndex>0){
                //swapping
                let temp=columns[0]
                columns[0]=columns[idIndex]
                columns[idIndex]=temp
            }

        }


       // tableViewFields=tableViewFields.sort((a,b)=>a.table_seq-b.table_seq)


        return ({order,columns,fkFields,fkObjFields,controllingFields, tableViewFields,rules})
}


const manageList=async()=>{


    let {data}=await httpService.get('/list/customizedlists')

    let objArray=[]
  
    for(let ele in data)
    {
      for( let key in data[ele])
      {
           let values=data[ele][key]
  
           let obj={list_name:ele,list_group:key,list_value:values.join(',')}
           objArray.push(obj)
      }
    }



    /* let resArr= */await globalService.addBulk('list',objArray)


}

export default {
    handlePageDesign,manageList
}