import {
  History
} from './base'


export class HTML5History extends History {


  constructor(router: Router, base: ? string) {
    super(router, base)
  }

  go(n: number) {
    window.history.go(n)
  }
  push(loc: RawLocation) {
    const {
      current: fromRoute
    } = this
    this.transitionTo(location, route => {
      pushState(cleanPath(this.base + route.fullPath))
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    }, onAbort)
  }
  replace(loc: RawLocation) {
    const {
      current: fromRoute
    } = this
    this.transitionTo(location, route => {
      replaceState(cleanPath(this.base + route.fullPath))
      handleScroll(this.router, route, fromRoute, false)
      onComplete && onComplete(route)
    }, onAbort)
  }
  ensureURL(push ? : boolean) {
    if (getLocation(this.base) !== this.current.fullPath) {
      const current = cleanPath(this.base + this.current.fullPath)
      push ? pushState(current) : replaceState(current)
    }
  }
  getCurrentLocation() {
    return getLocation(this.base)
  }
}

export function getLocation(base: string): string {
  let path = decodeURI(window.location.pathname)
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}