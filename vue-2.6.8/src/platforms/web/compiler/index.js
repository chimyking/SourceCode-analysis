/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

// const baseOptions: CompilerOptions = {
//   expectHTML: true,
//   modules, // [klass,style,model]
//   directives,
//   isPreTag,
//   isUnaryTag,
//   mustUseProp,
//   canBeLeftOpenTag,
//   isReservedTag,
//   getTagNamespace,
//   staticKeys: genStaticKeys(modules)
// }
const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
