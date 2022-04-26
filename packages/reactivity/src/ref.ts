declare const RefSymbol: unique symbol

export interface Ref<T = any> {
  value: T
  [RefSymbol]: true
}

class RefImpl<T> {
  public _value: T
  constructor(value: T) {
    this._value = value
  }

  get value() {
    return this._value
  }

  set value(value) {

  }
}

export function ref<T>(value: T) {
  return new RefImpl(value)
}
