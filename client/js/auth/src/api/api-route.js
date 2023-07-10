let generateQuickGuid=()=>{
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
}
let privateRequest=(()=>{
  return '/ps'+generateQuickGuid()+'/pe'
})()
const crudRoute={
  req:'/custom',
  create:{
    one:'/create-one',
    many:'/create-many',
  },
  send:{
    one:'/send-one',
    many:'/send-many',
  },
  find:{
    one:'/find-one',
    many:'/find-many',
  },
  get:{
    one:'/get-one',
    many:'/get-many',
  },
  query:{
    many:'/get-many',
  },
  update:{
    one:'/update-one',
    many:'/update-many',
  },
  delete:{
    one:'/delete-one',
    many:'/delete-many',
  },
}
const listenRoute={
  create:'/create',
  find:'/find',
  get:'/get',
  query:'/get',
  update:'/update',
  delete:'/delete',
  req:'/custom',
  upload:'/upload',
  send:'/send',
  user:{
    base:'/user',
    example:'/user/device-connected',
    join:'',
    status:'/user/status',
    device:{
      connected:'/user/device-connected',
      removed:'/user/device-removed',
      disconnected:'/user/device-disconnected'
    }
  },

}
const emitRoute={
  user:{
    base:'/user',
    //example:'/user/device-remove',
    device:{
      remove:'/user/device-remove',
      list:'/user/device-list'
    }
  },
  users:{
    base:'/users',
    device:{
      list:'/users/device-list'
    }
  }
}

const authRoute={
    base:'/auth',
    //example:'/auth/login**/get-one',
    login:'/login/get-one',
    verify_token_code:'/verify-token-code/get-one',
    verify_pass_code:'/verify-pass-code/get-one',
    verify_email_code:'/verify-email-code/get-one',
    req:'/custom',
    user:'/user/'+privateRequest+'/get-one',
    register:'/register/get-one',
    forgotPassword:'/forgot-password/get-one'+privateRequest+'/get-one',
    deleteAccount:'/delete-account/get-one',
    refreshToken:'/refresh-token'+privateRequest+'/get-one',
    users:{
      base:'/users',
      //example:'/auth/users**/create-one',
    },
}

export {
  listenRoute,
  emitRoute,
  crudRoute,
  authRoute,
}
