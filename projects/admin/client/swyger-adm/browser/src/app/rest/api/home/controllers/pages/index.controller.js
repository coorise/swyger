import getPermissions from "../../../../../helpers/get-permissions.js";
import generateAppData from "../../../../../helpers/generate-app-data.js";

const IndexController = async (args) =>{
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

  //Here, set your data to be viewed on your template like vue js
  let data={
    name:'Coorise', //In the html side, you can call this variable with {{}}, eg: {{name}}
    logout:()=>{
      auth?.logout(()=>{
        router.go('/login')
      })
    },
  }

  let meta={
    title:"Home | Swyger Browser !",
    meta: [
      {
        name: "child value",
        content: "child content value"
      },
    ]
    // name:"Name"
  }
  //console.log('path : ', req.path)
  //console.log('query : ', req.query)
  //console.log('param : ', req.param)

  const views={
    // that is a way to import your template
    // the let is the name and right side is the path
    //so on your parent template, use  eg: <index/>
    index:'pages/index.html', // should be in /static/public/themes/**/pages/index.html
    modal_notification:'components/modal/notifications.html'
  }

  database.ready(async ()=>{
    await generateAppData({database,auth})
    /*roles=await database.ref(_DIR_PATH.MEMBERS+'/'+user?.uid+'/roles')?.get().val()
    roles=roles?.data?.data
    console.log('Home data current user role: ',roles)*/
  })


  //Now we render it to be visible on browser
  await controller.render({data, meta,views})
}

export default IndexController
