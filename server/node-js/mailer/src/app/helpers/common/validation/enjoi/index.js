import {fromJson} from "json-joi-converter";
const ValidationModel = (data)=>{
    /*if(data.items){
        data={
            type:'object',
            properties:{
                "data":{
                    type: 'array',
                    //"required": true,
                    items: {
                        type:'object',
                        properties: data.properties
                    }
                }
            },
        }
    }*/
    data={
        type:'object',
        properties:{
            data:{
                type:'object',
                required: true,
                properties: data.properties
            }
        },
    }
    return fromJson(data)
};
export default ValidationModel