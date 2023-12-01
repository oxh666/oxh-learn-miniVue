import { isTracking, trackEffects, triggerEffects } from './effect'
import { hasChanged, isObject,def } from "../shared";
import { reactive } from "./reactive";
/**
 * @internal
 */
export const RefFlag = `__v_isRef`
// 用来存储所有的ref
// 基本类型 string  boolean number
// 如何知道这个值是否被 get 或 set
// 使用 Proxy就不行了，就需要一个 object 包裹，就可以使用 Proxy

class RefImpl {
  private _value: any
  private _dep: any
  private _rawValue: any
  private _v_isRef = true
  
  constructor(value: any) {
    this._rawValue = value
    this._value = convert(value)
    // 看看 value 是不是对象
    
    this._dep = new Set()
    
  }
  
  get value() {
    // 如果有激活的effect，就收集依赖
    trackRefValue(this)
    
    return this._value
  }
  
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      // 先去修改 value
      this._rawValue = newValue
      this._value = convert(newValue)
      
      triggerEffects(this._dep)
    }
  }
  
  
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref._dep)
  }
  
}

/**
 * @description 创建一个ref对象
 * @param value
 */
export function ref(value: any) {
  
  return new RefImpl(value)
}

function convert(value) {
  return isObject(value) ? reactive(value) : value
}

/**
 * @description 判断是否是ref对象
 * @param ref  ref对象
 */
export function isRef(ref) {
  return !!ref._v_isRef
}

/**
 * @description 将ref对象转换成普通对象
 * @param ref ref对象
 */
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

export function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
) {
  const val = object[key]
  if (isRef(val)) {
    return val as any
  }
  const ref = {
    get value() {
      const val = object[key]
      return val === undefined ? (defaultValue as T[K]) : val
    },
    set value(newVal) {
      object[key] = newVal
    }
  } as any
  def(ref, RefFlag, true)
  return ref
}
