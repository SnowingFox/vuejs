import { ReactiveFlags, Target } from './reactive'
import { track, trigger } from './effect'

const get = /*#__PURE__*/ createGetter()
const readonlyGet = /*#__PURE__*/ createGetter(true)

const set = /*#__PURE__*/ createSetter()

function createGetter(isReadonly = false, isShallow = false): ProxyHandler<any>['get'] {
  return function get(target: Target, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver)

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return isShallow
    }

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

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set(target, key) {
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`)
    return true
  },
  defineProperty(target, key) {
    console.warn(`DefineProperty operation on key "${String(key)}" failed: target is readonly.`)
    return true
  },
}
