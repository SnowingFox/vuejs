import { Target } from './reactive'
import { track, trigger } from './effect'

const get = /*#__PURE__*/ createGetter()
const set = /*#__PURE__*/ createSetter()

function createGetter(isReadonly = false): ProxyHandler<any>['get'] {
  return function get(target: Target, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver)

    if (!isReadonly) {
      track(target, key)
    }

    return res
  }
}

function createSetter(): ProxyHandler<any>['set'] {
  return function set(target: Target, key: string | symbol, value: any, receiver: object) {
    const oldVal = (target as any)[key]
    const result = Reflect.set(target, key, value, receiver)
    if (value !== oldVal) {
     trigger(target, key)
    }
    return result
  }
}

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set,
}
