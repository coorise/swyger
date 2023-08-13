const DetailController =async (args) =>{
  const {req,controller}=args;
  //You can get some Params from request
  //console.log('path : ', req.path)
  //console.log('query : ', req.query)
  //console.log('param : ', req.params)

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
  let data={
    res:'',
    name:'Agglomy',
    users:'',
    owner:'',
    isCreate:false,
    project,
    async deleteProject(projectId){
      let project=await database.ref(_DIR_PATH.PROJECTS+'/'+projectId).delete().val()
      if(project.data?.uid){
        let event=database?.event(_DIR_PATH.PROJECTS+'/delete')
        event?.push(project.data)
        router.go('/projects')
      }
    },
    /*onCreated(){
        console.log('Home On created console')
    },*/
    onMounted(){

    },

  }
  data.isList=true
  let meta={
    title:"Aminuty Project | Agglomy !",
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
    detail:'pages/detail.html',
    modal_notification:'../home/components/modal/notifications.html'

  }

  //Now we render it to be visible on browser
  await controller.render({data, meta,views})
}

export default DetailController
