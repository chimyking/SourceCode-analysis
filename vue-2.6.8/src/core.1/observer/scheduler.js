/* @flow */

import type Watcher from './watcher'
import config from '../config'
import { callHook, activateChildComponent } from '../instance/lifecycle'

import {
  warn,
  nextTick,
  devtools,
  inBrowser
} from '../util/index'

export const MAX_UPDATE_COUNT = 100

const queue: Array<Watcher> = []
const activatedChildren: Array<Component> = []
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState() {
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') {
    circular = {}
  }
  waiting = flushing = false
}


// Async edge case #6566 requires saving the timestamp when event listeners are attached.
// 异步边缘案例要求在附加事件侦听器时保存时间戳。
// However, calling performance.now() has a perf overhead especially if the page has thousands of event listeners. 
// 但是，调用performance.now（）会带来性能开销，特别是在页面上有数千个事件侦听器的情况下。
// Instead, we take a timestamp every time the scheduler flushes and use that for all event listeners  attached during that flush.
// 相反，我们每次调度程序刷新时都会获取一个时间戳，并在刷新期间将其用于连接的所有事件侦听器。
export let currentFlushTimestamp = 0

// Async edge case fix requires storing an event listener's attach timestamp.
// 异步边缘大小写修复需要存储事件侦听器的附加时间戳。
let getNow: () => number = Date.now

// Determine what event timestamp the browser is using. 
// 确定浏览器使用的事件时间戳。
// Annoyingly, the timestamp can either be hi-res (relative to page load) or low-res (relative to UNIX epoch), so in order to compare time we have to use the  same timestamp type when saving the flush timestamp.
// 令人讨厌的是，时间戳可以是高分辨率（相对于页面加载）或低分辨率（相对于Unix Epoch），因此为了比较时间，在保存刷新时间戳时必须使用相同的时间戳类型。
if (
  inBrowser &&
  window.performance &&
  typeof performance.now === 'function' &&
  document.createEvent('Event').timeStamp <= performance.now()
) {
  // if the event timestamp is bigger than the hi-res timestamp
  // (which is evaluated AFTER) it means the event is using a lo-res timestamp,
  // and we need to use the lo-res version for event listeners as well.
  // 如果事件时间戳大于高分辨率（之后计算），则表示事件使用的是低分辨率，我们还需要为事件侦听器使用低分辨率。
  getNow = () => performance.now()
}

/**
 * Flush both queues and run the watchers.
 * 刷 队列里面的watcher和正在运行中的watchers
 */
function flushSchedulerQueue() {
  currentFlushTimestamp = getNow() // performance.now()
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 1. 组件是从父到子更新的
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 2. 组件的用户观察程序在其呈现观察程序之前运行（因为用户观察程序在呈现观察程序之前创建）
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  // 3. 如果在父组件的监视程序运行期间销毁了某个组件，则可以跳过其监视程序。

  // 排序
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    if (watcher.before) {
      watcher.before()
    }
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush')
  }
}

function callUpdatedHooks(queue) {
  let i = queue.length
  while (i--) {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated')
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * 对在修补过程中激活的保持活动状态的组件进行排队。
 * The queue will be processed after the entire tree has been patched.
 * 在修补整个树之后，将处理队列。
 */
export function queueActivatedComponent(vm: Component) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false
  activatedChildren.push(vm)
}

function callActivatedHooks(queue) {
  for (let i = 0; i < queue.length; i++) {
    queue[i]._inactive = true
    activateChildComponent(queue[i], true /* true */)
  }
}

/**
 * Push a watcher into the watcher queue. Jobs with duplicate IDs will be skipped unless it's pushed when the queue is being flushed.
 * 将观察程序推入观察程序队列。具有重复ID的作业将被跳过，除非在刷新队列时将其推送。
 */
export function queueWatcher(watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true

    if (!flushing) {
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher) // 添加
    }

    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      nextTick(flushSchedulerQueue)
    }
  }
}
