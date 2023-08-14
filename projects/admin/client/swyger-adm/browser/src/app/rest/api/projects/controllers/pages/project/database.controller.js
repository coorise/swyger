import vv from "@swyger/client";

const DatabaseController =async (args) =>{
  const {req,controller}=args;
  //You can get some Params from request
  //console.log('path : ', req.path)
  //console.log('query : ', req.query)
  //console.log('param : ', req.param)

  //You can modify the router behavior
  const router=req.$router
  //router.go('/')
  //router.back('path')
  //router.mount('path',function)
  //router.off('path')
  //router.reload()

  //get your swyger client library from route.js
  const client=req?.client
  let database=client?.database?.database()
  let auth=client?.auth?.auth()
  let user=auth?.$user

  let project=await database.ref(_DIR_PATH.PROJECTS).get({
    uid:req.params?.project
  }).val()
  let getTheOwner=async (userId)=>{
    let userInfo=await auth?.user(userId).val()
    if(userInfo.data?.data){
      userInfo=userInfo.data.data
      return userInfo?.email
    }
    return ''
  }
  if(project.data){
    project=project.data
    project.owner=await getTheOwner(project?.owner)
  }else {
    project={}
  }

  let mData=await database.ref(DIR_PATH(project.uid).ROOT+'/api/database/data').get().val()
  let countMaxData=0
  if(mData.data){
    countMaxData=mData?.data?.pagination?.max
    mData=mData?.data?.data
  }
  let pagination=3
  let partData=Object.keys(mData).splice(0,pagination)
  let actionData
  //Here, set your data to be viewed on your template like vue js
  let data={
    isList:false,
    isCreate:false,
    error:{
      project_name_exist:'',
    },
    countMaxData,
    data:mData,
    setData:{
      key:'',
      value:''
    },
    async onKeyNameTyped(event){
      let value=event.target.value
      this.setData.key=value.replace(/[^\w-_$]/g, '') //exclude some char eg "@": replace(/[^\w @]/g, '')
      let path=this.dataPath.replace(/^\/root'/,'')
      let project=await database.ref(DIR_PATH(this.project.uid).ROOT+'/api/database/data/'+path+'/'+value)?.get({})?.val()
      //console.log('Search on DB: ',project.data)
      if(project?.data?.data){
        this.error.project_name_exist='The key name already exist: '+value
        console.log('The key name already exist: '+value)
        this.setData.key=''
      }else {
        this.error.project_name_exist=''
      }
    },
    async onActionClicked(action,path){
      path=path.replace(/^\/root'/,'')
      switch (action) {
        case 'create':
          console.log('Create Got action: ',path, 'Value')
          console.log('Create Got Key: ',this.setData.key)
          console.log('Create Got Value: ',this.setData.value)
          if(this.setData.key!==''){
            //actionData=await database.ref(DIR_PATH(this.project.uid).ROOT+'/api/database/data'+'/'+path).create(this.setData).val()
          }
          break;
        case 'update':
          console.log('Update Got action: ',path)
          break;
        case 'delete':
          console.log('Delete Got action: ',path)
          //actionData=await database.ref(DIR_PATH(this.project.uid).ROOT+'/api/database/data'+'/'+path).delete().val()
          break;

      }
      this.setData={
        key:'',
        value:''
      }
    },
    partData,
    project,
    dataClicked:{},
    dataPath:'',
    addPath:'',
    pagination,
    setPagination:pagination,
    onAddPathClicked(value){
      this.addPath=value
      this.setData={
        key:'',
        value:''
      }
      this.error.project_name_exist=''
    },
    onPaginationTyped(event){
      let value=event.target.value
      if(value===''){
        this.partData=Object.keys(this.data).splice(0,3)
      }else {
        value=parseInt(value)
        if(typeof value=='number'){
          this.pagination=value
          this.setPagination=value
          this.partData=Object.keys(this.data).splice(0,value)
        }

      }
    },
    onPaginationClicked(){
      if(this.partData.length<=Object.keys(this.data).length){
        this.partData=[
          ...this.partData,
          ...Object.keys(this.data).splice(this.pagination,this.setPagination)
        ]
        this.pagination=this.pagination+this.setPagination
      }

    },
    onDataClicked(key,prevPath){
      this.dataClicked[key] = !this.dataClicked[key];
      this.dataPath=prevPath+'/'+key
    },
    DataComponent({data,prevPath}){
      let partObj=Object.keys(data).splice(0,pagination)
      return {
        $template:'#data-template',
        obj:data,
        addObjPath:'',
        partObj,
        objPath:prevPath,
        objClicked:{},
        onAddObjPathClicked(value){
          this.addObjPath=value
          this.setObj={
            key:'',
            value:''
          }
        },
        onObjClicked(key){
          this.objClicked[key] = !this.objClicked[key];
          this.objPath=this.objPath+'/'+key

        },
        setObj:{
          key:'',
          value:''
        },
        async onObjActionClicked(action,path){
          switch (action) {
            case 'create':
              console.log('Create Got action: ',path)
              //actionData=await database.ref(DIR_PATH(project.uid).ROOT+'/api/database/data').get().val()
              break;
            case 'update':
              console.log('Update Got action: ',path)
              break;
            case 'delete':
              console.log('Delete Got action: ',path)
              break;
          }
          this.setObj={
            key:'',
            value:''
          }
        },
        objPagination:pagination,
        setObjPagination:pagination,
        onObjPaginationTyped(event){
          let value=event.target.value
          if(value===''){
            this.partObj=Object.keys(this.obj).splice(0,3)
          }else {
            value=parseInt(value)
            if(typeof value=='number'){
              this.objPagination=value
              this.setObjPagination=value
              this.partObj=Object.keys(this.obj).splice(0,value)
            }

          }
        },
        onObjPaginationClicked(){
          if(this.partObj.length<=Object.keys(this.obj).length){
            this.partObj=[
              ...this.partObj,
              ...Object.keys(this.obj).splice(this.objPagination,this.setObjPagination)
            ]
            this.objPagination=this.objPagination+this.setObjPagination
          }

        },
      }
    },
    onMounted(){
    }
  }
  data.activeTab='index'

  let meta={
    title:"Aminuty Database Project | Agglomy !",
    meta: [
      {
        name: "child value",
        content: "child content value"
      },
    ]
    // name:"Name"
  }

  const views={
    // that is a way to import your template
    // the let is the name and right side is the path
    //so on your parent template, use  eg: <index/>
    index:'pages/database.html',
    sidebar:'../../api/project/components/sidebar.html',
    navbar:'../../api/project/components/navbar.html',
    $templates:[
      '../../api/project/templates/data-template.html'
    ]
  }

  //Now we render it to be visible on browser
  await controller.render({data, meta,views})
}

export default DatabaseController
