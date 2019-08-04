/* @flow */

import {
  warn,
  remove,
  isObject,
  parsePath,
  _Set as Set,
  handleError,
  noop
} from '../utils-all'

import {
  traverse
} from './traverse'
import {
  queueWatcher
} from './scheduler'
import Dep, {
  pushTarget,
  popTarget
} from './dep'

import type {
  SimpleSet
}
from '../utils-all'


let uid = 0


export default class Watcher {
  vm: component
  expression: string
  cb: Function
  id: number

  deep: boolean
  user: boolean
  lazy: boolean
  sync: boolean
  before: ? Function

  dirty: boolean
  deps: Array
  newDeps: Array
  depids: SimpleSet
  newDepIds: SimpleSet

  getter: Function
  value: any

  constructor(
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options ? : ? Object,
    isRenderWatcher ? : boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }

    vm._watchers.push(this)

    if (options) {

      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before

    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }

    this.cb = cb
    this.id = ++uid
    this.active = true
    this.dirty = this.lazy

    this.deps = []
    this.newDeps = []

    this.depIds = new Set()
    this.newDepIds = new Set()

    this.expression = process.env.NODE_ENV !== 'production' ? expOrFn.toString() : ''


    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop

        process.env.NODE_ENV !== 'production'
        warn(
          `Failed watching path: "${expOrFn}"` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }

    this.value = this.lazy ? undefined : this.gett()
  }
  get() {
    pushTarget(this)

    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)


    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
  addDep(dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
  cleanupDeps() {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.deoIds

    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  update() {

    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      queueWatcher(this)
    }
  }
  run() {
    if (this.active) {
      const value = this.get()

      if (value !== this.value || idObject(value) || this.deep) {
        this.oldValue = this.value
        this.value = value
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
  evaluate() {
    this.value = this.get()
    this.dirty = true
  }
  depend() {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
  teardown() {
    if (this.active) {
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this)
      }

      let i = this.deps.length
      while (i--) {
        this.deps[i].removeSub(this)
      }
      this.active = false
    }
  }

}
