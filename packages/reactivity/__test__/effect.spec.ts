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

  it('should be called once', () => {
    const obj = reactive({ foo1: 1, foo2: 2 })
    const fnSpy = jest.fn(() => {
      if (obj.foo1 === 1) {
        obj.foo2 = 3
      }
    })
    const fnSpy2 = jest.fn(() => console.log(obj.foo2))

    effect(fnSpy)
    effect(fnSpy2)
    obj.foo1 = 2
    expect(fnSpy).toHaveBeenCalledTimes(2)
    expect(fnSpy2).toHaveBeenCalledTimes(1)
  })

  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler },
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })

  it('should observe json methods', () => {
    let dummy = <Record<string, number>>{}
    const obj = reactive<Record<string, number>>({ })
    effect(() => {
      dummy = JSON.parse(JSON.stringify(obj))
      console.log('test')
    })
    obj.a = 1
    expect(dummy.a).toBe(1)
  })

  it('should observe class method invocations', () => {
    class Model {
      count: number
      constructor() {
        this.count = 0
      }

      inc() {
        this.count++
      }
    }
    const model = reactive(new Model())
    let dummy
    effect(() => {
      dummy = model.count
    })
    expect(dummy).toBe(0)
    model.inc()
    expect(dummy).toBe(1)
  })

  it('lazy', () => {
    const obj = reactive({ foo: 1 })
    let dummy
    const runner = effect(() => (dummy = obj.foo), { lazy: true })
    expect(dummy).toBe(undefined)

    expect(runner()).toBe(1)
    expect(dummy).toBe(1)
    obj.foo = 2
    expect(dummy).toBe(2)
  })
})
