const TemplateController=(name)=>{
    name=name.toLowerCase()
    const SingularName=name.replace(/s$/,'')
    const PluralName=(name.match(/s$/))?name:name+'s'
    const ClassName=SingularName.replace(SingularName.charAt(0),SingularName?.charAt(0).toUpperCase())

    return `
import {TypeController} from '@common/controller/typeorm';
import ${SingularName}Service from '../services/typeorm/${PluralName}.service';
import ${SingularName}Schema from '../models/typeorm/${PluralName}.schema.json';


class ${ClassName}Controller extends TypeController {
  constructor(service, name) {
    super(service, name);
  }

}

export default new ${ClassName}Controller(${SingularName}Service, ${SingularName}Schema.name);`
}
export default TemplateController