const ParseSchema=(data)=>{
    const keys = Object.keys(data)
    let schema={}
    for (let key of keys){
        schema[key]=data[key]
        if(data[key]?.type==='varchar'||data[key]?.type==='longtext'){
            schema[key]=Object.assign(
                {...data[key]},
                {
                    type:'string'
                }
            )
        }
        if(data[key]?.type==='bigint'){
            schema[key]=Object.assign(
                {...data[key]},
                {
                    type:'integer'
                }
            )
        }

    }
    return schema
}
export default ParseSchema