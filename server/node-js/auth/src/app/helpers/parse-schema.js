const ParseSchema=(data)=>{
    const keys = Object.keys(data)
    let schema={}
    for (let key of keys){
        schema[key]=data[key]
        if(data[key]?.type==='varchar'||data[key]?.type==='longtext'){
            schema[key].type='string'
        }
        if(data[key]?.type==='bigint'){
            schema[key].type='integer'
        }

    }
    return schema
}
export default ParseSchema