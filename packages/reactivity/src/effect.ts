import { Dep } from './dep'

let activeEffect: ReactiveEffect | null = null

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export class ReactiveEffect<T = any> {
  deps: Dep[] = []

  constructor(
    public fn: () => T,
  ) {
  }

  run() {
    activeEffect = this

    return this.fn()
  }
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect<T>
}

export function effect<T = any>(
  fn: () => T,
) {
  const _effect = new ReactiveEffect(fn)

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner<T>
  runner.effect = _effect
}

export function track(target: Object, key: unknown) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)

  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  trackEffect(dep)
}

// trackEffect(dep)
function trackEffect(dep: Dep) {
  dep.add(activeEffect!)
  activeEffect!.deps.push(dep)
}
