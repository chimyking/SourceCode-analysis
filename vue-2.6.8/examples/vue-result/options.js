let options = {
  // user
  /**
   * 类型： { [key: string]: Function }
   * 默认值 ：{}
   * 
   * https://cn.vuejs.org/v2/guide/mixins.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%80%89%E9%A1%B9%E5%90%88%E5%B9%B6%E7%AD%96%E7%95%A5
   */
  optionMergeStrategies: {},
  silent: false,
  productionTip: true, // 设置为 false 以阻止 vue 在启动时生成生产提示。
  performance: false,
  devtools: true,
  errorHandler: undefined,
  warnHandler: undefined,
  ignoredElements: [],
  keyCodes: {},

  // platform
  isReservedTag: "",
  isReservedAttr: '',
  parsePlatformTagName: '',
  isUnknownElement: '',
  getTagNamespace: '',
  mustUseProp: '',


  // private
  async: '',

  // legacy
  _lifecycleHooks: '',



  // other 

  _isComponent: true,


  _parentVnode: {
    componentOptions: {
      propsData: {},
      listeners: {},
      children: {},
      tag: {}
    }
  }
  parent: {},

  render: () => {},
  staticRenderFns: () => {}
}
