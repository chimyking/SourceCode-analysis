/* @flow */

import {
  createRoute,
  isSameRoute,
  isIncludedRoute
} from '../util/route'
import {
  extend
} from '../util/misc'
import {
  normalizeLocation
} from '../util/location'
import {
  warn
} from '../util/warn'

// work around weird flow bug
const toTypes: Array < Function > = [String, Object] // string 或者 对象
const eventTypes: Array < Function > = [String, Array]

/**
 * to:
 * to = "home"
 * :to = "home"
 * :to = "{ path: 'home' }"
 * :to = "{ name: 'user', params: { userId: 123 }}"
 * :to = "{ path: 'register', query: { plan: 'private' }}"
 */
export default {
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render(h: Function) {
    const router = this.$router
    const current = this.$route
    const {
      location,
      route,
      href
    } = router.resolve(
      this.to,
      current,
      this.append
    )

    const classes = {}

    const globalActiveClass = router.options.linkActiveClass

    const globalExactActiveClass = router.options.linkExactActiveClass

    // Support global empty active class
    const activeClassFallback =
      globalActiveClass == null ? 'router-link-active' : globalActiveClass

    const exactActiveClassFallback =
      globalExactActiveClass == null ?
      'router-link-exact-active' :
      globalExactActiveClass

    const activeClass =
      this.activeClass == null ? activeClassFallback : this.activeClass

    const exactActiveClass =
      this.exactActiveClass == null ?
      exactActiveClassFallback :
      this.exactActiveClass

    const compareTarget = route.redirectedFrom ?
      createRoute(null, normalizeLocation(route.redirectedFrom), null, router) :
      route

    classes[exactActiveClass] = isSameRoute(current, compareTarget)

    classes[activeClass] = this.exact ?
      classes[exactActiveClass] :
      isIncludedRoute(current, compareTarget)

    const handler = e => {
      if (guardEvent(e)) {

        if (this.replace) {
          router.replace(location)
        } else {
          router.push(location)
        }
      }
    }

    const on = {
      click: guardEvent
    }
    if (Array.isArray(this.event)) {
      this.event.forEach(e => {
        on[e] = handler
      })
    } else {
      on[this.event] = handler
    }

    const data: any = {
      class: classes
    }

    const scopedSlot = !this.$scopedSlots.$hasNormal &&
      this.$scopedSlots.default &&
      this.$scopedSlots.default({
        href,
        route,
        navigate: handler,
        isActive: classes[activeClass],
        isExactActive: classes[exactActiveClass]
      })

    // todo
    if (scopedSlot) {
      if (scopedSlot.length === 1) {
        return scopedSlot[0]
      } else if (scopedSlot.length > 1 || !scopedSlot.length) {
        if (process.env.NODE_ENV !== 'production') {
          warn(
            false,
            `RouterLink with to="${
              this.props.to
            }" is trying to use a scoped slot but it didn't provide exactly one child.`
          )
        }
        return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot)
      }
    }

    if (this.tag === 'a') {
      data.on = on
      data.attrs = {
        href
      }
    } else {
      // find the first <a> child and apply listener and href
      const a = findAnchor(this.$slots.default)
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false
        const aData = (a.data = extend({}, a.data))
        aData.on = on
        const aAttrs = (a.data.attrs = extend({}, a.data.attrs))
        aAttrs.href = href
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on
      }
    }

    /**
     * {
     * tag:'',
     * data:'',
     * children
     * }
     */
    return h(this.tag, data, this.$slots.default)
  }
}

function guardEvent(e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute('target')
    if (/\b_blank\b/i.test(target)) return
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault()
  }
  return true
}

function findAnchor(children) {
  if (children) {
    let child
    for (let i = 0; i < children.length; i++) {
      child = children[i]
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}