let pathList=[]
//visit: https://stackoverflow.com/questions/72582825/collect-all-paths-in-json-object
const getPath=(object, previousPath)=> {
    let key
    for (key in object) {
        let currentPath = previousPath ? `${previousPath}/${key}` : key

        if (Array.isArray(object[key])) {
            //console.log(currentPath)
            //getPath(object[key], currentPath)
        } else if (typeof object[key] === 'object') {
            if (!Array.isArray(object)) { // skipping logging array keys like children.0
                if(currentPath.match(/\/uid$/)?.[0]){
                    currentPath=currentPath.replace(/\/uid$/,'')
                    pathList.push(currentPath)
                }

                //console.log(currentPath)
            }
            getPath(object[key], currentPath)
        } else {
            //console.log(currentPath)
            if(currentPath.match(/\/uid$/)?.[0]){
                currentPath=currentPath.replace(/\/uid$/,'')
                pathList.push(currentPath)
            }

        }
    }
    return pathList
}
export default getPath