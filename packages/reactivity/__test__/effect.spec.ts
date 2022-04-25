import { effect, reactive } from '../src'

describe('reactivity/effect', () => {
  it('should run the passed function once (wrapped by a effect)', () => {
    const fnSpy = jest.fn(() => {})
    effect(fnSpy)
    expect(fnSpy).toHaveBeenCalledTimes(1)
  })
  it('should be called twice', () => {
    const dummy = reactive({ foo: 1 })
    const fnSpy = jest.fn(() => console.log(dummy.foo))
    effect(fnSpy)
    dummy.foo = 2
    expect(fnSpy).toHaveBeenCalledTimes(2)
  })
})
