const TemplateValidator=(name)=>{
    name=name.toLowerCase()
    const SingularName=name.replace(/s$/,'')
    const PluralName=(name.match(/s$/))?name:name+'s'
    const ClassName=SingularName.replace(SingularName.charAt(0),SingularName.charAt(0).toUpperCase())
    return `
import {ValidationController} from "@common/validation/controller";
import ${SingularName}Schema from '../models/${PluralName}.schema.json';
import schema from './parts'
class ${ClassName}Validation extends ValidationController{
}
export default new ${ClassName}Validation(${SingularName}Schema.name,schema)
`
}
export default TemplateValidator