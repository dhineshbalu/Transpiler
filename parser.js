let current = 0
function walk() {
    // >= or >
   if (tokens[current].type == 'greater') {
       if (tokens[current+1] && tokens[current+1].type == 'equal') {
           current += 2
           return {
               type: 'GreaterE',
               value: '>='
           }
       } else {
           current++
           return {
               type: 'Greater',
               value: '>'
           }
       } 
   }
   // < or <=
   if (tokens[current].type == 'less') {
       if (tokens[current+1] && tokens[current+1].type == 'equal') {
           current += 2
           return {
               type: 'LessE',
               value: '<='
           }
       } else {
           current++
           return {
               type: 'Less',
               value: '<'
           }
       }
   }
   // == or =
   if (tokens[current].type == 'equal') {
       if (tokens[current+1] && tokens[current+1].type == 'equal') {
           current += 2
           return {
               type: 'EqualE',
               value: '=='
           }
       } else {
           current++
           return {
               type: 'Equal',
               value: '='
           }
       }
   }
   // != or !
   if (tokens[current].type == 'not') {
        if (tokens[current+1] && tokens[current+1].type == 'equal') {
            current += 2
            return {
                type: 'NotE',
                value: '!='
            }
        } else {
            current++
            return {
                type: 'Not',
                value: '!'
            }
        }
    }
    // += or +
    if (tokens[current].type == 'plus') {
        if (tokens[current+1] && tokens[current+1].type == 'equal') {
            current += 2
            return {
                type: 'PlusE',
                value: '+='
            }
        } else if (tokens[current+1] && tokens[current+1].type == 'plus') {
            current += 2
            return {
                type: 'PlusPlus',
                value: '++'
            }
        } else {
            current++
            return {
                type: 'Plus',
                value: '+'
            }
        }
    }
    // -= or -
    if (tokens[current].type == 'minus') {
        if (tokens[current+1] && tokens[current+1].type == 'equal') {
            current += 2
            return {
                type: 'MinusE',
                value: '-='
            }
        } else  if (tokens[current+1] && tokens[current+1].type == 'minus') {
            current += 2
            return {
                type: 'MinusMinus',
                value: '--'
            }
        }  else {
            current++
            return {
                type: 'Plus',
                value: '-'
            }
        }
    }
    // /= or /
    if (tokens[current].type == 'divide') {
        if (tokens[current+1] && tokens[current+1].type == 'equal') {
            current += 2
            return {
                type: 'DivideE',
                value: '/='
            }
        } else {
            current++
            return {
                type: 'Divide',
                value: '/'
            }
        }
    }
    // *= or *
    if (tokens[current].type == 'star') {
        if (tokens[current+1] && tokens[current+1].type == 'equal') {
            current += 2
            return {
                type: 'StarE',
                value: '*='
            }
        } else {
            current++
            return {
                type: 'Star',
                value: '*'
            }
        }
    }
    // || or |
    if (tokens[current].type == 'pipe') {
        if (tokens[current+1] && tokens[current+1].type == 'pipe') {
            current += 2
            return {
                type: 'OrOr',
                value: '||'
            }
        } else {
            current++
            return {
                type: 'Pipe',
                value: '|'
            }
        }
    }   
    // && or &
    if (tokens[current].type == 'and') {
        if (tokens[current+1] && tokens[current+1].type == 'and') {
            current += 2
            return {
                type: 'AndAnd',
                value: '&&'
            }
        } else {
            current++
            return {
                type: 'And',
                value: '&'
            }
        }
    } 
    // [1,2,3]
    if (tokens[current].type == 'bracket' && tokens[current].value == '[') {
        current++
        let node = {
            type: 'Array',
            args: []
        }
        while (current < tokens.length && tokens[current].value != ']') {
            node.args.push(walk())
        }
        current++
        return node
    }
    // { .... .... }
    if (tokens[current].type == 'curly') {
        current++
        let node = {
            type: 'CodeDomain',
            args:[]
        }
        while(current < tokens.length &&  tokens[current].value != '}') {
            node.args.push(walk())
        }
        current++
        return node
    }
    // callee function
    if (tokens[current].type == 'paren' && tokens[current].value == '(') {
        let node 
        let prevToken = tokens[current-1]
        current++
        if (current-2 >=0 &&  typeof prevToken != "undefined" &&  prevToken.type == 'name') {
            node = {
                type: 'CodeCave',
                name: prevToken.value,
                args: []
            }
        } else {
            node = {
                type: 'CodeCave',
                args: []
            }
        }
        while(current < tokens.length && tokens[current].value != ')') {
            node.args.push(walk())
        }
        current++
        return node
    } 
    if (tokens[current].type == 'name') {
        current++
        return {
           type: 'Word',
           value: tokens[current-1].value
        }
    }
    if (tokens[current].type == 'question') {
        current++
        return {
            type: 'Question',
            value: tokens[current-1].value
        }
    }
   if (tokens[current].type == 'comma') {
       current++
       return {
           type: 'Delimiter',
           value: ','
       }
   }
   if (tokens[current].type == 'dot') {
     current++
     return {
         type: 'Dot',
         value: '.'
     }
   }
   if (tokens[current].type == 'terminator') {
       current++
       return {
           type: 'Terminator',
           value: ';'
       }
   }
   if (tokens[current].type == 'colon') {
       current++
       return {
           type: 'Colon',
           value: ';'
       }
   }
   if (tokens[current].type == 'number') {
       current++
       return {
           type: 'NumberLiteral',
           value: tokens[current-1].value
       }
   }
   if (tokens[current].type == 'string') {
       current++
       return {
           type: 'StringLiteral',
           value: tokens[current-1].value
       }
   }
}
function parser(tokens) {
   let ast = {
       type: 'Program',
       body: []
   }
   while(current < tokens.length) {
       ast.body.push(walk())
   }
   return ast
}
