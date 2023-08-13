import generateAppData from "../../../../../helpers/generate-app-data.js";

const generateProjectData=async ({database,auth,userDetail,serviceList,project,storageOption,storageConfig})=>{
  await generateAppData({database,auth,project,userDetail})
  let user=auth?.$user
  let api={
    auth:{
      data:{
        users:{}
      },
      logs:{},
      isActivated:false

    },
    database:{
      data:{
      },
      logs:{},
      isActivated:false
    },
    storage:{
      data:{
      },
      logs:{},
      isActivated:false,
      configs:{
        local:{
          isActivated:false,
        },
        discord:{
          token:'',
          channelId:'',
          isActivated:false,
        }
      }
    }
  }
  if(serviceList['AUTH']){
    api.auth.isActivated=true
  }
  if(serviceList['DATABASE']){
    api.database.isActivated=true
  }
  if(serviceList['STORAGE']){
    api.storage.isActivated=true
    switch (storageOption) {
      case 'local':
        api.storage.configs.local.isActivated=true
        break;
      case 'discord':
        api.storage.configs.discord.isActivated=true
        api.storage.configs.discord.token=storageConfig?.discord?.token
        api.storage.configs.discord.channelId=storageConfig?.discord?.channelId
        break;

    }
  }

  await database?.ref(DIR_PATH(project?.uid).ROOT+'/api').create(api).val()
  let permissionsList=[
    'auth/',
    'auth/data/',
    'auth/data/users/',
    'auth/logs/',
    'database/',
    'database/data/',
    'database/logs/',
    'storage/',
    'storage/data/',
    'storage/configs/',
    'storage/logs/',
  ]
  for (const permission of permissionsList) {
    let actions=['read','update']
    if(permission.includes('/data')||permission.includes('/users')){
      actions=['create','read','update','delete','manage']
    }
    if(permission.includes('/logs')){
      actions=['read']
    }
    for(const action of actions){
      let key=database.ref(DIR_PATH(project.uid).PERMISSIONS)?.push()?.getKey()
      let name=action.replace(action.charAt(0),action.charAt(0).toUpperCase())+' '+
        permission.split('/').reduce((prev,next)=>prev+' '+next.replace(next.charAt(0),next.charAt(0).toUpperCase()))
      await database.ref(DIR_PATH(project.uid).PERMISSIONS+'/'+key)?.create({
        name,
        dir:DIR_PATH(project.uid).ROOT+'/api/'+permission.replace(/\/$/,''),
        uid:key,
        action
      }).val()
      let logKey=database.ref(DIR_PATH(project.uid).LOGS)?.push()?.getKey()
      await database.ref(DIR_PATH(project.uid).LOGS+'/'+logKey)?.create({
        action:'Created a Permission API '+name,
        uid:logKey,
        by:user?.uid,
        alias:'system'
      }).val()
    }

  }
}
export default generateProjectData
