import jwt from '../services/auth/jwt/jwt'

const getToken=(req)=>{

    let token = req.headers.authorization?.replace('Bearer ','')
    if(token){
        return token
    }
    return false

}
const getTokenInfo=(req)=>{
    const token=getToken(req)
    if(token) {
        return jwt.verify(token)
    }
    return false
}

export default {
    getToken,
    getTokenInfo
}