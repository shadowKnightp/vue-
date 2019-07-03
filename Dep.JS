export default class Dep{
  constructor(){
    this.subs = []; //这里保存依赖们哦
  }
  /**
   * 这里我们会发现一个问题，我要收集的依赖到底是一个什么东西呢？ 假设，我们每个依赖在读取响应式数据的时候
   * 都将自己放到一个全局的变量中，这时，我们在响应式数据的getter中，就能通过去拿到这个依赖啦！
   * 现在我们假设，这个变量叫做Dep.target
   * 真的是一个很明显的明显提示哈，翻译过来就是Dep需要管理的目标
   */
  depend(){ 
    if(Dep.target){
      this.addSubs(Dep.target);
    }
  }
  update(){
    const subs = this.subs.slice();
    for(let i=0,len = subs.length;i<len;i++){
      subs[i].update(); //先假设每个依赖都有一个update方法哈
    }
  }
  /**
   * 现在我们还稍微完善一下这个Dep类
   */
  addSub(sub){
    this.subs.push(sub);
  }
  removeSub(sub){
    if(this.subs.length){
      let index = this.subs.indexOf(sub);
      if(~index){
        return this.subs.splice(index,1);
      }
    }
  }
}

// todo： 现在我们需要回答一个问题：依赖到底是谁？我们到底收集的谁，也就是属性发送变化后，我们需要通知谁
/**
 * 一个简单的回答是，依赖就是使用到我们的响应式数据的地方，
 * 但是使用这个数据的地方很多啊！
 * 比如模板中的插值表达式{{}}，也可能是用户所写的watcher，或者一个computed。注意这里的computed也是一个watcher
 * 但是他是一个懒watcher。和wathcer有区别。后面有机会再写相关文章。
 * 
 * 现在我们应该知道了，因为依赖们长的都不太一样，我们需要抽象出一个类去帮我们处理这个类，先叫这个类为wathcer吧
 */
