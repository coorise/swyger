const TemplateValidatorPartIndex=(name)=>{

    return `
    import createOne from './create-one'

    export default {
        create:{
            one:createOne,
            many:createOne
        },
    
    }`
}
export default TemplateValidatorPartIndex