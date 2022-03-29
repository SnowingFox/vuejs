import { track } from './effect'

export function reactive<T extends object>(target: T): T
export function reactive(target: Object) {
  return new Proxy(target, {
    get(target: Object, key: string | symbol): any {
      track(target, key)

      return target
    },
  })
}
