/* @flow */

import config from '../config'
import {
  initUse
} from './use'
import {
  initMixin
} from './mixin'
import {
  initExtend
} from './extend'
import {
  initAssetRegisters
} from './assets'


import {
  set,
  del
} from '../observer/index'

import {
  ASSET_TYPES
} from 'shared/constants'

import builtInComponents from '../components/index'
import {
  observe
} from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  Vue.observable = (obj: T): T => {
    observe(obj)
    return obj
  }


  Vue.options = Object.create(null)
  
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  Vue.options._base = Vue

  extend(Vue.options.components, builtInComponents)

  initUse(Vue)
  initMixin(Vue)
  initExtend(Vue)
  initAssetRegisters(Vue)
}
