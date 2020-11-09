import {date,Dialog} from 'quasar'
//https://quasar.dev/quasar-utils/date-utils#Manipulate-dates

import ageService from './age'

import store from '../store'


// date formats

const formats={
     date : "Do MMM YYYY",
     dateTime : "Do MMM YYYY h:mm:ss a",
     datebaseDate : "YYYY-MM-DD",
     timestamp:"YYYY-MM-DD HH:mm:ss",
     calender : "MMMM D, YYYY",
     office:"D MMMM, YYYY",
     fmt1:"DMMMYYYY",//2JAN2020,
     fmt2:"DDMMMYYYY_HH:mm:ss",
     qDate:'YYYY/MM/DD'// 2018/11/05 // quasardate
     
}

export const formatDate=(dateObj,format='dateTime')=>{

    if (typeof dateObj === "string")
        dateObj = new Date(dateObj);


    if(format==='utcdate')
    {
        return  date.formatDate(dateObj,formats['datebaseDate'])+'T00:00:00.000Z'
    }

    return  date.formatDate(dateObj,formats[format])
}


export const getRefText=({data,val,fields})=>{
    // fields -----> [_id,name]

    if(!val) return val;

    let [id,visible]=fields
    if (!data) return data
    let obj= data.find(ele=>ele[id]===val)

    return (!obj)?obj:obj[visible]
}

export const getRefObj=({data,val,fields})=> {
    let [id]=fields
    // arr= fields   arr[0] is id field
    if (!data) return data
    return data.find(ele=>ele[id]===val)
}

export const handleFK=(pgdgFieldInfo)=>{
    let [path,fieldsInfo]=pgdgFieldInfo.split("->")
        let [id,...fields]=fieldsInfo.split(",")
        let data=store.state.ref[path]
        return ({data,id,fields})
}

export const getRefTextFromFieldInfo=({value,fieldInfo})=>{
  let {data,id,fields}= handleFK(fieldInfo)
  return getRefText({data,val:value,fields:[id,...fields]})
}

export const raiseDialog=({title='Confirm',message,onOk,onCancel,onDismiss})=>{

    Dialog.create({title,message, cancel: true,persistent: true})
     .onOk(()=>{
        if(onOk)
           onOk()
     })
     .onCancel(()=>{
        if(onCancel)
         onCancel()
     })
     .onDismiss(()=>{
        if(onDismiss)
           onDismiss()
     })

}

export default{
    formatDate,getRefText,getRefObj,handleFK,
    getRefTextFromFieldInfo,raiseDialog,
    age:ageService
    
}


