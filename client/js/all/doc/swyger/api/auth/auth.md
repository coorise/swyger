# Auth 
## Auth Route
```
 Register a user: [GET] /api/v1/auth/register/get-one
 Login a user: [GET] /api/v1/auth/login/get-one
 Update Account: [POST] /api/v1/auth/update-account/get-one
 Delete Account: [POST] /api/v1/auth/delete-account/get-one
 Refresh Token: [POST] /api/v1/auth/refresh-token/get-one
 Get User Info: [POST] /api/v1/auth/user/get-one
 Send Forgot Password: [POST] /api/v1/auth/send-forgot-password/get-one
 Verify Password Code: [POST] /api/v1/auth/verify-pass-code/get-one
 
 //-----------Users/Refresh Tokens-----------------//
 Create one user: [POST] /api/v1/auth/users/create-one
 Create many users: [POST] /api/v1/auth/users/create-many
 Find one user: [POST] /api/v1/auth/users/find-one
 Find/Query many users: [POST] /api/v1/auth/users/find-many
 Get one user: [GET] /api/v1/auth/users/find-one?query=JSON.stringify(obj)
 Get/Query many users: [GET] /api/v1/auth/users/find-many?query=JSON.stringify(obj)
 Update one user: [PUT] /api/v1/auth/users/update-one
 Update many users: [PUT] /api/v1/auth/users/update-many
 Delete one user:[DELETE] /api/v1/auth/users/delete-one
 Delete many users: [DELETE] /api/v1/auth/users/delete-many

 custom request : [Method] /api/v1/auth/users/custom
```

### Auth Setting
```
const auth =client?.auth.auth()
```

### Login
```
const user={
  email:'user1@swyger.com',
  password:'123@swyger'
}
const info=await auth.login(user).val()
console.log('login info: ', info)
//OR
  auth.login(user,({value})=>{
     console.log('login info: ', value)
  })
```
### Register
```
const user={
  email:'user1@swyger.com',
  password:'123@swyger'
}
const info=await auth.register(user).val()
console.log('register info: ', info)
//OR
  auth.register(user,({value})=>{
     console.log('register info: ', value)
  })
```
### Get The Info of an Authenticated User
```
//If no uid parameter is supplied, it will fetch the current user.
const user=await auth.user(uid).val()
console.log('user info: ', user)
 //OR
  auth.user(uid,({value})=>{
     console.log('user info: ', value)
  })

```
