import { it, expect, describe } from 'vitest'
import { reactive } from '../reactivity/reactive'
describe('reactive', () => {

    it('happy_path', () => {
        //基本逻辑
        const orginal ={foo:1}
        const ovserved =reactive(orginal)
        expect(ovserved).not.toBe(orginal)
        expect(ovserved.foo).toBe(1)
    })

})