# Database
## Database Route
```
 Create one data: [POST] /api/v1/data/**/create-one
 Create many data: [POST] /api/v1/data/**/create-many
 Find one data: [POST] /api/v1/data/**/find-one
 Find/Query many data: [POST] /api/v1/data/**/find-many
 Get one data: [GET] /api/v1/data/**/find-one?query=JSON.stringify(obj)
 Get/Query many data: [GET] /api/v1/data/**/find-many?query=JSON.stringify(obj)
 Update one data: [PUT] /api/v1/data/**/update-one
 Update many data: [PUT] /api/v1/data/**/update-many
 Delete one data:[DELETE] /api/v1/data/**/delete-one
 Delete many data: [DELETE] /api/v1/data/**/delete-many

 custom request : [Method] /api/v1/data/**/custom
```
## Database Setting
```
let database=client.database?.database()
```
## Database Create
```
const myData={
  ...//your data
}
 database
        .ref('/storage/projects/aminuty/')
        .create(myData,(res)=>{
          console.log('data: ',res.value)
        })
 //OR synchronous
 const data=await database.ref('/storage/projects/aminuty/').create(myData).val()
 console.log('data: ',data.value)

```
## Database Read
```
database
        .ref('/storage/projects/aminuty/')
        .get(myData,(res)=>{ //if myData is not supplied, only callback will work
          console.log('data: ',res.value)
        })
 //OR synchronous
 const data=await database.ref('/storage/projects/aminuty/').get().val()
 console.log('data: ',data.value)
```
## Database Update
```
const myNewData={
  ...//your data
}
database
        .ref('/storage/projects/aminuty/')
        .update(myNewData,(res)=>{
          console.log('data: ',res.value)
        })
 //OR synchronous
 const data=await database.ref('/storage/projects/aminuty/').update(myNewData).val()
 console.log('data: ',data.value)
```
## Database Delete
```
database
        .ref('/storage/projects/aminuty/')
        .delete(myData,(res)=>{ //if myData is not supplied, only callback will work
          console.log('data: ',res.value)
        })
 //OR synchronous
 const data=await database.ref('/storage/projects/aminuty/').delete().val()
 console.log('data: ',data.value)
```

## Database CUD (Create,Update,Delete) Listener
```
//Or with socket listener
 database
        .ref('/storage/projects/aminuty/')
        .on()
        .onValue((res)=>{ //OR choose your listener: .create((res)) //OR .get((res)) ...etc
          console.log('data listener: ',res.value)
        })
```
