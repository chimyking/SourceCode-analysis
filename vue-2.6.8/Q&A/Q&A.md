

<!-- /Users/chimy/practice-web/SourceCode-analysis/vue-2.6.8/src/core.1/vdom/create-element.js -->
```
// support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = {
      default: children[0]
    }
    children.length = 0
  }
  
  
  ```