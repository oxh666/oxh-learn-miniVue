import {track ,trigger} from './effect'
export function reactive(raw: any) {
    return new Proxy(raw, {
        /**
         * 
         * @param target  reactive的参数raw
         * @param key 获取的用户访问的Key
         */
        get(target, key) {
            //target是{foo:1}，key是foo
            
            const res=Reflect.get(target,key)

            // TODO 依赖收集
            track(target,key)
            return res
        },
        
        /**
         * 
         * @param target reactive的参数raw
         * @param key 获取的用户访问的Key
         * @param value  获取的用户访问的Key
         */
        set(target, key, value) {   
              //target是{foo:1}，key是foo，value是1 
            const res = Reflect.set(target, key, value)  
            // TODO 触发依赖

            trigger(target,key)
            return res
        }
    })
}