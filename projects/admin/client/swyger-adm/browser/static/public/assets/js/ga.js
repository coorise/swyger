try{
  if(ga){
    window.ga = function () {
      ga.q.push(arguments);
    };
    ga.q = []; ga.l = +new Date;
// Google Analytics: change UA-XXXXX-Y to be your site's ID.
    ga('create', 'UA-XXXXX-Y', 'auto');
    ga('set', 'anonymizeIp', true);
    ga('set', 'transport', 'beacon');
    ga('send', 'pageview');
  }
}catch (e) {

}


