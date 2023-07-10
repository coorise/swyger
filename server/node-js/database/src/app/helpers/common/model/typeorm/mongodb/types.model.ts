
const MongoType={
    primaryColumn:{
        id: {
            primary: true,
            // @ts-ignore
            generated: 'objectId',
            // @ts-ignore
            objectId:true
        },
        uid: {
            generated: 'uuid',
            type: 'uuid',
        },
    },

}
export default MongoType