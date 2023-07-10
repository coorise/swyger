const AutoLoadEntities=(appModule)=>{
    let entity
    (async ()=>{
        entity=await new Promise((resolve)=>{
            appModule.eventEmitter.on('entity-schema',(data)=>{
                // entity.push(data)

                appModule.entitySchema= {
                    ...appModule.entitySchema,
                    ...data
                }
                resolve(data)
            })

        })
    })()
}
export default AutoLoadEntities