const TemplateValidatorCreateOne=(name)=>{
    name=name.toLowerCase()
    const SingularName=name.replace(/s$/,'')
    const PluralName=(name.match(/s$/))?name:name+'s'
    const ClassName=SingularName.replace(SingularName.charAt(0),SingularName.charAt(0).toUpperCase())
    return `
    import ${SingularName}Schema from '../../models/${PluralName}.schema.json'
    import ParseSchema from "@helpers/parse-schema";
    
    let schema=ParseSchema(${SingularName}Schema.columns)
    
    export default schema`
}
export default TemplateValidatorCreateOne