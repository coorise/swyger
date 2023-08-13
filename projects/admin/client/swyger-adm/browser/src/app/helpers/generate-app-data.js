import getPermissions from "./get-permissions.js";

const generateAppData=async ({database,auth,project={},userDetail})=>{
  let user=auth?.$user
  let permissions= await database.ref(DIR_PATH(project.uid).PERMISSIONS)?.get().val()
  let roles= await database.ref(DIR_PATH(project.uid).ROLES)?.get().val()
  let members= await database.ref(DIR_PATH(project.uid).MEMBERS)?.get().val()
  let settings= await database.ref(DIR_PATH(project.uid).SETTINGS)?.get().val()

  permissions=permissions?.data?.data
  roles=roles?.data?.data
  members=members?.data?.data
  settings=settings?.data?.data
  if(!permissions){
    let permissionsList=[
      'member','team','role','permission','log','setting'
    ]
    if(!project.uid) permissionsList.push('project')
    for (const permission of permissionsList) {
      let actions=['create','read','update','delete','manage']
      if(permission==='setting'){
        actions=['read','update']
      }
      if(permission==='log'){
        actions=['read']
      }
      for(const action of actions){
        let key=database.ref(DIR_PATH(project.uid).PERMISSIONS)?.push()?.getKey()
        let name=action.replace(action.charAt(0),action.charAt(0).toUpperCase())+' '+
          permission.replace(permission.charAt(0),permission.charAt(0).toUpperCase())
        await database.ref(DIR_PATH(project.uid).PERMISSIONS+'/'+key)?.create({
          name,
          dir:DIR_PATH(project.uid).ROOT+'/'+permission+'s',
          uid:key,
          action
        }).val()
        let logKey=database.ref(DIR_PATH(project.uid).LOGS)?.push()?.getKey()
        await database.ref(DIR_PATH(project.uid).LOGS+'/'+logKey)?.create({
          action:'Created a Permission: '+name,
          uid:logKey,
          by:user?.uid,
          alias:'system'
        }).val()
      }

    }
    if(!roles){
      let roles=['superadmin','admin','moderator','developer','user']
      for(const role of roles){
        let key=database.ref(DIR_PATH(project.uid).ROLES)?.push()?.getKey()
        let name=role.replace(role.charAt(0),role.charAt(0).toUpperCase())
        let permissions=[]

        if(role==='admin'){
          permissions=[...permissions,...await getPermissions({database,projectId:project.uid,path: DIR_PATH(project.uid).PROJECTS, actions:['manage']})]
          permissions=[...permissions,...await getPermissions({database,projectId:project.uid,path:DIR_PATH(project.uid).TEAMS, actions:['manage']})]
          permissions=[...permissions,...await getPermissions({database,projectId:project.uid,path:DIR_PATH(project.uid).LOGS, actions:['read']})]
          permissions=[...permissions,...await getPermissions({database,projectId:project.uid,path:DIR_PATH(project.uid).SETTINGS, actions:['read', 'update']})]
        }
        if(role==='moderator'){
          permissions=[...permissions,...await getPermissions({database,projectId:project.uid,path:DIR_PATH(project.uid).TEAMS, actions:['manage']})]
        }
        if(role==='developer'){
          permissions=[...permissions,...await getPermissions({database,projectId:project.uid,path:DIR_PATH(project.uid).LOGS, actions:['read']})]
        }


        await database.ref(DIR_PATH(project.uid).ROLES+'/'+key)?.create({
          name,
          uid:key,
          slug:role,
          permissions
        }).val()
        let logKey=database.ref(DIR_PATH(project.uid).LOGS)?.push()?.getKey()
        await database.ref(DIR_PATH(project.uid).LOGS+'/'+logKey)?.create({
          action:'Created a Role: '+name,
          uid:logKey,
          by:user?.uid,
          alias:'system'
        }).val()
      }
      if(!members){
        //console.log('Home Database : ',members)
        //console.log('CurrentUser Info : ',auth?.$user)
        let role=await database.ref(DIR_PATH(project.uid).ROLES)?.get({
          slug:'superadmin'
        }).val()
        role=role?.data
        let key=user?.uid
        await database.ref(DIR_PATH(project.uid).MEMBERS+'/'+key)?.create({
          email:user?.email,
          username:userDetail?.username,
          uid:key,
          roles:[role?.uid]
        }).val()
        let logKey=database.ref(DIR_PATH(project.uid).LOGS)?.push()?.getKey()
        await database.ref(DIR_PATH(project.uid).LOGS+'/'+logKey)?.create({
          action:'Created a Member: '+user?.email+' with uid: '+user?.uid ,
          uid:logKey,
          by:user?.uid,
          alias:'system'
        }).val()

      }
    }
    if(!settings){
      await database.ref(DIR_PATH(project.uid).SETTINGS+'/general')?.create({
        app_name:project?.name||APP_GLOBAL_TITLE,
      }).val()
      let logKey=database.ref(DIR_PATH(project.uid).LOGS)?.push()?.getKey()
      await database.ref(DIR_PATH(project.uid).LOGS+'/'+logKey)?.create({
        action:'Created Setting App name: '+project?.name||APP_GLOBAL_TITLE ,
        uid:logKey,
        by:user?.uid,
        alias:'system'
      }).val()
    }
  }
}
export default generateAppData
