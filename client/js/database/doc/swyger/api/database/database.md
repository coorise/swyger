## Database

## Database Setting
```
let database=client.database()
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
        //.on() //choose your listener: .create((res)) //OR .get((res)) ...etc
        .onValue((res)=>{ //Will listen all events (create,update,delete)
          console.log('data listener: ',res.value)
        })
```
