module.exports=({router})=>{
  console.log(router)
  router.beforeEach((to,from,next)=>{
    //触发百度的pv统计
    if (typeof _hmt != "undefined") {
      if (to.path) {
        _hmt.push(["_trackPageview", to.fullPath]);
      }
    }
    next();
  })
}