## Storage Route
```
 Upload one or many files: [POST] /api/v1/storage/**/upload?query=JSON.stringify(obj)
 Download one file: [GET] /api/v1/storage/**/download-one
 Download many files: [GET] /api/v1/storage/**/download-many //only avilabe for locale storage
 Create one folder: [POST] /api/v1/storage/**/create-one
 Create many folders: [POST] /api/v1/storage/**/create-many
 Find one folder or file: [POST] /api/v1/storage/**/find-one
 Find/Query many folders or files: [POST] /api/v1/storage/**/find-many
 Get one folder or file: [GET] /api/v1/storage/**/find-one?query=JSON.stringify(obj)
 Get/Query many folders or files: [GET] /api/v1/storage/**/find-many?query=JSON.stringify(obj)
 Update one folder or file: [PUT] /api/v1/storage/**/update-one
 Update many folders or files: [PUT] /api/v1/storage/**/update-many
 Delete one folder or file:[DELETE] /api/v1/storage/**/delete-one
 Delete many folders or files: [DELETE] /api/v1/storage/**/delete-many

 custom request : [Method] /api/v1/storage/**/custom
```
Note: The '**' means path where your files should be saved or located
## Storage Setting and Path Example
```
const storage=client.storage(location,config)
      .ref('/path')
      //.private() // private for socket io
      .child('/child')
```
-location: local|aws|discord

-option:

   *discord:{ token, channelId}

   *aws:{}

<span style="color: red;font-size:20px">***Note:*** </span>  In your request (get(),find(),create(),delete()...) argument, you should always declare if you are fetching file
or folder with {isFolder:true|false}
### Storage Listener Example
```
//Listen file or folder
storage
      .on()
      .upload(({value})=>{
         console.log('storage : ',value)
       })
       //OR if you want to listen all events (upload,delete,update)
       .onValue(({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Upload Single File Example
```
//Upload Single File
const blob = new Blob(["This is a sample file content."], {
      type: "text/plain;charset=utf-8",
    })
storage
      .upload({
          file:blob //OR file:{data:blob, name}
       },({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Update Single File Example
```
//Delete Single File
storage
      .update({
          isFolder:false,
          name:'new-name.extention' // rename the file
          newPath:'/new-path' //to move file somewhere
          uid:'jkjkjjjhjnjnjnjnj-yugyy' //the uid of the file
       },({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Get Single File Info Example
```
//Get Single File Info
storage
      .find({ //Or .get({
          isFolder:false,
          uid:'jkjkjjjhjnjnjnjnj-yugyy' //the uid of the file
       },({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Delete Single File Example
```
//Delete Single File
storage
      .delete({
          isFolder:false,
          uid:'jkjkjjjhjnjnjnjnj-yugyy' //the uid of the file
       },({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Download Single File Example
```
//Download Single File
storage
      .find({ //Or .get({
          isFolder:false,
          withFile:true,
          //to handle blob data for socket, visit: https://blog.takeer.com/streaming-binary-data-using-socket-io/
          //broadcastFile:true //in case you want to broadcast it through socket io on().find(callback)
          uid:'jkjkjjjhjnjnjnjnj-yugyy' //the uid of the file
       },({value})=>{
         console.log('storage : ',value)
       })
       //OR
       .download({ //download comes with withFile:true already
          uid:'jkjkjjjhjnjnjnjnj-yugyy' //the uid of the file
       },({value})=>{
         console.log('storage : ',value) //stream blob value
       })
```
### Storage Upload Multiple Files Example
```
//Upload Multiple Files
storage
      .upload({
          directory:[
            {
              file:blob //OR file:{data:blob, name}
            },
            {
              file:blob //OR file:{data:blob, name}
            }
          ]
       },({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Download Multiple Files or Folders Example
```
//Download Multiple Files or Folders
storage
      .find({
          isFolder:false,
          withFile:true,
          //You can choose files or folders
          //files:[uid1,uid2,...] //for the moment only available for locale storage api
          //folders:['folder1','folder2',...] //for the moment only available for locale storage api
       },({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Delete Multiple Files Example
```
//Delete Multiple Files
storage
      .delete({
          isFolder:false,
          withFile:true,
          files:[uid1,uid2,...]
       },({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Create Single Folder Example
```
//Create Single File
storage
      .create({
          isFolder:true,
          name:'folder1'
          //If there is no name, it will take your ref('path')
          //to create folder if not exist,
       },({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Get  Folder Content Example
```
//Get Folder Content
storage
      .find({ //it will take your ref('path')
          isFolder:true,
       },({value})=>{
         console.log('storage : ',value)
       })
```
### Storage Create Multiple Folders Example
```
//Create Multiple Folders
storage
      .create({
          isFolder:false,
          folders:['folder1','folder2',...]
       },({value})=>{
         console.log('storage : ',value)
       })
```

### Storage Find  Files with Query Example
```
//Find Files With Query
storage
      .query({
          isFolder:false,
          where:  [
            ['path','like','/storage*'],
            order:[
                ['version']
            ],
            option:{
              exclude:['title','name'],
              include:['fullName'],
              snapshots:false //don't use snapshot
            },
             skip:5, //where entities should start , pagination start
             take:10, //number of data that should be taken , pagination end
          ]
       },({value})=>{
         console.log('storage : ',value) //array values
       })
```

