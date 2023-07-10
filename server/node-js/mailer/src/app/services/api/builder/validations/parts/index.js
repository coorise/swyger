const TemplateValidatorPartIndex=(name)=>{

    return `
    import sendOne from './send-one'

    export default {
        send:{
            one:sendOne,
            many:sendOne
        },
    
    }`
}
export default TemplateValidatorPartIndex