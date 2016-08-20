[![](https://nodei.co/npm/global-module-reload.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/global-module-reload)

[![](https://david-dm.org/michaeldegroot/global-module-reload.svg "deps") ](https://david-dm.org/michaeldegroot/global-module-reload "david-dm")
![](https://img.shields.io/badge/Node-%3E%3D0.11-green.svg)
![](https://img.shields.io/npm/dt/global-module-reload.svg)
![](https://img.shields.io/npm/l/express.svg)

___

# Global Module Reload

Improve your development speed while developing npm modules
that are installed normally via `npm install -g`

## *Consider the following workflow*

-   You have your npm root folder where your global module is installed with `npm install -g`
-   You have your source folder where your project source files are located, this is where you develop in
-   Every time you make a change to your source files you have to `npm install -g` or copy the changed files to the npm root folder
-   Now you can test your changes by executing your global command from the CLI

**This is very time consuming and can be reduced by 95% with this module!**

## *Global module reload workflow*
-   You execute the `globalreload` command in your CLI where your root folder of your project source is.
-   First the script copies all your source files to your global npm root folder, so your source files are in sync.
-   A filewatcher is initialized and automaticlly ignoring everything that has been put in your .gitignore and .npmignore files
-   You let the script do his thing and just develop away in your source files. The filewatcher will check for changes including added and deleted files and makes sure everything stays in sync.

![preview](http://i.imgur.com/RkSckKt.png "Preview")

___

## How to use it

### 1. Install

    npm install global-module-reload -g

### 2. Do awesome stuff

    globalreload

*Remember to execute the command in the*
*root folder of your source files **NOT** the npm global modules folder*

___

### Roadmap

-   Folder removal
-   Folder watcher

___

### Contact  

You can contact me at specamps@gmail.com
