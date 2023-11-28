import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";
import { isObject } from "../shared";

const get = createGetter(false)
const set = createSetter()
const readonlyGet = createGetter()

/**
 * @description 创建getter
 * @param isReadonly
 */
function createGetter(isReadonly: boolean = false) {
  return function get(target: any, key: string) {
    //  判断是否是reactive对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    
    //看看 res 是不是 object
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }
    
    if (!isReadonly) {
      // TODO 依赖收集
      track(target, key)
    }
    return res
  }
  
}

function createSetter() {
  return function set(target: any, key: string, value: any) {
    const res = Reflect.set(target, key, value)
    // TODO 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  /**
   *@description
   * @param target  reactive的参数raw
   * @param key 获取的用户访问的Key
   */
  get,
  /**
   *@description
   * @param target reactive的参数raw
   * @param key 获取的用户访问的Key
   * @param value  获取的用户访问的Key
   */
  set,
}
export const readonlyHandlers = {
  get: readonlyGet,
  
  //set只读属性，不允许修改，故返回boolean
  set(target, key, value) {
    console.warn('你不能修改该属性')
    return true  //返回true测试通过，false测试不通过 尬住了
  }
}
