//todo: 首先回答上一小节的内容，什么是依赖！如何收集依赖！如何派发更新
/**
 * 1.依赖：那些曾经使用过我们转换过的响应式数据的，都应该是依赖。
 * 2.我们可以在get中进行依赖收集，
 * 3.当数据变化时，会触发setter，这是我们可以对收集的依赖进行更新的派发，告诉他们数据已经改变，从而可以达到重新渲染的目的
 */
 //todo：这时我们需要先修改下defineReactive函数，让其能收集，派发依赖
 function defineReactive(data,key,val){
  let dep = new Dep(); //用这个来帮我们管理依赖哦
  Object.defineProperty(data,key,{
    enumerable:true,
    configurable:true,
    get:function(){
      dep.depend(); //收集依赖，暂时认定这是一个收集依赖的功能函数
      return val;
    },
    set:function(newVal){
      if(newVal == val){
        return 
      }
      val = newVal;
      dep.notify();//通知依赖们，数据已经改变了哦。需要进行更新操作啦，暂时认定这是一个派发更新的功能函数
    }
  })
}
//todo：现在我们需要实现上面的dep类，帮我们管理依赖，和派发更新
