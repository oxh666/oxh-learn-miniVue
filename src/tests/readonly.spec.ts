import { describe, expect, it,vi } from "vitest";
import { readonly } from "../reactivity/reactive";

describe("readonly", () => {
  /**
   * @description readonly
   * 1. 代理对象不等于原始对象
   * 2. 代理对象的属性值等于原始对象的属性值
   * 3. 代理对象的属性值不等于原始对象的属性值
   */
  it("happy path", () => {
    //not set (只能读取)
    const original = {foo: 1, bar: {baz: 2}}//原始对象
    const wrapped = readonly(original);//代理对象
    expect(wrapped).not.toBe(original)//代理对象不等于原始对象
    expect(wrapped.foo).toBe(1)//代理对象的属性值等于原始对象的属性值
  })
  
  /**
   * @description 触发 readonly时候的警告
   */
  it('warn then call set', () => {
    //given
    const user = readonly({age: 10})
      console.warn = vi.fn()
    //when
    user.age = 11
    //then
    // console.warn('你不能修改该属性')
    expect(console.warn).toBeCalled()
  })
})
