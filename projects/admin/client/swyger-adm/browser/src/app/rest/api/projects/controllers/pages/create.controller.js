import {generateString} from "../../../../../helpers/utils/generate.js";
import generateProjectData from "../../services/remote/generate-project-data.js";

const CreateController = async (args) =>{
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

  //<input
  //   :value="text"
  //   @input="event => text = event.target.value">

  let data={
    error:{
      project_name_exist:'',
      project_name_length:''
    },
    project: controller?.projectModel,
    oldProjectName:'',
    user:{
      username:user?.username||user?.email.split('@')?.[0]
    },
    tags:[],
    serviceList:[],
    services:{
      'AUTH':false,
      'DATABASE':false,
      'STORAGE':false
    },
    storageSelected:false,
    storageConfig:{
      discord:{
        token:'',
        channelId:''
      }
    },
    storageOption:'',
    onSelectedService(service){
      if(this.serviceList.includes(service)){
        this.serviceList=this.serviceList.filter((item)=>item!==service)
        this.services[service]=false
        if(service==='STORAGE') this.storageSelected=false
        console.log('Service removed: ',service)
      }else {
        this.serviceList.push(service)
        this.services[service]=true
        if(service==='STORAGE') this.storageSelected=true
        console.log('Service added: ',service)
      }
    },
    async onNameTyped(event){
      let value=event.target.value
      this.project.name=value.replace(/[^\w ]/g, '') //exclude some char eg "@": replace(/[^\w @]/g, '')
      this.project.linkName=this.project.name?.replace(/ +/g, '_').toLowerCase()
      let project=await database.ref(_DIR_PATH.PROJECTS)?.get({linkName:this.project.linkName})?.val()
      if(!this.project.name?.length){
        this.error.project_name_length='The project name should not be empty and at least 1 character [a-Z/0-9/A-Z] '
      }else {
        this.error.project_name_length=''
      }
      if(project?.data?.linkName===this.project.linkName){
        this.error.project_name_exist='The project name already exist: '+project.data?.name
        this.oldProjectName=this.project.name
      }else {
        this.oldProjectName=''
        this.error.project_name_exist=''
      }
    },
    onInputTags(event){
      let value=event.target.value
      this.tags=value?.split(',')
    },

    projectType(type){
      this.project.projectType=type
    },

    isFormVerified:false,
    isCreateProjectLoading:false,
    submitForm(){
      this.project.linkName=this.project.name?.replace(/ +/g, '_').toLowerCase()
      this.isFormVerified=true

    },
    async createProject(){
      let key=database.ref(_DIR_PATH.PROJECTS)?.push()?.getKey()
      this.project.uid=key
      this.project.owner=user?.uid
      this.isCreateProjectLoading=true
      let project=await database.ref(_DIR_PATH.PROJECTS+'/'+key)?.create(this.project)?.val()
      if(project.data?.uid){
        await generateProjectData({database,auth,serviceList:this.services,userDetail:{username:this.user.username},project:project.data,storageOption:this.storageOption,storageConfig:this.storageConfig})
        let event=database?.event(_DIR_PATH.PROJECTS+'/create')
        event?.push(project.data)
        this.isCreateProjectLoading=false
        this.congratulation=true
      }

    },
    isCreate:true,
    congratulation:false,
    /*nextStep:{
    'd-none':false
    },*/
    isValid:false,
    activeStep:0,
    activeSteps:0,
    firstname:'',
    makeNewProject(){
      this.congratulation=false
      this.activeStep=0
      this.activeSteps=0
      this.project.name='Swyger '+generateString(8)
    },

    currentStep(current){
      if(current<=this.activeSteps){
        this.activeStep=current
      }
    },
    backStep(){
      if(this.activeStep>=1){
        this.activeStep=this.activeStep-1;
        this.activeSteps=this.activeSteps-1;
      }
    },
    nextStep(event){
      //this.activeStep=2
      //this.activeSteps=this.activeSteps+1

      if(this.activeStep<=4){
        this.activeSteps=this.activeSteps+1;
        this.activeStep=this.activeStep+1
      }
      //console.log('activeSteps',this.activeSteps)
      //console.log('activeStep',this.activeStep)

    },
    /*typing:(event)=>{
     console.log("value",event.target.value)
     console.log("length",event.target.value.length)
     if(event.target.value.length > 4){
       //data.nextStep.display='none'
       //data.nextStep=true
       data.exampleName=event.target.value
       data.nextStep['d-none']=false
       data.isValid=true
     }
   }*/
    confirm:(value)=>{
      if(value.id==='next'){
        //data.nextStep=false
        //data.nextStep['d-none']=true
        //console.log("target",value.id)
      }

      //data.nextStep=true
    },
    /*onCreated(){
        console.log('Home On created console')
    },
    onMounted(){
        console.log('Home On mounted console')
    },*/

  }
  data.isList=false

  let meta={
    title:"Create Project | Agglomy !",
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
    create:'pages/create.html',
    discord_modal:'components/modal/storage-discord.html',
  }

  //Now we render it to be visible on browser
  await controller.render({data, meta,views})
}

export default CreateController
