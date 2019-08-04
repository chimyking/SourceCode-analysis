import {
  History
} from './base'



export class HashHistory extends History {


  constructor(router: Router, base: ? string, fallback : boolean) {
    super(router, base)

    if (fallback && this.base) {
      return
    }

    ensureSlash()
  }

  go(n: number) {
    window.history.go(n)
  }
  push(loc: RawLocation) {
    const {
      current: fromRoute
    } = this
    this.transitionTo(
      location,
      route => {
        pushHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }
  replace(loc: RawLocation) {
    const {
      current: fromRoute
    } = this
    this.transitionTo(
      location,
      route => {
        replaceHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }
  ensureURL(push ? : boolean) {
    const current = this.current.fullPath
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current)
    }
  }
  getCurrentLocation() {
    window.location.hash = path
  }

  setupListeners() {}
}