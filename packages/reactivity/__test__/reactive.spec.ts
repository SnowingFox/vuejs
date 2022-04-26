import { isProxy, isReactive, reactive, readonly, toReactive } from '../src'

describe('reactivity/reactive', () => {
  test('reactive', () => {
    const original = { foo: {} }
    const reactiveProxy = reactive(original)
    expect(isReactive(reactiveProxy.foo)).toBe(true)
  })
  test('isReactive', () => {
    const reactiveObj = reactive({ foo: 1 })
    const readonlyObj = readonly({ foo: 1, n: { value: 2 } })
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

  test('nested reactives', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    }
    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })

  test('toReactive', () => {
    const obj = { foo: 1 }
    expect(isReactive(toReactive(obj))).toBe(true)
  })
})
