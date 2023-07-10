let Config={
    init:(ClientConfig)=>{
        return {
            //Configure the offline DB
            OFFLINE_DB_NAME:{
                STORAGE:ClientConfig?.OFFLINE_DB_NAME?.STORAGE||'swyger_storage'
            },

            //Configure the server
            ENV:ClientConfig?.ENV||'prod',
            HOST_SERVER:{
                AUTH:ClientConfig?.HOST_SERVER?.AUTH||'http://localhost:4100', //Required for protected route
                STORAGE:ClientConfig?.HOST_SERVER?.STORAGE||'http://localhost:4500',
            },
            API_VERSION:{
                AUTH:ClientConfig?.API_VERSION?.AUTH||'/api/v1',
                STORAGE:ClientConfig?.API_VERSION?.STORAGE||'/api/v1',
            },
            AUTO_REFRESH_TOKEN_TIMEOUT:ClientConfig?.AUTO_REFRESH_TOKEN_TIMEOUT||1500000, //in millisecond= 25 minutes
            API_KEY:ClientConfig?.API_KEY||'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzd3lnZXIuY29tIiwiaWF0IjoxNjUzNDQwOTkxLCJleHAiOjE2ODQ5NzY5OTEsImF1ZCI6ImRheW52ZXIuY29tIiwic3ViIjoidGVhbUBzd3lnZXIuY29tIiwiR2l2ZW5OYW1lIjoiSXZhbiBKb2VsIiwiU3VybmFtZSI6IlNvYmd1aSIsIkVtYWlsIjoidGVhbUBhZ2dsb215LmNvbSIsIlJvbGUiOlsiQWRtaW4iLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.UvlcjBahR9G8dKxIeENJ7k4I87t3_oNJQ16eyPsRcSE'
        }
    }
}
export default Config

