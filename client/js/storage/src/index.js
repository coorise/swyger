import SocketService from "./api/socket_io/index.service";
import RemoteService from "./api";
import Config from "./api/env";



const SwygerStorageClient= {
    init:(ClientConfig)=>{
        let config=Config.init(ClientConfig)
        const service = SocketService.init(config)
        const req={
            socket:{
                storage:service?.storage
            }
        }
        const remote= RemoteService.init(config)
        return remote(req)
    }
}

export default SwygerStorageClient