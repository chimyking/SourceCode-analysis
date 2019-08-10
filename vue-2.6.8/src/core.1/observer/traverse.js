/* @flow */

import { _Set as Set, isObject } from '../util/index'
import type { SimpleSet } from '../util/index'
import VNode from '../vdom/vnode'

const seenObjects = new Set()

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
export function traverse(val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

/**
 * 递归遍历val
 * 直到 val
 * 1. 不是数组、
 * 2. 不是对象、
 * 3. val被冻结、
 * 4. 是个vnode实例、
 * 5. 已经被处理过了（去重）
 *
 * @param {*} val
 * @param {SimpleSet} seen
 */
function _traverse(val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)

  // 出口一
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    // 不是数组、不是对象、val被冻结了、是个vnode实例
    return
  }

  // 出口二
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }

  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
