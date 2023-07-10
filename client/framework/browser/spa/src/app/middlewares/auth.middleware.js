export default class AuthMiddleware {
    required=(req)=>{
      //const router=req.$router
      //console.log('accessToken ', localStorage.getItem("accessToken"))
      if(localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")){
            //console.log('Ok verified')
            return true
        }
        else {
          //router.redirect('/auth')
          window.top.location.href = '/login'
        }

    }
    isLoggedIn=(req)=>{
      //const router=req.$router
      //console.log('accessToken ', localStorage.getItem("accessToken"))
        //so that users won't go to login or register page they are already logged in.
      if(localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")){
        //router.redirect('/home')
        window.top.location.href = '/home'
      }


    }
}
