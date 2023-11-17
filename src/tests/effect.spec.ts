import { it, expect, describe } from 'vitest'
import { reactive } from '../reactivity/reactive'
import { effect } from '../reactivity/effect'
describe('effect', () => {
    it('happy_path', () => {
       //given
        const user=reactive({name:'John',age:10})
        let nextAge

        
         effect (()=>{
            nextAge=user.age+1
        }
        )
        expect(nextAge).toBe(11)

        //update  没有收集依赖和触发依赖以下测试代码报错
        user.age++
        expect(nextAge).toBe(12)

    })

    it('should return runner when call effect',()=>{
        //1 effect(fn)-> function runner()-> fn -> return
        //1.given
        let foo=10
      const runner=  effect(()=>{
            foo++
            return 'foo'
        })
        expect(foo).toBe(11)
        //runner() 是否会执行fn
        const r=runner()
        expect(foo).toBe(12)
        //runner() 是否会返回fn的返回值 
        expect(r).toBe('foo') 
    })
})
  