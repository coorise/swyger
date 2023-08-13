const envAttribute=parent.document.getElementById('root_html')?.getAttribute('env')
const
  //Configure the ENV App
  APP_GLOBAL_TITLE='Swyger Admin',
  DIR_ROOT='/root',
  DIR_PROJECTS='/projects',
  DIR_MEMBERS='/members',
  DIR_TEAMS='/teams',
  DIR_ROLES='/roles',
  DIR_PERMISSIONS='/permissions',
  DIR_LOGS='/logs',
  DIR_SETTINGS='/settings',
  DIR_PATH=(projectId)=>{
   return {
     ROOT:(projectId)?DIR_ROOT+DIR_PROJECTS+'/'+projectId:DIR_ROOT,
     PROJECTS:(projectId)?DIR_ROOT+DIR_PROJECTS+'/'+projectId+DIR_PROJECTS:DIR_ROOT+DIR_PROJECTS,
     MEMBERS:(projectId)?DIR_ROOT+DIR_PROJECTS+'/'+projectId+DIR_MEMBERS:DIR_ROOT+DIR_MEMBERS,
     TEAMS:(projectId)?DIR_ROOT+DIR_PROJECTS+'/'+projectId+DIR_TEAMS:DIR_ROOT+DIR_TEAMS,
     ROLES:(projectId)?DIR_ROOT+DIR_PROJECTS+'/'+projectId+DIR_ROLES:DIR_ROOT+DIR_ROLES,
     PERMISSIONS:(projectId)?DIR_ROOT+DIR_PROJECTS+'/'+projectId+DIR_PERMISSIONS:DIR_ROOT+DIR_PERMISSIONS,
     LOGS:(projectId)?DIR_ROOT+DIR_PROJECTS+'/'+projectId+DIR_LOGS:DIR_ROOT+DIR_LOGS,
     SETTINGS:(projectId)?DIR_ROOT+DIR_PROJECTS+'/'+projectId+DIR_SETTINGS:DIR_ROOT+DIR_SETTINGS,
   }
  },
  _DIR_PATH=DIR_PATH(),

  ENV=envAttribute //This will be used to show logs and errors during development mode

;
