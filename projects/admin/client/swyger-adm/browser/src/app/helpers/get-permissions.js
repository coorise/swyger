let getPermissions=async ({database, path,projectId, actions = []})=>{
  let permissions=[]
  for(let action of actions){
    let permission=await database.ref(DIR_PATH(projectId).PERMISSIONS)?.get({
      path,
      action
    }).val()
    if(permission?.data?.uid){
      permission=permission?.data
      permissions.push(permission?.uid)
    }
  }
  return permissions
}
export default getPermissions
