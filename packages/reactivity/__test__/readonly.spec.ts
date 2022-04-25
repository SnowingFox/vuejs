import { effect, isReadonly, reactive, readonly } from '../src'

test('readonly', () => {
  const readonlyObj = readonly({ foo: 1 })
  const reactiveObj = reactive({ foo: 1 })
  const fnSpy = jest.fn(() => console.log(readonlyObj.foo))
  effect(fnSpy)
  expect(fnSpy).toHaveBeenCalled()
  expect(isReadonly(readonlyObj)).toBe(true)
  expect(isReadonly(reactiveObj)).toBe(false)
})
