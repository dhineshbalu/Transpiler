function traverser(ast,visitors) {
   function traverserArray(array,parent) {
       array.forEach((child) => {
           traverseNode(child,parent)
       })
   }
   function traverseNode(node,parent) {
       let methods = visitors[node.type]
       if (methods && methods.enter) {
           methods.enter(node,parent)
       }
       switch(node.type) {
           case 'Program':
                traverserArray(node.body,node)
                break
           case 'CodeCave': 
                traverserArray(node.args,node)
                break
           case 'CodeDomain':
                 traverserArray(node.args,node)
                 break
           case 'GreaterE':
           case 'Greater':
           case 'LessE':
           case 'Less':
           case 'EqualE':
           case 'Equal':
           case 'NotE':
           case 'Not':
           case 'PlusE':
           case 'PlusPlus':
           case 'Plus':
           case 'MinusE':
           case 'Minus':
           case 'MinusMinus':
           case 'DivideE':
           case 'Divide':
           case 'StarE':
           case 'Star':
           case 'OrOr':
           case 'Pipe':
           case 'AndAnd':
           case 'And':
           case 'Array':
           case 'Word':
           case 'Question':
           case 'Delimiter':
           case 'Dot':
           case 'Terminator':
           case 'Colon':
           case 'NumberLiteral':
           case 'StringLiteral':
           break
       }
   }
   traverseNode(ast,null)
}
function transformer(ast) {
  let newAst = {
      type: 'Program',
      body: []
  }
  ast._context = newAst.body
  traverser(ast, {
      NumberLiteral: {
        enter(node, parent) {
          parent._context.push({
            type: 'NumberLiteral',
            value: node.value
          });
        },
      },
  
      Word: {
        enter(node, parent) {
          parent._context.push({
            type: 'Word',
            value: node.value
          });
        },
      },
  
      PlusPlus: {
        enter(node, parent) {
          parent._context.push({
            type: 'PlusPlus',
            value: node.value
          });
        },
      },
  
       MinusMinus: {
        enter(node, parent) {
          parent._context.push({
            type: 'MinusMinus',
            value: node.value
          });
        },
      },
  
  
      OrOr: {
        enter(node, parent) {
          parent._context.push({
            type: 'Or',
            value: node.value
          });
        },
      },
  
      Pipe: {
        enter(node, parent) {
          parent._context.push({
            type: 'Pipe',
            value: node.value
          });
        },
      },
  
      And: {
        enter(node, parent) {
          parent._context.push({
            type: 'And',
            value: node.value
          });
        },
      },
  
      AndAnd: {
        enter(node, parent) {
          parent._context.push({
            type: 'AndAnd',
            value: node.value
          });
        },
      },

  
      Plus: {
        enter(node, parent) {
          parent._context.push({
            type: 'Plus',
            value: node.value
          });
        },
      },
  
      Minus: {
        enter(node, parent) {
          parent._context.push({
            type: 'Minus',
            value: node.value
          });
        },
      },
  
      PlusE: {
        enter(node, parent) {
          parent._context.push({
            type: 'PlusE',
            value: node.value
          });
        },
      },
  
      MinusE: {
        enter(node, parent) {
          parent._context.push({
            type: 'MinusE',
            value: node.value
          });
        },
      },
  
      EqualE: {
        enter(node, parent) {
          parent._context.push({
            type: 'EqualE',
            value: node.value
          });
        },
      },
  
      NotE: {
        enter(node, parent) {
          parent._context.push({
            type: 'NotE',
            value: node.value
          });
        },
      },
  
      Not: {
        enter(node, parent) {
          parent._context.push({
            type: 'Not',
            value: node.value
          });
        },
      },
  
      Colon: {
        enter(node, parent) {
          parent._context.push({
            type: 'Colon',
            value: node.value
          });
        },
      },
  
      Dot: {
        enter(node, parent) {
          parent._context.push({
            type: 'Dot',
            value: node.value
          });
        },
      },
  
      Question: {
        enter(node, parent) {
          parent._context.push({
            type: 'Question',
            value: node.value
          });
        },
      },
  
      Less: {
        enter(node, parent) {
          parent._context.push({
            type: 'Less',
            value: node.value
          });
        },
      },
  
      Greater: {
        enter(node, parent) {
          parent._context.push({
            type: 'Greater',
            value: node.value
          });
        },
      },
  
      GreaterE: {
        enter(node, parent) {
          parent._context.push({
            type: 'GreaterOrEqual',
            value: node.value
          });
        },
      },
  
      LessE: {
        enter(node, parent) {
          parent._context.push({
            type: 'LessOrEqual',
            value: node.value
          });
        },
      },
  
      Array: {
        enter(node, parent) {
          parent._context.push({
            type: 'Array',
            value: node.params
          });
        },
      },
  
      Equal: {
        enter(node, parent) {
          parent._context.push({
            type: 'Equal',
            value: node.value
          });
        },
      },
  
      Delimiter: {
        enter(node, parent) {
          parent._context.push({
            type: 'Delimiter',
            value: node.value
          });
        },
      },
      Terminator: {
        enter(node, parent) {
          parent._context.push({
            type: 'Terminator',
            value: node.value
          });
        },
      },
  
      StringLiteral: {
        enter(node, parent) {
          parent._context.push({
            type: 'StringLiteral',
            value: node.value
          });
        },
      },
      CodeCave: {
          enter(node,parent) {
              let expression
              if (typeof node.name != "undefined") {
                  expression = {
                      type: 'CodeCave',
                      callee: {
                          type: 'Identifier',
                          name: node.name
                      },
                      arguments: []
                  }
              } else {
                  expression = {
                      type: 'CodeCave',
                      arguments: []
                  }
              }
              node._context = expression.arguments
              if (parent.type == 'Program') {
                  expression = {
                      type: 'Function',
                      expression: expression
                  }
              }
              parent._context.push(expression)
          }
      },
      CodeDomain: {
          enter(node,parent) {
              let expression = {
                  type: 'CodeDomain',
                  arguments: []
              }
              node._context = expression.arguments
              if (parent.type != 'CodeDomain') {
                  expression = {
                      type: 'Function',
                      expression: expression
                  }
              }
              parent._context.push(expression)
          }
      }
  })

  return newAst
}