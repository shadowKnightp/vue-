import {arrayMethods} from './array';
import Dep from './Dep';

export default class Observer{
  constructor(value){
    this.value = value;
    value.__ob__ = this; //将observer实例记录在被观察的数据上，这样子我们在操作数组的时候，就能取到observer实例，从而取到observer实例上的dep（记录着数组的依赖们）
    this.dep = new Dep(); //数组的依赖们
    if(!Array.isArray(value)){
      this.walk(value);
    }else{ //todo:数组的响应式是通过劫持原型做到的。这里我们先要写一个拦截器，用于拦截在数组上的操作，从而做到响应式
      value.__proto__ = arrayMethods; //简单一点，直接通过改变原型的情况进行挟持，其实这里有一个问题，
      this.observeArray(value);                              //就是有的浏览器不支持__proto__，需要把方法复制到要观察的数组上去
    }
  }

  /**
   * walk 会遍历每一个属性，将他变成getter/setter形式，来完成响应式
   * 这个方法是用于转换Object类型数据的
   * 至于数组的是通过原型挟持的形式去实现
   */
  walk(obj){
    const keys = Object.keys(obj);
    for(let i=0;i<keys.length;i++){
      defineReactive(obj,keys[i],obj[keys[i]]);
    }
  }

  observeArray(items){
    for(let i=0,l=items.length;i<l;i++){
      observe(items[i]);
    }
  }
}

//好啦，这时，我们还需要修改一下defineReactive方法
function defineReactive(data,key,val){
  if(typeof val == 'object'){ //新增的递归，用于将一个对象递归转换成响应式数据
    new Observer(val); //麻瓜式一个劲Observer可能会有性能问题，因为可能这个数据我们已经观察过了，不需要再观察
  }
  let childOb  = observe(val);
  let dep = new Dep(); //用这个来帮我们管理依赖哦
  Object.defineProperty(data,key,{
    enumerable:true,
    configurable:true,
    get:function(){
      dep.depend(); //收集依赖，暂时认定这是一个收集依赖的功能函数
      if(childOb){
        childOb.dep.depend();
      }
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

/**
 * 尝试为val创建一个Observer实例
 * 如果创建成功直接返回新创建的实例，
 *如果value已经被观察过，就返回它本来的Observer实例
 */
function observe(val){
  if(!isObject(val)){
    return ;
  }
  let ob;
  if(hasOwn(val,'__ob__') && val.__ob__ instanceof Observer){ //已经观察过
    ob = val.__ob__;
  }else{
    ob = new Observer(value);
  }
  return ob;
}