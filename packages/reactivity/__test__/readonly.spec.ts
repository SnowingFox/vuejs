import { effect, isReadonly, reactive, readonly, toReadonly } from '../src'

test('readonly', () => {
  const readonlyObj = readonly({ foo: 1 })
  const reactiveObj = reactive({ foo: 1 })
  const fnSpy = jest.fn(() => console.log(readonlyObj.foo))
  effect(fnSpy)
  expect(fnSpy).toHaveBeenCalled()
  expect(isReadonly(readonlyObj)).toBe(true)
  expect(isReadonly(reactiveObj)).toBe(false)
})

test('readonly', () => {
  const obj = { foo: 1 }
  expect(isReadonly(toReadonly(obj))).toBe(true)
})
