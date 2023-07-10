const TemplateModel=(name,columns={
    "name": {
        "type": "varchar"
    },
    "description": {
        "type": "varchar",
        "default": null
    }
},path="api")=>{
    name=name.toLowerCase()
    const SingularName=name.replace(/s$/,'')
    const PluralName=(name.match(/s$/))?name:name+'s'
    const ClassName=SingularName.replace(SingularName.charAt(0),SingularName.charAt(0).toUpperCase())
    return {
        schema:`
{
  "name": "${PluralName}",
  "function": "@${path}/${PluralName}/models/${PluralName}.model",
  "columns": ${JSON.stringify(columns,null,2)}
}`,
model:`
import TypeModel from "@common/model/types.model";
import { decorate } from 'ts-mixer';


//You cant set your entity schema with ./${PluralName}.schema.json) --> columns:{}, good for your api

export default class ${ClassName}Model extends TypeModel{
  constructor() {
    super()
  }


}`
    }
}
export default TemplateModel