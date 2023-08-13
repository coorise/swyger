import getPermissions from "./get-permissions.js";
let hasPermission=async ({database, path, actions, userId,projectId, superAdminRole = 'superadmin'})=>{

  let userInfo=await database.ref(DIR_PATH(projectId).MEMBERS)?.get({
    uid:userId
  }).val()
  userInfo=userInfo?.data
  let userRoles=userInfo?.roles

  let permissions=await getPermissions({database, path,projectId, actions})
  //Case 1: Checking user with his permissions
  if(permissions?.length>0 && userInfo?.permissions?.length>0){
    let userPermissions=userInfo?.permissions
    return permissions.some(perm => userPermissions.includes(perm))
  }

  //Case 2: fetching all his roles then convert it into permissions
  if(userRoles?.length>0){
    let roleGotPermission=false
    let mUserRoles=userRoles
    //console.log('Home project permissions List: ',permissions)
    for(let userRole of mUserRoles){
      let role=await database.ref(DIR_PATH(projectId).ROLES)?.get({
        uid:userRole
      }).val()
      role=role?.data
      if(role?.slug?.toLowerCase()===superAdminRole.toLowerCase()){
        roleGotPermission=true
        mUserRoles=[]
      }else
      if(role?.permissions?.length>0){
        let rolePermissions=role?.permissions
        //console.log('Home user permission: ',rolePermissions)
        let getPermission=permissions.some(perm => rolePermissions.includes(perm))
        if(getPermission){
          roleGotPermission=true
          mUserRoles=[]
        }
      }

    }
    return roleGotPermission
  }


  return false
}
export default hasPermission
