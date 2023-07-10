import adminRouter from "./route.js";

document.addEventListener('click', function (event) {

  // If the clicked element doesn't have the right selector, bail
  if (!event.target.matches('.close-modal')) return;

  // Don't follow the link
  event.preventDefault();

  // Log the clicked element in the console
  //console.log(event.target);
  let popup=document.getElementById('parentPopUpId')
  popup.style.display='none'

}, false);

try{

  adminRouter.start()

  document.addEventListener("DOMContentLoaded", function (){
    // useful when u don't want to wait external assets data to load ( css,img , js), only DOM ex: <img id=''>
  })

  window.onload = function () {
    // when all elements/resources(img,styles...) are fully loaded
  }

  window.addEventListener('beforeunload',function (e) {
    // user want to reload page , and u want to save some data  before
    //e.returnValue='onbeforeunload'
  })

  window.onunload = function (e) {
    // user quit the page, we can do something in background ( set in ur database, user is offline)

  }
}catch (e) {
  if(ENV==='dev') console.log(e);
}





