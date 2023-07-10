const IndexController = async (args) =>{
  const {req,controller}=args;
  //You can get some Params from request
  //console.log('path : ', req.path)
  //console.log('query : ', req.query)
  //console.log('param : ', req.param)

  //You can modify the router behavior
  const router=req.$router
  //router.go('/')
  //router.back('path')
  //router.mount('path',function)
  //router.off('path')
  //router.reload()

  let meta={
    title:"Home | Swyger SPA !",
    meta: [
      {
        name: "child value",
        content: "child content value"
      },
    ]
    // name:"Name"
  }
  //console.log('path : ', req.path)
  //console.log('query : ', req.query)
  //console.log('param : ', req.param)

  const views={
    // that is a way to import your template
    // the let is the name and right side is the path
    //so on your parent template, use  eg: <index/>
    index:'pages/index.html' // should be in /static/public/themes/**/pages/index.html
  }

  //Here, set your data to be viewed on your template like vue js
  let data={
    name:'Coorise' //In the html side, you can call this variable with {{}}, eg: {{name}}
  }

  //Now we render it to be visible on browser
  await controller.render({data, meta,views})
}

export default IndexController
