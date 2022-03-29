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

export function effect<T = any>(
  fn: () => T,
) {
  const _effect = new ReactiveEffect(fn)

  _effect.run()
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

function trackEffect(dep: Dep) {
  dep.add(activeEffect!)
  activeEffect!.deps.push(dep)
}
