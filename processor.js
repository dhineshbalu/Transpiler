function processor(ast) {
  let functionPack = []
  let functions =  findFunction(ast.body)
  for (let i=0;i<functions.length;i++) {
      let newBody = updateFunction(functions[i].body)
      let newArgs = updateArguments(functions[i].args)
      functions[i].body = newBody
      functions[i].args = newArgs
  }
  functionPack.push({
    type: 'Functions',
    body: functions
  });
  var TheBigAST = [];
  TheBigAST.push(functionPack);

  return TheBigAST;
}
function findFunction(ast) {
    let current = 0
    let found = []
    while(current < ast.length) {
        if (ast[current].type == 'Function') {
            if (ast[current].expression.hasOwnProperty('callee')) {
                if (ast[current+1].type == 'Function' && ast[current+1].expression.type == 'CodeDomain') {
                    if (current-2 >=0 && ast[current-1].type == 'Word' && ast[current-2].type == 'Word') {
                        //check it is main function
                        if (ast[current].expression.callee.name == 'main') {
                            found.push({
                                type: 'EntryPoint',
                                name: ast[current].expression.callee.name,
                                args: ast[current].expression.arguments,
                                body: ast[current+1].expression.arguments,
                                returnType: ast[current-2].value
                            })
                        } else {
                            found.push({
                                type: 'functionDefinition',
                                name: ast[current].expression.callee.name,
                                args: ast[current].expression.arguments,
                                body: ast[current+1].expression.arguments,
                                returnType: ast[current-2].value
                            })
                        }
                    }
                }
            }
        }
        current++
    }
    return found
}
function updateFunction(inside) {
   let statements = []
   let current = 0
   let start = 0
   while(current < inside.length) {
       let part = inside[current]
       // finding call back function
       if (part.type == 'CodeCave' && inside[current+1].type == 'Terminator' && inside[current-1].type == 'Word') {
           statements.push({
              type: 'Call',
              callee: part.callee.name,
              params: part.arguments
           })
           current++;
           continue;
       }
       // finding if , else if , for , while , do while , switch
       if (part.type == 'CodeDomain' && inside[current-1].type == 'CodeCave') {
           if (inside[current-2].type == 'Word') {
            if (inside[current - 2].value === 'if') {
                if((current - 3) >= 0){
                  if (inside[current - 3].type === 'Word') {
                    if (inside[current - 3].value === 'else') {
                      var inelseif = updateFunction(part.arguments);
                      statements.push({
                        type: 'else if',
                        condition: inside[current - 1].arguments,
                        body: inelseif
                      });
                      current++;
                      continue;
                    }
                  } else {
                    var inif = updateFunction(part.arguments);
                    statements.push({
                      type: 'if',
                      condition: inside[current - 1].arguments,
                      body: inif
                    });
                    current++;
                    continue;
                  }
                } else {
                  var inif = updateFunction(part.arguments);
                  statements.push({
                    type: 'if',
                    condition: inside[current - 1].arguments,
                    body: inif
                  });
                  current++;
                  continue;
                }
              } else if (inside[current-2].value == 'while') {
                   let whilebody = updateFunction(part.arguments)
                   statements.push({
                       type: 'while',
                       condition: inside[current-1].arguments,
                       body: whilebody
                   })
                   current++
                   continue
               } else if (inside[current-2].value == 'for') {
                let forbody = updateFunction(part.arguments)
                statements.push({
                    type: 'for',
                    condition: inside[current-1].arguments,
                    body: forbody
                })
                current++
                continue
            } else if (inside[current-2].value == 'switch') {
                var count = 0;
                var cases = [];
                var args = inside[current].arguments;
                args.reverse();
                var reverseCaseParts = [];
                while (count < args.length) {
                  if (args[count].type !== 'Colon') {
                      reverseCaseParts.push(args[count]);
                  } else {
                    var currentCaseType = args[count+1].type;
                    var currentCaseValue = args[count+1].value;
                    var currentStatementsGroup = reverseCaseParts.reverse();
                    if (args[count+1].value === 'default') {
                      count++;
                    } else if (args[count+2].value === 'case') {
                      count += 2;
                    }
                    reverseCaseParts = [];
                    var caseStatements = updateFunction(currentStatementsGroup);
                    cases.push({
                      caseType: currentCaseType,
                      caseValue: currentCaseValue,
                      caseStatements: caseStatements
                    });
                  }
                  count++;
                }
                statements.push({
                  type: 'switch',
                  condition: inside[current - 1].arguments,
                  body: cases.reverse()
                });
                current++;
                continue;
            }
           }
       } else if (part.type === 'CodeDomain' && inside[current - 1].value === 'else') {
        var inelse = updateFunction(part.arguments);
        statements.push({
          type: 'else',
          body: inelse
        });
        current++;
        continue;
      } else if (part.type === 'CodeDomain' && inside[current - 1].value === 'do') {
        if (inside[current + 1].type === 'Word' && inside[current + 1].value === 'while') {
          if (inside[current + 2].type === 'CodeCave') {
            var indo = updateFunction(part.arguments);
            statements.push({
              type: 'do',
              condition: inside[current + 2].arguments,
              body: indo
            });
            current++;
            continue;
          }
        } else {
          throw new Error('Invalid Syntax!');
        }
      }
      if (part.type == 'Terminator') {
          let phrase = []
          if (inside[current - 1].type === 'CodeCave' && inside[current - 2].value === 'while') {
            current++;
            continue
          }
          while (start <= current) {
            if (inside[start].type === 'Word') {
                if (inside[start].value === 'if' || inside[start].value === 'for' || inside[start].value === 'switch' || inside[start].value === 'while') {
                  start += 3;
                  continue;
                }
                if (inside[start + 1].type === 'CodeCave' && inside[start + 2].type === 'Terminator') {
                    start += 3
                    continue
                  }
                if (inside[start].value === 'do') {
                  start += 5;
                  continue;
                }
                if (inside[start].value === 'else' && inside[start+1].type === 'CodeDomain') {
                  start += 2;
                  continue;
                }
              }
              phrase.push({
                type: inside[start].type,
                value: inside[start].value
              });
              start++;
          }
          if (phrase.length) {
            statements.push({
                type: 'Statement',
                value: phrase
            });
          }
      }
      current++
      continue
   }
   return statements;
}
function updateArguments(cave) {
    var current = 0;
    var params = [];
    var last = 0;
    while (current < cave.length) {
      if (cave[current].type === 'Delimiter') {
        if ((current - last) === 2) {
          if (cave[current - 2].type === 'Word' && cave[current - 1].type === 'Word') {
            params.push({
              type: cave[current - 2].value,
              name: cave[current - 1].value
            });
            last += current;
          } else {
            throw new Error('Error in function definition: Invalid arguments!');
          }
        }
        current++;
        continue;
      }
      if (current === (cave.length - 1)) {
        if ((current - last) === 2) {
          if (cave[current - 1].type === 'Word' && cave[current].type === 'Word') {
            params.push({
              type: cave[current - 1].value,
              name: cave[current].value
            });
            last += current;
          } else {
            throw new Error('Error in function definition: Invalid arguments!');
          }
        }
        current++;
        continue;
      }
      current++;
    }
    return params;
}