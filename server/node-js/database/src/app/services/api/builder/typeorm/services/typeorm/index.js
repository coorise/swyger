const TemplateService=(name)=>{
    name=name.toLowerCase()
    const SingularName=name.replace(/s$/,'')
    const PluralName=(name.match(/s$/))?name:name+'s'
    const ClassName=SingularName.replace(SingularName.charAt(0),SingularName.charAt(0).toUpperCase())
    return `
import {TypeService} from "@common/service/typeorm";
import ${SingularName}Schema from '../../models/typeorm/${PluralName}.schema.json';

export class ${ClassName}Services extends TypeService{

}
export default new ${ClassName}Services(${SingularName}Schema.name);`
}
export default TemplateService