let tokens = []

function isDigit(char) {
  if (char >= '0' && char <='9') 
      return true
   else 
      return false
}
function isWhiteSpace(char) {
    if (char ==' ') 
       return true
    else 
       return false
}
function isChar(char) {
    if ((char >= 'a' && char <='z') || (char >= 'A' && char <= 'Z')) 
       return true
    else 
       return false
}
function tokenizer(input) {
   let currentIndex = 0
   let current 
   while(currentIndex<input.length) { 
       current = input[currentIndex]

      // finding whitespace
       if (isWhiteSpace(current)) {
           currentIndex++
           continue
       }
       // find Number
       if (isDigit(current)) {
           let str = current
           currentIndex++
           while (currentIndex < input.length && isDigit(input[currentIndex])) {
              str += input[currentIndex]
              currentIndex++
           }
           tokens.push({
               type: 'number',
               value: str
           })
           continue
       }
       //find strings with single quote
       if (current == '\'') {
           let str = ''
           currentIndex++
           while (currentIndex < input.length && input[currentIndex] != '\'') {
               str += input[currentIndex]
               currentIndex++
           }
           currentIndex++
           tokens.push({
               type: 'string',
               value: str
           })
           continue
       }
       //find strings with double quote
       if (current == '"') {
           let str = ''
           currentIndex++
           while (currentIndex < input.length && input[currentIndex] != '"') {
               str += input[currentIndex]
               currentIndex++
           }
           currentIndex++
           tokens.push({
               type: 'string',
               value: str
           })
           continue
       }
       // find variable name
       if (isChar(current) || current == '_') {
           let str = current
           currentIndex++
           while(currentIndex < input.length && (isChar(input[currentIndex]) || isDigit(input[currentIndex]) || input[currentIndex] == '_')) {
             str += input[currentIndex]
             currentIndex++
           }
           tokens.push({
               type: 'name',
               value: str
           })
           continue
       }
       if (current == '(' || current == ')') {
           tokens.push({
               type: 'paren',
               value: current
           })
           currentIndex++
           continue
       }
       if (current == '[' || current == ']') {
            tokens.push({
                type: 'bracket',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '{' || current == '}') {
            tokens.push({
                type: 'curly',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '>') {
            tokens.push({
                type: 'greater',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '<') {
            tokens.push({
                type: 'less',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '=') {
            tokens.push({
                type: 'equal',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '!') {
            tokens.push({
                type: 'not',
                value: '!'
            })
            currentIndex++
            continue
        }
        if (current == '&') {
            tokens.push({
                type: 'and',
                value: '&'
            })
            currentIndex++
            continue
        }
        if (current == '|') {
            tokens.push({
                type: 'pipe',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '+') {
            tokens.push({
                type: 'plus',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '-') {
            tokens.push({
                type: 'minus',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '*') {
            tokens.push({
                type: 'star',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '/') {
            tokens.push({
               type: 'divide',
               value: current  
            })
            currentIndex++
            continue
        }
        if (current == '^') {
            tokens.push({
                type: 'carrot',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '$') {
            tokens.push({
                type: 'dollar',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '@') {
            tokens.push({
                type: 'at',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '%') {
            tokens.push({
                type: 'percent',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == ';') {
            tokens.push({
                type: 'terminator',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == ':') {
            tokens.push({
                type: 'colon',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '?') {
            tokens.push({
                type: 'question',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == '.') {
            tokens.push({
                type: 'dot',
                value: current
            })
            currentIndex++
            continue
        }
        if (current == ',') {
            tokens.push({
                type: 'comma',
                value: current
            })
            currentIndex++
            continue
        }
      throw new Error('unrecognized token ' + current)
   }
   return tokens
}