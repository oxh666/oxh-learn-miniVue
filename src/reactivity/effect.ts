//全局变量
/**
 * 1. 依赖收集
 */
let activeEffect: any;


/**
 * @description  依赖收集
 */
const targetMap = new Map();


//类
class ReactiveEffect {
  private _fn: any;
  constructor(fn: any) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    this._fn();
  }
}

/**
 * @description 依赖收集
 * @param target reactive的参数raw
 * @param key  获取的用户访问的Key
 */
export function track(target: any, key: any) {
  //target -> key -> dep
  //将target转换成map对象
  let depsMap = targetMap.get(target);
  //如果没有，就创建一个
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  //拿到 key -> dep
  let dep = depsMap.get(key);
  //key没有重复的，就创建一个set
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  //将当前的effect 放到dep中
  dep.add(activeEffect);
}


/**
 * @description 触发依赖
 * @param target 
 * @param key 
 */
export function trigger(target: any, key: any) {
    //根据 target和key去获取依赖OBJECT（dep),然后遍历收集之前的fn执行
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);

    for(const effect of dep){
        effect.run()
    }

}
/**
 *
 * @param fn
 */
export function effect(fn: any) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}

/**
 * @description 响应式3类
 * 1. Vue2的
 * 2. Vue3的Proxy
 * 3. 
 * 
 */