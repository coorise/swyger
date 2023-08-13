import hasPermission from "../../../../../helpers/has-permission.js";
import {nextTick} from "../../../../../../resources/vendors/vue/index.js";

const ListController =async (args) =>{
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


  let permissions=await hasPermission({
    database,
    path:_DIR_PATH.PROJECTS,
    actions: ['read', 'manage'],
    userId:user?.uid
  })
  //console.log('Projects List->Has Permissions: ',permissions)
  let getTheOwner=async (userId)=>{
    let userInfo=await auth?.user(userId).val()
    if(userInfo.data?.data){
      userInfo=userInfo.data.data
      return userInfo?.email
    }
    return ''
  }

  let projects=[]
  let projectsObj=await database.ref(_DIR_PATH.PROJECTS).get().val()
  if(projectsObj?.data?.data){
    let keys=Object.keys(projectsObj?.data?.data)
    for (const key of keys) {
      projectsObj.data.data[key].owner=await getTheOwner(projectsObj.data.data[key]?.owner)
      projects.push(projectsObj?.data?.data[key]);
    }
    //console.log('Projects List: ',projects)
  }

  //Here, set your data to be viewed on your template like vue js
  let data={
    isCreate:false,
    isList:true,
    projects,
    async deleteProject(projectId){
      let project=await database.ref(_DIR_PATH.PROJECTS+'/'+projectId).delete().val()
      if(project.data?.uid){
        this.projects=this.projects.filter((item)=>item?.uid!==projectId)
        //console.log('Projects List: ',this.projects)
      }
    },
    onMounted(){
      let event=database?.event(_DIR_PATH.PROJECTS+'/create')
      event?.onValue(async ({value})=>{
        //console.log('Added Project:  ',value)
        if(Array.isArray(this.projects)){
          value.owner=await getTheOwner(value?.owner)
          this.projects.push(value)
        }
      })
      event=database?.event(_DIR_PATH.PROJECTS+'/delete')
      event?.onValue(async ({value})=>{
        //console.log('Added Project:  ',value)
        if(Array.isArray(this.projects)){
          this.projects=this.projects.filter((item)=>item?.uid!==value?.uid)
        }
      })
    }
  }

  let meta={
    title:"Projects List | Agglomy !",
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
    list:'pages/list.html',
    modal_notification:'../home/components/modal/notifications.html'

  }

  //Now we render it to be visible on browser
  await controller.render({data, meta,views})
}

export default ListController
