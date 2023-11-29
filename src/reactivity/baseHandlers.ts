import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";
import { extend, isObject } from "../shared";

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
/**
 * @description 创建getter
 * @param isReadonly 是否是只读
 * @param shallow 是否是浅的
 */
function createGetter(isReadonly: boolean = false, shallow: boolean = false) {
  return function get(target: any, key: string) {
    //  判断是否是reactive对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    
    if(shallow){
        return res
    }
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

/**
 * @description 创建setter
 */
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
  set(target, key) {
    console.warn(
      `key:'${String(key)}' set  失败，因为 target 是 readonly 类型 `,target)
    return true  //返回true测试通过，false测试不通过 尬住了
  }
}
export const shallowReadonlyHandlers =   extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})
