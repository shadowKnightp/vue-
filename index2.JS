//todo ：首先如何实现将一个对象转换成一个响应式对象？

function defineReactive(data,key,val){
  Object.defineProperty(data,key,{
    enumerable:true,
    configurable:true,
    get:function(){
      console.log('get');
      return val;
    },
    set:function(newVal){
      if(newVal == val){
        return 
      }
      val = newVal;
      console.log('set',val);
    }
  })
}
var data = {
  'test':1
}
defineReactive(data,'test',data['test']);
data.test = 1;
/**
 *   至此我们实现了一个简单的将对象转换成响应式对象，
 * 但是只响应没有任何用处，我们需要能在数据改变的时候通知相关的依赖，来进行更新
 * 问题1：什么是依赖？
 * 问题2：如何收集依赖
 * 问题3：如何在更新时候，让模板中对应的地方也更新
 */