//here describe your api modules on how data will be fetched/saved/duplicated
const dataDriver = {
  default:{
    read:[
      {
        type:"mongodb",
        name:"default"
      },

    ],
    write:[
      {
        type:"mongodb",
        name:"default"
      }
    ],
  }

}
export default dataDriver
