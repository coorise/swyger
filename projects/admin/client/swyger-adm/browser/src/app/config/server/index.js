let ServerConfig={
  //Configure the offline DB
  OFFLINE_DB_NAME:{
    AUTH:'swyger_auth',
    DATABASE:'swyger_database',
    STORAGE:'swyger_storage'
  },
  ENV:ENV,
  //Configure the server
  HOST_SERVER:{
    //AUTH:'http://localhost:4100',
    AUTH:'https://auth.server.agglomy.com',
    //DATABASE:'http://localhost:4400',
    DATABASE:'https://database.server.agglomy.com',
    //STORAGE:'http://localhost:4500',
    STORAGE:'https://storage.server.agglomy.com',
  },
  API_VERSION:{
    AUTH:'/api/v1',
    DATABASE:'/api/v1',
    STORAGE:'/api/v1',
  },
  AUTO_REFRESH_TOKEN_TIMEOUT:1500000, //in millisecond= 25 minutes
  // A Unique Api key for all your servers
  //API_KEY:'api_key'
  API_KEY:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3IiOiJzd3lnZXIiLCJpYXQiOjE2OTA1MDY0MDl9.eRkSLw7wqeZ1Wzp1oh2aqV94ucl98y1gdc9_rCZNCSk'
}
export default ServerConfig
