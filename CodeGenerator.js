function CodeGenerator(TheBigAST) {
    var functionBox = TheBigAST[0];
   return processFunction(functionBox[0].body)
}
function processFunction(functionPack) {
  let newLang = ''
  for(let i=0;i<functionPack.length;i++) {
   let part = functionPack[i]
   newLang +=  processBodyAndArgs(part.name,part.body,part.args)
   newLang += '\n'
  }
  return newLang
}
function createFunctionDef(type,args) {
    let functDef = ''
    // creating function definition
    if (type == 'main') {
        functDef += '(function() {' + '\n' 
    } else {
        functDef += 'function ' +  type + '('
    }
    for (let i=0;i<args.length;i++) {
        let arg = args[i]
        functDef += arg.name 
    }
    if (type != 'main') {
    functDef += ') {' + '\n'
    }
    return functDef
}
function endOfFunction(type) {
    let endOf = ''
    if (type == 'main') {
        endOf += '}();'
    } else {
        endOf += '}'
    }
    return endOf
}
function containsDataType(datatype) {
    let Datatype = ['int','char','string','float','double']
    return Datatype.includes(datatype)
}
function processStatement(type,phrases) {
  let newStat = ''
  for (let i=0;i<phrases.length;i++) {
      let part = phrases[i]
      if (part.type == 'Word' && containsDataType(part.value)) {
         newStat += 'var '
      } if (part.type == 'Word' && !containsDataType(part.value)) {
        newStat += part.value + ' '
      } else if (part.type == 'NumberLiteral' || part.type == 'PlusPlus' || part.type == 'MinusMinus' || part.type == 'Or' || part.type == 'Pipe' || part.type == 'And' || part.type == 'AndAnd' || part.type == 'Plus' || part.type == 'Minus' || part.type == 'PlusE' || part.type == 'MinusE'
       || part.type == 'EqualE' || part.type == 'NotE' || part.type == 'Not' || part.type == 'Colon' || part.type == 'Dot' || 
       part.type == 'Question' || part.type == 'Less' || part.type == 'Greater' || part.type == 'GreaterOrEqual' || 
       part.type == 'LessOrEqual' || part.type == 'Array' || part.type == 'Equal' || part.type == 'Delimiter' ) {
          newStat += part.value + ' '
      } else if (part.type == 'StringLiteral') {
        newStat += "'" + part.value + "'"
      }
  }
  if (type == 'Statement')
    newStat += '\n'
  return newStat
}
function processConditionalBody(functionBody) {
  let funBody = ''
  for (let i=0;i<functionBody.length;i++) {
      let part = functionBody[i]
      if (part.type == 'Statement') {
        funBody += processStatement(part.type,part.value)
      } else if (part.type == 'if' || part.type == 'else' || part.type == 'for' || part.type == 'while' || part.type == 'else if')  {
        funBody += processContitionalStatement(part)
      } else if (part.type == 'do') {
        funBody += processDoStatement(part)
      } else if (part.type == 'switch') { 
       funBody += processSwitchStatement(part)
      } else if (part.type == 'Call') {
        funBody += processCallBackFunction(part)
      }
  }
  return funBody
}
function processContitionalStatement(inside) {
  let newIf = inside.type + ' ( '
  if (inside.type != 'else')
    newIf += processStatement(inside.type,inside.condition)
  newIf += ') {' + '\n'
  newIf += processConditionalBody(inside.body)
  newIf += '}' + '\n'
  return newIf
}
function processDoStatement(inside) {
  let newDo = inside.type + ' {' + '\n'
  newDo += processConditionalBody(inside.body)
  newDo += '} while ( ' 
  newDo += processStatement(inside.type,inside.condition)
  newDo += ')' + '\n'
  return newDo 
}
function processSwitchStatement(inside) {
   let newSwitch =''
   let newCases = ''
   newSwitch += 'Switch( '
   newSwitch += processStatement(inside.type,inside.condition)
   newSwitch += ') {' + '\n'
   // process cases
   for (let i=0;i<inside.body.length;i++) {
      let newBody = ''
      let part = inside.body[i]
      if (part.caseValue != 'default')
         newCases += 'case ' + part.caseValue + ':' + '\n'
      else
        newCases += 'default :' + '\n'
      //process statement
      for (let j=0;j<part.caseStatements.length;j++) {
        let caseBody = part.caseStatements[j]
        if (caseBody.type == 'Statement') {
          newBody += processStatement(caseBody.type,caseBody.value)
        } else if (caseBody.type == 'do') {
          newBody += processDoStatement(caseBody)
        } else if (caseBody.type == 'if' || caseBody.type == 'else' || caseBody.type == 'for' || caseBody.type == 'while' || caseBody.type == 'else if') {
          newBody += processContitionalStatement(caseBody)
        }  else if (caseBody.type == 'switch') {
          newBody += processSwitchStatement(caseBody)
        } else if (caseBody.type == 'Call') {
          newBody += processCallBackFunction(caseBody)
        }
      }
      newCases += newBody
   }
   newSwitch += newCases
   //end of switch
   newSwitch += '}' + '\n'
   return newSwitch
}
function processCallBackFunction(inside) {
  let newCall = inside.callee + '( '
  newCall += processStatement('call',inside.params)
  newCall += ')' + '\n'
  return newCall
}
function processBodyAndArgs(type,body,args) {
   var newTrans = ''
   //starting part
   newTrans += createFunctionDef(type,args)
   for (let i=0;i<body.length;i++) {
       let part = body[i]
       if (part.type == 'Statement') {
         newTrans += processStatement(part.type,part.value)
       } else if (part.type == 'if' || part.type == 'else' || part.type == 'for' || part.type == 'while' || part.type == 'else if') {
         newTrans += processContitionalStatement(part)
       } else if(part.type == 'do') {
         newTrans += processDoStatement(part)
       } else if (part.type == 'switch') {
         newTrans += processSwitchStatement(part)
       } else if (part.type == 'Call') {
         newTrans += processCallBackFunction(part)
       }
   }
   //ending part
   newTrans += endOfFunction(type)
   return newTrans
}