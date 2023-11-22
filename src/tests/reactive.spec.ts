import { it, expect, describe } from 'vitest'
import { reactive ,isReactive} from '../reactivity/reactive'
describe('reactive', () => {

    it('happy_path', () => {
        //基本逻辑
        const orginal ={foo:1}
        const ovserved =reactive(orginal)
        expect(ovserved).not.toBe(orginal)
        expect(ovserved.foo).toBe(1)
        
        //isReactive
        //reactive 对象
        expect(isReactive(ovserved)).toBe(true)
        //非reactive 对象
        expect(isReactive(orginal)).toBe(false)
    })

})
