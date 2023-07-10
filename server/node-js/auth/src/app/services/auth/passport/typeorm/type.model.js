
const typeToken = async (payload, done)=>{

try{
  //console.log('get the user id ', payload.uid)
  if(payload) {
    done(null, payload);
  }else  {
    return done(null, false);
  }
}catch (e) {
   done(e,false)
}


}

export default typeToken
