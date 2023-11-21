import { extend } from "../shared";
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
  active = true
  deps = [];//存放dep
  onStop?: () => void
  private _fn: any; //用户传入的函数
  public scheduler: Function | undefined; //调度程序
  
  
  constructor(fn: any, public scheduler?: any) {
    this._fn = fn;
  }
  
  run() {
    activeEffect = this;
    return this._fn();
  }
  
  stop() {
    if (this.active) {
      //将当前的effect从dep中移除
      cleanupEffect(this);
      //如果有onStop，就执行onStop
      if (this.onStop) {
        //
        this.onStop()
      }
      this.active = false
    }
  }
}

/**
 * @description 清除effect|effect.stop功能实现
 * @param effect
 */
function cleanupEffect(effect: any) {
  //将当前的effect从dep中移除
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  })
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
  if (!activeEffect) return;
  //将当前的effect 放到dep中
  dep.add(activeEffect);
  //将dep放到effect中
  activeEffect.deps.push(dep);
  
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
  
  for (const effect of dep) {
    //如果有scheduler，就执行scheduler
    if (effect.scheduler) {
      effect.scheduler
    } else {
      effect.run()
    }
  }
  
}

/**
 *
 * @param fn 用户传入的函数
 * @param options 选项
 */
export function effect(fn: any, options: any = {}) {
  const _effect: any = new ReactiveEffect(fn, options.scheduler);
  // _effect.onStop = options.onStop
  //优雅赋值
  extend(_effect, options);
  _effect.run();
  //处理指针
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  
  return runner;
}

export function stop(runner: any) {
  runner.effect.stop();
}
