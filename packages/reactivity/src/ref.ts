import { hasChanged } from '@vue/shared'
import { toRaw, toReactive } from './reactive'
import { activeEffect, shouldTrack, trackEffect, triggerEffects } from './effect'
import { Dep, createDep } from './dep'

declare const RefSymbol: unique symbol

export interface Ref<T = any> {
  value: T
  [RefSymbol]: true
}

class RefImpl<T> {
  public _value: T
  public _rawValue: T
  public dep: Dep | undefined

  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? toRaw(value) : value
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this.__v_isShallow ? newVal : toReactive(newVal)
      triggerRefValue(this)
    }
  }
}

export function trackRefValue(ref: RefImpl<any>) {
  if (activeEffect && shouldTrack) {
    ref = toRaw(ref)
    trackEffect(ref.dep || (ref.dep = createDep()))
  }
}

export function triggerRefValue(ref: RefImpl<any>) {
  if (ref.dep) {
    ref = toRaw(ref)
    triggerEffects(ref.dep!)
  }
}

export function isRef(r: any | Ref) {
  return !!(r && r.__v_isRef === true)
}

export function ref<T>(value?: T) {
  return new RefImpl(value, false) as RefImpl<T>
}
