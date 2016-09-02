/*
 * Copyright (C) 2016 Alasdair Mercer, Skelp
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = function(grunt) {
  var babel = require('rollup-plugin-babel')
  var nodeResolve = require('rollup-plugin-node-resolve')
  var uglify = require('rollup-plugin-uglify')

  var bannerLarge = [
    '/*',
    ' * Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, Skelp',
    ' *',
    ' * Permission is hereby granted, free of charge, to any person obtaining a copy',
    ' * of this software and associated documentation files (the "Software"), to deal',
    ' * in the Software without restriction, including without limitation the rights',
    ' * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell',
    ' * copies of the Software, and to permit persons to whom the Software is',
    ' * furnished to do so, subject to the following conditions:',
    ' *',
    ' * The above copyright notice and this permission notice shall be included in all',
    ' * copies or substantial portions of the Software.',
    ' *',
    ' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR',
    ' * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,',
    ' * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE',
    ' * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER',
    ' * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,',
    ' * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE',
    ' * SOFTWARE.',
    ' */'
  ].join('\n')
  var bannerSmall = '/*! Europa v<%= pkg.version %> | (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>, Skelp | <%= pkg.license %> License */'

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: [ 'dist' ]
    },

    eslint: {
      target: [ 'src/**/*.js' ]
    },

    rollup: {
      development: {
        options: {
          format: 'umd',
          moduleId: 'europa',
          moduleName: 'europa',
          sourceMap: true,
          sourceMapRelativePaths: true,
          banner: bannerLarge,
          plugins: function() {
            return [
              babel({
                exclude: './node_modules/**'
              }),
              nodeResolve({
                main: true,
                jsnext: true
              })
            ]
          }
        },
        files: {
          'dist/umd/europa.js': 'src/index.js'
        }
      },
      production: {
        options: {
          format: 'umd',
          moduleId: 'europa',
          moduleName: 'europa',
          sourceMap: true,
          sourceMapRelativePaths: true,
          banner: bannerSmall,
          plugins: function() {
            return [
              babel({
                exclude: './node_modules/**'
              }),
              nodeResolve({
                browser: true,
                jsnext: true
              }),
              uglify({
                output: {
                  comments: function(node, comment) {
                    return comment.type === 'comment2' && /^!/.test(comment.value)
                  }
                }
              })
            ]
          }
        },
        files: {
          'dist/umd/europa.min.js': 'src/index.js'
        }
      }
    },

    watch: {
      all: {
        files: [ 'src/**/*.js' ],
        tasks: [ 'build' ]
      }
    }
  })

  require('load-grunt-tasks')(grunt)

  grunt.registerTask('default', [ 'build' ])
  grunt.registerTask('build', [ 'eslint', 'clean', 'rollup' ])
  grunt.registerTask('test', [ 'eslint' ])
}