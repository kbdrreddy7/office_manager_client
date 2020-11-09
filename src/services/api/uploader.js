import {httpService as http} from '..'
import {BASE_URL} from '../../config'
const endPoint="/uploader"

export const getFile=fileUrl=> {
    return http.get(`${endPoint}/` + fileUrl);
}


export const uploadFile=(obj) =>{
    let {formData,options}=http.convertToFormData(obj)
    return http.post(`${endPoint}/upload`,formData,options)
}

export const editFile=(fileUrl, file)=> {
    let {formData,options}=http.convertToFormData({file})
    return http.put(`${endPoint}/` + fileUrl, formData,options);
}

export const deleteFile=(fileUrl) =>{
    return http.delete(`${endPoint}/` +fileUrl);
}

export const getImage=(imageUrl)=>{
    if(!imageUrl)
      return undefined;   
    return `${BASE_URL}${endPoint}/${imageUrl}?x-auth-token=${http.getTokenHeader()}`

}


export default{
    getFile,uploadFile,editFile,
    deleteFile,getImage
}