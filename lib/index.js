'use strict'

const gulp     = require('gulp')
const watch    = require('gulp-watch')
const path     = require('path')
const readline = require('readline')
const fs       = require('fs')
const rightpad = require('right-pad')
const clc      = require('cli-color')
const rimraf   = require('rimraf')

const files = []
let gitIgnore = true
let npmIgnore = true
let npmRoot
let packageName = ''
const exec = require('child_process').exec
const child = exec('npm root -g', function(error, stdout, stderr) {
  npmRoot = path.join(stdout.replace('\n', ''), packageName)
  log('INSTALL', 'Copy to ' + npmRoot, 'WARN')
  reinstall(() => {
    log('INSTALL', 'done... file watcher is now active, happy developing!', 'OK')
    log('minimatch', 'Watching: ' + path.join(process.cwd(), '**/*'), 'OK')
    if (!gitIgnore && !npmIgnore)
      log('minimatch', 'no .gitignore or .npmignore was found, You are file watching node_modules which can have a negative impact on performance', 'WARN')
    watch(files, {debounceDelay: 200}, (file) => {
      if (file.event == 'change') {
        hotreload(() => {
          log('HOT CHANGE', file.path.split(process.cwd())[1].replace(path.sep, '') , 'OK')
        }, file.path)
      }

      if (file.event == 'add') {
        hotreload(() => {
          log('HOT ADD', file.path.split(process.cwd())[1].replace(path.sep, '') , 'OK')
        }, file.path)
      }

      if (file.event == 'unlink') {
        rm(() => {
          log('HOT REMOVE', file.path.split(process.cwd())[1].replace(path.sep, '') , 'OK')
        }, path.join(npmRoot, file.path.split(process.cwd())[1].replace(path.sep, '')))
      }
    })
  })
})

const rm = (cb, deleteThis) => {
  rimraf(deleteThis, cb)
}

const reinstall = cb => {
  gulp.src([process.cwd() + '/**/*'])
  .pipe(gulp.dest(npmRoot))
  .on('end', cb)
}

const hotreload = (cb, hotreload) => {
  const fullPath = path.join(npmRoot, hotreload.split(process.cwd())[1].replace(path.sep, ''))
  const dest     = fullPath.replace(path.win32.basename(fullPath), '')
  const source   = hotreload.split(process.cwd())[1].replace(path.sep, '')

  gulp.src(source)
  .pipe(gulp.dest(dest))
  .on('end', cb)
}

const log = (item, message, type) => {
  item = item.toUpperCase()
  message = capitalizeFirstLetter(message)
  if (!type)
    item = clc.bold(item)
  if (type == 'FAIL')
    item = clc.red(item)
  if (type == 'OK')
    item = clc.green(item)
  if (type == 'WARN')
    item = clc.yellow(item)

  console.log(rightpad(item, 22) + message)
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const init = () => {
  log('INIT', 'Please wait... initializing.', 'WARN')

  files.push('!' + path.win32.basename(__filename))
  files.push(path.join(process.cwd(), '**/*'))
  files.push('!.git')
  files.push('!.git/**/*')

  try {
    fs.accessSync('.gitignore', fs.F_OK)
    readline.createInterface({
      input: fs.createReadStream('.gitignore'),
      terminal: false,
    }).on('line', function(line) {
      files.push('!' + line)
      log('minimatch', rightpad('Ignoring: ' + line, 40) + '( .gitignore )', 'OK')
    })
  } catch (e) {
    log('ignore', 'no .gitignore found for minimatch ignoring', 'WARN')
    gitIgnore = false
  }

  try {
    fs.accessSync('.npmignore', fs.F_OK)
    readline.createInterface({
      input: fs.createReadStream('.npmignore'),
      terminal: false,
    }).on('line', function(line) {
      files.push('!' + line)
      log('minimatch', rightpad('Ignoring: ' + line, 40) + '( .npmignore )', 'OK')
    })
  } catch (e) {
    log('ignore', 'no .npmignore found for minimatch ignoring', 'WARN')
    npmIgnore = false
  }

  try {
    const jsonPackage = require('package.json')
    packageName = jsonPackage.name
  } catch (e) {
    log('name', 'no package.json found, using folder name as package name!', 'WARN')
    packageName = process.cwd().split(path.sep)[process.cwd().split(path.sep).length - 1]
    gitIgnore = false
  }
}

init()
