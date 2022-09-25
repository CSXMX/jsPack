const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const {
    transformFromAst
} = require('@babel/core');
const {
    entry,
    output
} = require('./pack.config')

//第一步，根据绝对路径找到文件，得到依赖数组
function getDepArray(pathName) {
    const dependencies = []
    const content = fs.readFileSync(pathName, 'utf-8')
    console.log('content',content);
    const ast = parser.parse(content, {
        sourceType: "module"
    })
    traverse(ast, {
        ImportDeclaration: ({
            node
        }) => {
            dependencies.push(node.source.value)
        }
    })
    return {
        dependencies,
        code: transformFromAst(ast, null, {
            presets: ['@babel/preset-env'],
        }).code
    }
}
//第二步，创建根据入口的绝对路径，依赖关系图
function createGraph(entry) {
    const assert = getDepArray(entry);
    const graph = {
        [entry]: assert
    }
    /**
     * @fileName 文件路径名
     * @assert 对应的资源 { dendencies:['./1.js','./2.js'] }
     *
     **/
    const fn = (fileName, assert) => {
        assert.map = {} // key相对路径，value绝对路径
        assert.dependencies.map(item => {
            const pathName = path.join(path.dirname(fileName), item);
            //绝对路径
            assert.map[item] = pathName;
            if (!graph[pathName]) {
                const result = getDepArray(pathName);
                graph[pathName] = result;
                if (result.dependencies.length > 0) {
                    fn(pathName, result);
                }
            }
        })
    }
    for (let key in graph) {
        const value = graph[key];
        fn(key, value);
    }
    console.log('graph', graph)
    return graph;
}
//第三步，拼接打包文件
function bundle(graph) {
    let modules = ''
    for (let filename in graph) {
      let mod = graph[filename]
      modules += `'${filename}': [
        function(require, module, exports) {
          ${mod.code}
        },
        ${JSON.stringify(mod.map)},
      ],`
    }
  
  
    // 注意：modules 是一组 `key: value,`，所以我们将它放入 {} 中
    // 实现 立即执行函数
    // 首先实现一个 require 函数，require('${entry}') 执行入口文件，entry 为入口文件绝对路径，也为模块唯一标识符
    // require 函数接受一个 id（filename 绝对路径） 并在其中查找它模块我们之前构建的对象. 
    // 通过解构 const [fn, mapping] = modules[id] 来获得我们的函数包装器和 mappings 对象.
    // 由于一般情况下 require 都是 require 相对路径，而不是id（filename 绝对路径），所以 fn 函数需要将 require 相对路径转换成 require 绝对路径，即 localRequire
    // 注意：不同的模块 id（filename 绝对路径）时唯一的，但相对路径可能存在相同的情况
    // 
    // 将 module.exports 传入到 fn 中，将依赖模块内容暴露处理，当 require 某一依赖模块时，就可以直接通过 module.exports 将结果返回
    const result = `
      (function(modules) {
        function require(moduleId) {
          const [fn, map] = modules[moduleId]
          function localRequire(name) {
            return require(map[name])
          }
          const module = {exports: {}}
          fn(localRequire, module, module.exports)
          return module.exports
        }
        require('${entry}')
      })({${modules}})
    `
    return result
}
// console.log(bundle(createGraph(entry)))
fs.writeFile('dist/index.js',bundle(createGraph(entry)),err=>{
    console.log('err',err);
})