const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const {
    transformFromAstSync
} = require('@babel/core');

const {
    entry,
} = require('./pack.config')

//第一步，根据绝对路径找到文件，得到依赖数组
function getDepArray(pathName) {
    const dependencies = []
    const content = fs.readFileSync(pathName, 'utf-8')
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
        code: transformFromAstSync(ast, null, {
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
    for (let key in graph) {
        let {
            code,
            map
        } = graph[key]
        modules += `'${key}': [
        function(require, module, exports) {
          ${code}
        },
        ${JSON.stringify(map)},
      ],`
    }
    const result = `
      (function(modules) {
        function require(moduleId) {
          const [fn, map] = modules[moduleId]
          const module = {exports: {}}
          fn((name)=>require(map[name]), module, module.exports)
          return module.exports
        }
        require('${entry}')
      })({${modules}})
    `
    return result
}
fs.writeFile('dist/index.js', bundle(createGraph(entry)), err => {
    console.log('err', err);
})