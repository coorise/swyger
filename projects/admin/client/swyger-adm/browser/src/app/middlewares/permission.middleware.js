import hasPermission from "../helpers/has-permission.js";
export default class PermissionMiddleware{
  hasPermission=async ({req, path, actions, projectId})=>{
    const client=req?.client
    let database=client?.database?.database()
    let auth=client?.auth?.auth()
    let user=auth?.$user
    let hasAccess=await hasPermission({database, path, actions, userId:user?.uid, projectId})
    //console.log('Projects List->Has Permissions: ',hasAccess)
    //debugger
    if(!hasAccess){
      window.top.location.href = '/home'
    }
  }
}
