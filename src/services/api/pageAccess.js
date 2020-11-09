import {httpService as http} from '..'

const endPoint="/page_access"

export const getCurrentUserPageAccess=()=>{
  return http.get(endPoint+"/all")
}

export default{
    getCurrentUserPageAccess
}