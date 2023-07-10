//here describe your api modules on how data will be fetched/saved/duplicated
const dataDriver = {
  default:{
    read:[
      {
        //type:"mysql",
        type:"mongodb",
        name:"default"
      },
      /*{
        type:"mongodb",
        name:"base2"
      },
      {
        type:"mysql",
        name:"base3",
      },*/
    ],
    write:[
      {
        //type:"mysql",
        type:"mongodb",
        name:"default"
      },
      /*{
        type:"mongodb",
        name:"base2"
      },
      {
        type:"mysql",
        name:"base3"
      },*/
    ],
  }

}
export default dataDriver
