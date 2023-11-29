import { mutableHandlers, readonlyHandlers  ,shallowReadonlyHandlers} from './baseHandlers'

/**
 * @description 响应式状态的枚举
 */
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
}

/**
 * @description reactive响应式
 * @param raw reactive的参数raw
 */
export function reactive(raw: any) {
  // return new Proxy(raw, mutableHandlers)// 抽离出来的公共方法createActiveObject
  return createActiveObject(raw, mutableHandlers)
}

/**
 * @description readonly只读属性
 * @param raw reactive的参数raw
 */
export function readonly(raw: any) {
  return createActiveObject(raw, readonlyHandlers)
}

export function shallowReadOnly(raw: any) {
  return createActiveObject(raw, shallowReadonlyHandlers)
  
}

/**
 * @description  判断是否是readonly对象
 * @param value key
 */
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY]
}

/**
 * @description 判断是否是reactive对象
 * @param value
 */
export function isReactive(value) {
//调用该函数时触发get，去判断是否是reactive对象
  return !!value[ReactiveFlags.IS_REACTIVE]
}

/**
 * @description 创建代理对象
 * @param raw reactive的参数raw
 * @param baseHandlers 代理对象的处理函数
 */
function createActiveObject(raw: any, baseHandlers: any) {
  return new Proxy(raw, baseHandlers)
}
