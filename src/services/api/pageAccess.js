import {httpService as http} from '..'
import qs from 'qs'

const endPoint="/page_access"

export const getCurrentUserPageAccess=(queryObj={compress:true})=>{
  let queryString=qs.stringify(queryObj)
  return http.get(endPoint+"/?"+queryString)
}

export default{
    getCurrentUserPageAccess
}