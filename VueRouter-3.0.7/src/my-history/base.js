import {
  Route
} from "vue-router";
import { START, isSameRoute } from "../util/route";

export class History {

  router: Router
  base: string
  current: Route
  cb: (r: Route) => void
  ready: boolean
  readyCbs: Array<Function>
  readyErrorCbs: Array<Function>
  errorCbs: Array <Function>


  +go:(n:number)=>void
  +push:(loc:RawLocation)=>void
  +replace:(loc:RawLocation)=>void
  +ensureURL:(push?:boolean)=>boolean
  +getCurrentLocation:()=>string

  constructor(router:Router,base:?string) {

    this.router=  router
    this.base = base
    this.current = START
    this.pending = null
    this.ready = false
    this.readyCbs = []
    this.readyErrorCbs = []
    this.errorCbs = []
  }


  /**
   * 
   */
  listen(cb:Function){
    this.cb = cb
  }
  /**
   * 
   */
  onReady(cb: Function, errorCb: ? Function) {
    if (this.ready){
      cb()
    }else {
      this.readyCbs.push(cb)
      if (errorCb){
        this.readyErrorCbs.push(errorCb)
      }
    }
  }
  /**
   * 
   */
  onError(errorCb: Function) { 
    this.errorCbs.push(errorCb)
  }
  /**
   * 
   */
  transitionTo(
    location:RawLocation,
    onComplete?:Function,
    onAbort?:Function){
      const route = this.router.match(location,this.current)
  }
  /**
   * 
   */
  confirmTransition(route:Route,onComplete:Function,onAbort?:Function){
    const current = this.current

    const abort = err =>{
      onAbort && onAbort(err)
    }

    if (isSameRoute(route,current)&& route.mathed.length === current.matched.length){
      this.ensureURL()
      return abort(new NavigationDuplicated(route))
    }

    const {updated,deactivated,activated} = resolveQueue(
      this.current.matched,
      route.matched
    )
  }
  /**
   * 
   */
  updateRoutee(route:Route){}
}
function resolveQueue(
  current: Array<RouteRecord>,
  next: Array<RouteRecord>){

}