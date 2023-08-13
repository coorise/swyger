//Please do not change the createApp directory,
//means that import {createApp,} from 'petite-vue', won't work during production
import {createApp,} from '../../../../resources/vendors/petite-vue'
import $ from 'jquery'
import MetaManager from 'head-manager'

const Component=(url)=>class CustomComponent extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    this.innerHTML = await (await fetch(url)).text()
  }
}

export default class BaseController{
  accessToken=localStorage.getItem('accessToken')
  date = new Date().getFullYear();
  envDir=ENV==='dev'?'/src':''
  env=ENV
  theme='dashui' //default | you can put custom theme in: /static/public/themes
  defaultThemePath
  pathTheme='/index.html'
  parentPath
  defaultParentComponentPath
  parentComponentPath
  #metaManager //private variable
  hooks={
    //you can define customize hooks with controller
    // good for your transition page, or when user is about to leave the page
    index:{
      beforeEnter: function () {
      },
      beforeLeave: function () {
      },
    }
  }
  components=[]

  constructor() {

    $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
      options.async = true;
    });
    this.#metaManager=new MetaManager(
      {
        //"base": { href: "./" },
        title:APP_GLOBAL_TITLE,
        "meta": [
          {
            name: "title",
            content: APP_GLOBAL_TITLE
          },
          {
            name: "description",
            content: APP_GLOBAL_TITLE
          },
        ]
      }
    )
    this.#metaManager.render()
  }
  async render(args){
    try {
      let {data={},meta={},views={}}=args
      let templates=[]
      if(views.$templates){
        templates=views.$templates
        delete views.$templates
      }
      if(this.components.length>0) this.components.forEach(component=>{
        views={...views,...component?.views}
        data={...data,...component?.data}
      })

      let iframe = $('#root_frame'),iframeContents,iframeElement;

      if(localStorage.getItem('theme')){
        this.theme = localStorage.getItem('theme')
      }

      this.defaultThemePath=this.pathTheme?_themes+'/'+this.theme+this.pathTheme:this.defaultThemePath
      this.defaultParentComponentPath=this.parentComponentPath?_themes+'/'+this.theme+this.parentPath+this.parentComponentPath:this.defaultParentComponentPath

      iframe.attr('src',this.defaultThemePath)
      document.getElementById('root_frame').data = {
        date:this.date,
        envDir:this.envDir,
        env:this.env,
        visible:{
          display:'block',
        },
        onCreated(){

        },
        onMounted(){

        },
        ...data,
      }

      let componentView=await (await fetch(_themes+'/'+this.theme+this.parentPath+this.parentComponentPath)).text()
      for(let key of Object.keys(views)){
        let childComponent=await (await fetch(_themes+'/'+this.theme+this.parentPath+views[key])).text()
        componentView=componentView.replace(`<${key}/>`,childComponent)

      }
      let componentScript=await (await fetch(_root+'component.html')).text()
      componentView=componentView+componentScript
      /*iframe.on('load',async ()=>{
        // window.onload is used when all external assets ( css,img , js) are successfully loaded
        //we have some issue rendering with Mozilla Firefox browser, cuz it couldn't render the html with 'onload' compared to Chrome
        //That's why we moved it outside the '.html(componentView)'
        //We will fix it later if we see alternative of frame
      })*/
      iframeContents = iframe.contents();
      iframeContents.find('#mainView').html(componentView)
      for(let template of templates){
        let childComponent=await (await fetch(_themes+'/'+this.theme+this.parentPath+template)).text()
        iframeContents.find('#mainView').after(childComponent)

      }
      /*document.getElementById('root_frame').contentWindow.postMessage(
        JSON.stringify([
          {
            name:'index-m',
            url:'./app/api/home/components/index.html'
          }
        ]),window.location.origin
      )*/

      //document.getElementById('root_frame').contentWindow.customElements.define('custom-component',Component('./app/api/home/components/index.html'));
      iframeContents.find('body').addClass('scroll_theme_parent');
      iframeElement =iframeContents.find('#metaView');
      $('#root_meta').html(iframeElement.html());
      /*iframeElement = iframeContents.find('#iconTheme');
      message = iframeElement.prop('href').match(/\/resources(.*)/g)[0];
      console.log('icon url is: '+message);
      $('#root_icon').attr('href',message);*/


      await createApp(Object.assign(
        {
          env:this.env,
          envDir:this.envDir,
          onCreated(){
          },
          onMounted(){
          }

        },
        //data // load your data for parent controller
      )).mount('#root_html');
      this.#metaManager.setTags(meta);
      await this.#metaManager.render();
    }catch (e) {
      if(ENV==='dev')
        console.log(e);
    }


  }

}
