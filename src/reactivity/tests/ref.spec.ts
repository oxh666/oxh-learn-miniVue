import  {describe,test,expect,it} from 'vitest'
import {effect} from "../effect";
import { ref,isRef,unRef ,toRef} from '../ref'
import {reactive} from "../reactive";
describe('reactivity/ref', () => {
  it('should hold a value', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  })
  
  it('should be reactive', () => {
    const a = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = a.value
    })
    console.log('calls',calls)
    console.log('dummy',dummy)
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    a.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    // // same value should not trigger
    a.value = 2
    expect(calls).toBe(2)
  })
  
  it('should make nested properties reactive', () => {
    const a = ref({
      count: 1
    })
    let dummy
    effect(() => {
      dummy = a.value.count
    })
    expect(dummy).toBe(1)
    a.value.count = 2
    expect(dummy).toBe(2)
  })
  
  it('isRef', () => {
  const a =ref(1)
    const b=1
    const c=reactive({a:1})
    expect(isRef(a)).toBe(true)
    expect(isRef(1)).toBe(false)
    expect(isRef(c)).toBe(false)
  })
  
  it('unRef', () => {
    const a =ref(1)
    const b=1
    expect(unRef(a)).toBe(1)
    expect(unRef(1)).toBe(1)
  })
  
  it('toRef', () => {
    const a = reactive({
      x: 1
    })
    const x = toRef(a, 'x')
    console.log('x',x)
    expect(isRef(x)).toBe(true)
    expect(x.value).toBe(1)
    
    // source -> proxy
    a.x = 2
    expect(x.value).toBe(2)
    
    // proxy -> source
    x.value = 3
    expect(a.x).toBe(3)
    
    // reactivity
    let dummyX
    effect(() => {
      dummyX = x.value
    })
    expect(dummyX).toBe(x.value)
    
    // mutating source should trigger effect using the proxy refs
    a.x = 4
    expect(dummyX).toBe(4)
    
    // should keep ref
    const r = { x: ref(1) }
    expect(toRef(r, 'x')).toBe(r.x)
  })
  
})
