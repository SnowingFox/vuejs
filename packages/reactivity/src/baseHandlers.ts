import { extend, isObject } from '../../shared/src'
import {
  ReactiveFlags,
  Target,
  isShallow,
  reactive,
  reactiveMap,
  readonly, readonlyMap, shallowReactiveMap, shallowReadonlyMap,
} from './reactive'
import { track, trigger } from './effect'

const get = /*#__PURE__*/ createGetter()
const readonlyGet = /*#__PURE__*/ createGetter(true)
const shallowGet = /*#__PURE__*/ createGetter(false, true)
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true)

function createGetter(isReadonly = false, shallow = false): ProxyHandler<any>['get'] {
  return function get(target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return shallow
    } else if (
      key === ReactiveFlags.RAW
        && receiver === (isReadonly
          ? shallow
            ? shallowReadonlyMap
            : readonlyMap
          : shallow
            ? shallowReactiveMap
            : reactiveMap
      ).get(target)
    ) {
      return target
    }

    if (!isReadonly) {
      track(target, key)
    }

    const res = Reflect.get(target, key, receiver)

    if (shallow) {
      return res
    }

    // TODO why should I must using isShallow here?
    if (isObject(res) && !isShallow(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

const set = /*#__PURE__*/ createSetter()
const shallowSet = /*#__PURE__*/ createSetter(true)

function createSetter(shallow = false): ProxyHandler<any>['set'] {
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

export const shallowReadonlyHandlers: ProxyHandler<object> = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})

export const shallowReactiveHandlers = /*#__PURE__*/ extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet,
  },
)
