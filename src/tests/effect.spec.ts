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
})
  