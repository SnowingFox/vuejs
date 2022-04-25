import { isReadonly, reactive, readonly } from '../src'

describe('reactivity/reactive', () => {
  it('should be defined', () => {
    expect(reactive).toBeDefined()
  })

  test('readonly', () => {
    const readonlyObj = readonly({ foo: 1 })
    const reactiveObj = reactive({ foo: 1 })
    expect(isReadonly(readonlyObj)).toBe(true)
    expect(isReadonly(reactiveObj)).toBe(false)
  })
})
