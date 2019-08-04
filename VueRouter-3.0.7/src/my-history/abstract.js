import {
  History
} from './base'
export class AbstractHitory extends History {
  index: number
  stack: Array < Router >
    constructor(router: Router, base: ? string, fallback : boolean) {
      super(router, base)
      this.stack = []
      this.index = -1
    }
  go(n: number) {
    const targetIndex = this.index + n
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    const route = this.stack[targetIndex]
    this.confirmTransition(
      route,
      () => {
        this.index = targetIndex
        this.updateRoute(route)
      },
      err => {
        if (isExtendedError(NavigationDuplicated, err)) {
          this.index = targetIndex
        }
      }
    )
  }
  push(loc: RawLocation) {
    this.transitionTo(
      location,
      route => {
        this.stack = this.stack.slice(0, this.index + 1).concat(route)
        this.index++
        onComplete && onComplete(route)
      },
      onAbort
    )
  }
  replace(loc: RawLocation) {
    this.transitionTo(
      location,
      route => {
        this.stack = this.stack.slice(0, this.index).concat(route)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }
  ensureURL(push ? : boolean) {

  }
  getCurrentLocation() {
    const current = this.stack[this.stack.length - 1]
    return current ? current.fullPath : '/'
  }
}