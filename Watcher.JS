/**
 * wathcer扮演的是一个中心的角色，这也是观察者模式和发布订阅模式的区别。
 * 发布订阅模式就是抽象出来了一个调度中心，去做一些中间逻辑的处理，
 * 比如这里的wathcer就是的，帮我们模糊了具体的观察者是具体中一个什么东西，我们只用把消息告诉他，
 * 他会去帮我们触发观察者的事件
 * 而观察者就是观察者和目标直接进行交互，目标自己维护了一个观察者的列表，在需要通知的时候，轮询这个列表，去通知观察者们
 */
export default class Watcher{
  constructor(vm,expOrFn,cb){
    this.vm = vm;
    if(typeof expOrFn == 'function'){
      this.getter = expOrFn;
    }else{
      this.getter = parsePath(expOrFn);
    }
    this.expOrFn = expOrFn;
    
    this.cb = cb;
    this.value = this.get();
  }
  get(){
    Dep.target = this; //将自己暴露到全局中，还记得这个吧。
    let value = this.getter(this.vm,this.vm); //然后去触发数据的getter函数
    Dep.target = null;
    return value;
  }
  update(){ //这个就是Dep类中的通知更新时，调用的方法。
    let oldVal = this.value;//记得旧值
    this.value = this.get(); //重新获取一次value
    this.cb.call(this.vm,this.value,oldVal);
  }
}

//我们把工具函数先在这里展示一下
const bailRE = /[^.\w$]/;
function parsePath(path){
  if(bailRE.test(path)){ //如果含有非法字符
    return ;
  }
  const segments = path.split('.');
  return function(obj){
    for(let i=0;i<segments.length;i++){
      if(!obj) return;
      obj = obj[[segments[i]]];
    }
    return obj;
  }
}

// 至此，我们其实已经完成了变化侦测的主要功能，但是目前的响应式，是能做到数据中的某一个属性
//todo：我们需要把数据中的所有属性，包括子属性都能侦测到，很明显，我们需要使用递归去完成这件事，把传入的对象的所有属性都转成响应式数据
//todo：封装一个Observer类，这个类就是实现上述的功能的。