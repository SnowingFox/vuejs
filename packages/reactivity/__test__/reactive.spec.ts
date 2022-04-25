import { isProxy, isReactive, reactive, readonly } from '../src'

describe('reactivity/reactive', () => {
  test('isReactive', () => {
    const reactiveObj = reactive({ foo: 1 })
    const readonlyObj = readonly({ foo: 1 })
    const obj = { foo: 1 }
    expect(isReactive(reactiveObj)).toBe(true)
    expect(isReactive(readonlyObj)).toBe(false)
    expect(isReactive(obj)).toBe(false)
  })
  test('isProxy', () => {
    const proxyObj = reactive({ foo: 1 })
    const readonlyProxyObj = readonly({ foo: 1 })
    const obj = { foo: 1 }
    expect(isProxy(proxyObj)).toBe(true)
    expect(isProxy(readonlyProxyObj)).toBe(true)
    expect(isProxy(obj)).toBe(false)
  })
})
