## Auth

### Auth Setting
```
const auth =client.auth()
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
