import AsyncUtil from "async-utility";
const TemplateBuilder=(data)=>{
    if(!data?.columns){
        data.columns={
            "name": {
                "type": "varchar"
            },
            "description": {
                "type": "varchar",
                "default": null
            }
        }
    }
    if(!data.generated_api){
        data.generated_api=true
    }

    data.path=Object.assign(
        {
            parent:'api',
            child:''
        },
        {...data?.path}
    )

    data.name=data.name.toLowerCase()
    const SingularName=data.name.replace(/s$/,'')
    const PluralName=(data.name.match(/s$/))?data.name:data.name+'s'
    return `
{
  "generate_api": ${data?.generated_api},
  "name": "${PluralName}",
  "parent_path": "${data.path.parent}",
  "child_path": "${data.path.child}",
  "model": {
    "columns": ${JSON.stringify(data?.columns,null,2)}
  }
}`
}
export default TemplateBuilder