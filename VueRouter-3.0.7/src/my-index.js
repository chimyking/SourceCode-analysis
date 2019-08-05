export default class VueRouter {
  static install: () => void;
  static version: string;

  app: any;
  apps: Array;
  ready: boolean;
  readyCbs: Array;
  options: RouterOptions;
  mode: string;
  history: HashHistory | HTML5History | AbstractHistory;
  matcher: Matcher;
  fallback: boolean;
  beforeHooks: Array;
  resolveHooks: Array;
  afterHooks: Array;
  constructor(options) {
    this.app = null
    this.apps = []
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []

    /**
     * match,
     * addRoutes
     */
    this.matcher = createMatcher(options.routes || [], this)

    let mode = options.mode || 'hash'
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false

    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    /**
     * router
     * base
     * current
     * pending
     * cb
     * ready
     * readyCbs
     * readyErrorCbs
     * errorCbs
     * 
     * go
     * push
     * replace
     * ensureURL
     * getCurrentLocation
     * 
     * 
     * listen
     * onReady
     * onError
     * transitionTo
     * confirmTransition
     * updateRoute
     */
    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        if (process.env.NODE_ENV !== 'production') {
          assert(false, `invalid mode: ${mode}`)
        }
    }
  }

  match(
    raw,
    current,
    redirectedFrom
  ): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }


  get currentRoute(): ? Route {
    return this.history && this.history.current
  }

}

VueRouter.install = install
VueRouter.version = '__VERSION__'

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}