import { describe, expect, it, vi } from 'vitest'
import { reactive } from '../reactivity/reactive'
import { effect, stop } from '../reactivity/effect'

describe('effect', () => {
  it('happy_path', () => {
    //given
    const user = reactive({name: 'John', age: 10})
    let nextAge
    
    
    effect(() => {
        nextAge = user.age + 1
      }
    )
    expect(nextAge).toBe(11)
    expect(2).toBe(2)
    
    //update  没有收集依赖和触发依赖以下测试代码报错
    user.age++
    // expect(nextAge).toBe(12)
    
  })
  
  /**
   *@description effect内部的 runner作用
   * 1. effect(fn) -> function runner() -> fn -> return
   * 2. 调用runner可以拿到fn的返回值
   * 3. runner() 会执行fn
   * 4. runner() 会返回fn的返回值
   */
  it('should return runner when call effect', () => {
    //1.given
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(11)
    //runner() 是否会执行fn
    const r = runner()
    expect(foo).toBe(12)
    //runner() 是否会返回fn的返回值
    expect(r).toBe('foo')
  })
  
  /**
   * @description 测试简介scheduler（ 调度程序）
   * 1. 通过 effect 的第二个参数给定的一个 scheduler 的 fn
   * 2. effect 第一次执行的时候还会执行 fn（参数1）
   * 3. 当响应式对象 set  update 的时候，不会执行 fn，而是执行 scheduler
   * 4. 如果执行 scheduler，那么会再次执行fn
   */
  it.skip('scheduler', () => {
    //1.given
    let dummy // 用于收集依赖
    let run: any // 用于执行scheduler
    
    const scheduler = vi.fn(() => {
      run = runner
    })
    const obj = reactive({foo: 1})
    //2.when
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {scheduler}
    )
    //3.then
    expect(scheduler).not.toHaveBeenCalled()//第一次执行时不会被调用
    expect(dummy).toBe(1)
    // should be called on first trigger 第一次相应后会被调用
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    console.log('run', run)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })
  
  /**
   * @description 测试stop
   *
   */
  it('stop', () => {
    let dummy
    const obj = reactive({prop: 1})
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    console.log('dummy', dummy)
    expect(dummy).toBe(2)
    stop(runner)
    // obj.prop = 3 //赋值可以
    obj.prop++ //++不行，所以需要优化代码
    expect(dummy).toBe(2)
    
    // stopped effect should still be manually callable
    runner()
    expect(dummy).toBe(3)
  })
  
  it('events: onStop', () => {
    const onStop = vi.fn()
    const runner = effect(() => {
    }, {
      onStop
    })
    
    stop(runner)
    expect(onStop).toHaveBeenCalled()
  })
  
})
