export const extend = Object.assign

export const isObject = (val) => val !== null && typeof val === 'object'

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue);
};

/**
 * Define a property.
 */
export function def(obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
