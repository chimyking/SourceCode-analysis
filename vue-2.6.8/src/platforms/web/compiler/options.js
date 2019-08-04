/* @flow */

import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'

export const baseOptions: CompilerOptions = {
  expectHTML: true,
  modules, // [klass,style,model]
  directives, // {model,text,html}
  isPreTag, // const isPreTag = (tag: ? string): boolean => tag === 'pre'
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
}


// const isUnaryTag = makeMap(
//   'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
//   'link,meta,param,source,track,wbr'
// )

// const mustUseProp = (tag: string, type: ? string, attr : string): boolean => {
//   return (
//     (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
//     (attr === 'selected' && tag === 'option') ||
//     (attr === 'checked' && tag === 'input') ||
//     (attr === 'muted' && tag === 'video')
//   )
// }