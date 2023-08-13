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

  //Here, set your data to be viewed on your template like vue js
  let data={
    isList:false,
    isCreate:false,
    data:{
      level21:{
        value1:'',
        level22:{
          value2:'',
          level23:{
            value3:'',
            level24:{
              level25:{
                value4:''
              },
            },
          },
        },
      },
      users:{
        uiuiuuhuhuhbduhuh:{
          name:'joel'
        },
        uiuiuuhuhujkjhggh:{
          name:'ivan',
          address:{
            long:''

          }
        }
      },

      level3:'This is level 3',
      level4:{},
      level5:'this is level5',
      level6:{}
    },
    project,
    dataClicked:{

    },
    onDataClicked(key){
      this.dataClicked[key] = !this.dataClicked[key];
    },
    DataComponent({data}){
      return {
        $template:'#data-template',
        obj:data,
        objClicked:{

        },
        onObjClicked(key){
          this.objClicked[key] = !this.objClicked[key];
        },
      }
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
