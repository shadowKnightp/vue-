const arrayProto = Array.prototype;

export const arrayMethods = Object.create(arrayProto);
/**
 * 数组中的会修改原数组的方法只有 pop/push/shift/unshift/splice/sort/reverse 方法
 */
['pop','push','shift','unshift','splice','sort','reverse'].forEach(function(method){
    const original = arrayProto[method];   //缓存数组原型上的本来的方法

    Object.defineProperty(arrayMethods,method,{
      value:function(...args){
        const ob = this.__ob__;
        let result = original.apply(this,args);
        let inserted;
        switch(method){ //可能会新增元素，我们也需要去观察他
          case 'push':
          case 'unshift':
              inserted = args;
              break;
          case 'splice':   
              inserted = args.slice(2);   
              break;   
        }
        if(inserted){ //inserted存在表示插入了数据,需要Observer将其转换成一个响应式数据
          ob.observeArray(inserted);
        }
        ob.dep.notify(); //通知依赖
        return result;
      },
      enumerable:false,
      writable:true,
      configurable:true
  })
})