import { readonlyHandlers } from './baseHandlers'


/**
 * @description reactive响应式
 * @param raw reactive的参数raw
 */
export function reactive(raw: any) {
  // return new Proxy(raw, mutableHandlers)// 抽离出来的公共方法
  return createActiveObject(raw, readonlyHandlers)
  
}

/**
 * @description readonly只读属性
 * @param raw reactive的参数raw
 */
export function readonly(raw: any) {
  // return new Proxy(raw, readonlyHandlers)// 抽离出来的公共方法
  return createActiveObject(raw, readonlyHandlers)
}

function createActiveObject(raw: any, baseHandlers: any) {
  return new Proxy(raw, baseHandlers)
}
