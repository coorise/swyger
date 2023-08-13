const IndexController =async (args) =>{
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
  if(project.data){
    project=project.data
  }else {
    project={}
  }

  //Here, set your data to be viewed on your template like vue js
  let data={
    isList:false,
    isCreate:false,
    project
  }

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
    index:'pages/index.html',
    sidebar:'../../api/project/components/sidebar.html',
    navbar:'../../api/project/components/navbar.html',
  }

  //Now we render it to be visible on browser
  await controller.render({data, meta,views})
}

export default IndexController
