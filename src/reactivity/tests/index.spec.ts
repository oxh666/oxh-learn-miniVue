import { it, expect, describe } from 'vitest'
import {add} from '../index'
describe('test', () => {
    it('should be equal', () => {
        expect(add(1,1)).toBe(2)
    })
})
