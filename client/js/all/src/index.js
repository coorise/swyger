import SwygerAuthClient from '@swyger/client-auth';
import SwygerDatabaseClient from '@swyger/client-database';
import SwygerStorageClient from '@swyger/client-storage';



const SwygerClient= {
    init:(ClientConfig)=>{
        const auth = SwygerAuthClient.init(ClientConfig);
        const database = SwygerDatabaseClient.init(ClientConfig);
        const storage = SwygerStorageClient.init(ClientConfig);

        return {
            auth,
            database,
            storage
        }
    }
}

export default SwygerClient;