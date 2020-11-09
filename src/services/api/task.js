import http from './http'

const endPoint="/task"


export const getUserCheckInStatus=(userId)=>{

    return http.get(endPoint+'/checkinstatus/'+userId)

}

export default{
    getUserCheckInStatus
}