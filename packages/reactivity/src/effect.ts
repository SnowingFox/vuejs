import { extend } from '../../shared/src'
import { Dep, createDep } from './dep'
import { TrackOpTypes, TriggerOpTypes } from './operation'

export type DebuggerEvent = {
  effect: ReactiveEffect
} & DebuggerEventExtraInfo

export interface DebuggerEventExtraInfo {
  target: object
  type: TrackOpTypes | TriggerOpTypes
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}

export interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}

export type EffectScheduler = (...args: any[]) => any

let activeEffect: ReactiveEffect | null = null

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export class ReactiveEffect<T = any> {
  deps: Dep[] = []

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
  ) {
  }

  run() {
    activeEffect = this
    cleanupEffect(this)
    return this.fn()
  }
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

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect<T>
}

export interface ReactiveEffectOptions extends DebuggerOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
  allowRecurse?: boolean
  onStop?: () => void
}

export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions,
) {
  const _effect = new ReactiveEffect(fn)

  if (options) {
    extend(_effect, options)
  }

  if (!options || !options.lazy) {
    _effect.run()
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner<T>
  runner.effect = _effect

  return runner
}

export function track(target: Object, key: unknown) {
  if (!activeEffect) {
    return
  }
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
  dep: Dep | ReactiveEffect[],
) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}
