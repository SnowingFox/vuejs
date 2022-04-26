import { isObject } from '../../shared/src'
import { mutableHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw',
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.IS_SHALLOW]?: boolean
  [ReactiveFlags.RAW]?: any
}

export const reactiveMap = new WeakMap<Target, any>()
export const shallowReactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()
export const shallowReadonlyMap = new WeakMap<Target, any>()

export function reactive<T extends object>(target: T): T
export function reactive(target: Object) {
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    reactiveMap,
  )
}

export function shallowReactive<T extends object>(target: T): T {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowReactiveMap,
  )
}

export function readonly<T extends object>(target: T): T {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyMap,
  )
}

export function shallowReadonly<T extends object>(target: T): T {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyMap,
  )
}

function createReactiveObject(
  target: Object,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<any, any>,
) {
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)

  return proxy
}

export function toRaw<T>(observed: T): T {
  const raw = observed && (observed as Target)[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}

export function isReadonly(target: unknown) {
  return !!(target as Target)[ReactiveFlags.IS_READONLY]
}

export function isReactive(target: unknown) {
  return !!(target as Target)[ReactiveFlags.IS_REACTIVE]
}

export function isShallow(target: unknown) {
  return !!(target as Target)[ReactiveFlags.IS_SHALLOW]
}

export function isProxy(target: unknown) {
  return isReactive(target) || isReadonly(target)
}

export function toReactive(target: unknown) {
  return isObject(target) ? reactive(target) : target
}

export function toReadonly(target: unknown) {
  return isObject(target) ? readonly(target as Record<any, any>) : target
}
