import Dayjs from "dayjs";

//Please visit: https://github.com/typeorm/typeorm/blob/next/src/entity-schema/EntitySchemaTransformer.ts#L59
const TypeSchema=(data)=> {
    return {
        entity: data.entity,
        name: data.name,
        table: Object.assign(
            {},
            data.table
        ),
        target: data.target,
        columns:{
            ...data.primaryColumn,
            createdAt:{
                type: Date,
                default: Dayjs(new Date()).format('YYYY-MM-DD HH:ss')

            },
            updatedAt: {
                type: Date,
                default: Dayjs(new Date()).format('YYYY-MM-DD HH:ss')

            },
            deletedAt: {
                type: Date,
                default: null
            },
            ...data.columns
        }
    }
}
export default TypeSchema