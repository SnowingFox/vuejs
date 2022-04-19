import { Dep, createDep } from './dep'

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

  return runner
}

function cleanupEffect(effect: ReactiveEffect) {
  const { deps } = effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
    deps.length = 0
  }
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
  let shouldTrack = false
  shouldTrack = !dep.has(activeEffect!)
  if (shouldTrack) {
    dep.add(activeEffect!)
    activeEffect!.deps.push(dep)
  }
}

export function trigger(
  target: Object,
  key: unknown,
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    return
  }

  const deps: (Dep | undefined)[] = []
  deps.push(depsMap.get(key))

  const effects: ReactiveEffect[] = []
  for (const dep of deps) {
    if (dep) {
      effects.push(...dep)
    }
  }

  triggerEffects(createDep(effects))
}

export function triggerEffects(
  dep: Dep,
) {
  for (const effect of dep) {
    effect.run()
  }
}
