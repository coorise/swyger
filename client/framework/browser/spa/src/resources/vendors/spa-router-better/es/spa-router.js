var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function extend() {
  var obj = {};
  var srcList = Array.prototype.slice.call(arguments, 0);
  for (var i = 0, len = srcList.length; i < len; ++i) {
    var src = srcList[i];
    for (var q in src) {
      if (src.hasOwnProperty(q)) {
        obj[q] = src[q];
      }
    }
  }
  return obj;
}

// 判断是否 thenable 对象
function isThenable(obj) {
  return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && typeof obj['then'] === 'function';
}



function addEvent(name, handler) {
  if (window.addEventListener) {
    window.addEventListener(name, handler, false);
  } else if (window.attachEvent) {
    window.attachEvent('on' + name, handler);
  } else {
    window['on' + name] = handler;
  }
}

function warn(message) {
  if (typeof console !== 'undefined') {
    console.warn('[spa-router] ' + message);
  }
}



var isArray = Array.isArray ? Array.isArray : function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

function makeSureArray(obj) {
  return isArray(obj) ? obj : obj ? [obj] : [];
}

function ArrayCopy(arr) {
  return arr.slice(0);
}

function formatHashBangURI(path) {
  var raw = path.replace(/^#!?/, '');
  // always
  if (raw.charAt(0) !== '/') {
    raw = '/' + raw;
  }
  return '/#!' + raw;
}

var historySupport = function () {
  var ua = window.navigator.userAgent;
  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
    return false;
  }
  return window.history && 'pushState' in window.history;
}();

var MODE = {
  HASH: 1,
  HASHBANG: 1,
  HISTORY: 2
};

var RouteMode = MODE.HASHBANG;

var _init = false;

/// Listener
var Listener = {
  listeners: [],

  setUrlOnly: false,

  supportHistory: function supportHistory() {
    return historySupport;
  },
  setMode: function setMode(mode) {
    mode = String(mode).toUpperCase();
    RouteMode = MODE[mode] || MODE.HASHBANG;
  },
  init: function init() {
    if (_init) {
      return this;
    }
    _init = true;
    if (RouteMode === MODE.HISTORY) {
      // IE 10+
      if (historySupport) {
        addEvent('popstate', onchange);
      } else {
        RouteMode = MODE.HASHBANG;
        // warning
        warn('你的浏览器不支持 History API ，只能使用 hashbang 模式');
        addEvent('hashchange', onchange);
      }
    } else {
      addEvent('hashchange', onchange);
    }
    return this;
  },
  add: function add(fn) {
    this.listeners.push(fn);
    return this;
  },
  remove: function remove(id) {
    for (var i = 0; i < this.listeners.length; ++i) {
      if (this.listeners[i].id === id) {
        this.listeners.splice(i, 1);
        break;
      }
    }
    return this;
  },
  setHashHistory: function setHashHistory(targetURL) {
    if (RouteMode === MODE.HISTORY) {
      history.pushState({}, '', targetURL);
    } else {
      if (targetURL[0] === '/') {
        location.hash = '!' + targetURL;
      } else {
        var currentURL = location.hash.replace(/^#!?/, ''); // 去掉前面的 #!
        var queryStringIndex = currentURL.indexOf('?');
        if (queryStringIndex !== -1) {
          currentURL = currentURL.slice(0, queryStringIndex);
        }
        if (/.*\/$/.test(currentURL)) {
          location.hash = '!' + currentURL + targetURL;
        } else {
          var hash = currentURL.replace(/([^\/]+|)$/, function ($1) {
            return $1 === '' ? '/' + targetURL : targetURL;
          });
          location.hash = '!' + hash;
        }
      }
    }
    return this;
  },
  stop: function stop() {
    // remove event listener
  }
};

function onchange(onChangeEvent) {
  if (Listener.setUrlOnly) {
    Listener.setUrlOnly = false;
    return false;
  }
  var listeners = Listener.listeners;
  for (var i = 0, l = listeners.length; i < l; i++) {
    listeners[i].handler.call(null, onChangeEvent);
  }
}

var encode = encodeURIComponent;
var decode = decodeURIComponent;

var QS = {
  /**
   * querystring.stringify
   * @param { Object } obj
   * @param { Boolean } traditional [default:false]
   * @return { String }
   *
   * traditional is true:  {x: [1, 2]} => 'x=1&x=2'
   * traditional is false: {x: [1, 2]} => 'x[]=1&x[]=2'
   */
  stringify: function stringify(obj, traditional) {
    if (!obj) {
      return '';
    }
    var appendString = traditional ? '' : '[]';
    var keysArray = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        keysArray.push(p);
      }
    }
    var names = keysArray.sort();

    var parts = [];
    for (var i = 0; i < names.length; ++i) {
      var name = names[i];
      var value = obj[name];

      if (isArray(value)) {
        value.sort();
        var _parts = [];
        for (var j = 0; j < value.length; ++j) {
          _parts.push('' + encode(name).replace(/%20/g, '+') + appendString + '=' + encode(value[j]).replace(/%20/g, '+'));
        }
        parts.push(_parts.join('&'));
        continue;
      }
      parts.push(encode(name).replace(/%20/g, '+') + '=' + encode(value).replace(/%20/g, '+'));
    }
    return parts.join('&');
  },


  /**
   * querystring.parse
   * @param { String } queryString
   * @return { Object }
   *
   * 'x=1&y=2' => {x: 1, y: 2}
   * 'x=1&x=2' => {x: [1, 2]}
   */
  parse: function parse(queryString) {
    if (typeof queryString !== 'string') {
      return {};
    }

    queryString = queryString.trim().replace(/^(\?|#)/, '');

    if (queryString === '') {
      return {};
    }

    var queryParts = queryString.split('&');

    var query = {};

    for (var i = 0; i < queryParts.length; ++i) {
      var parts = queryParts[i].replace(/\+/g, '%20').split('='); // 特殊字符`+`转换为空格
      var name = decode(parts[0]),
          value = parts[1] === undefined ? null : decode(parts[1]);

      if (!query.hasOwnProperty(name)) {
        query[name] = value;
      } else if (isArray(query[name])) {
        query[name].push(value);
      } else {
        query[name] = [query[name], value];
      }
    }
    return query;
  }
};

function RNode(value) {
  this.path = value;
  this.params = false;
  this.title = false;
  this.data = null;
  this._hooks = {};
  this.children = [];
  this.parent = null;
  this._registered = false;
  this._forward = false;
  this._redirect = null; // 重定向
}

var proto$1 = RNode.prototype;

function afterThen(thenable, restList, context, params) {
  return thenable.then(function () {
    return callThenableList(restList, context, params);
  });
}

function callThenableList(callbacks, context, params) {
  var currentReturn = void 0;
  for (var i = 0; i < callbacks.length; ++i) {
    currentReturn = callbacks[i].apply(context, params);
    if (isThenable(currentReturn)) {
      return afterThen(currentReturn, callbacks.slice(i + 1), context, params);
    } else if (currentReturn === false) {
      break;
    }
  }
  return currentReturn;
}

// 如果返回 thenable 对象，则后面的回调要等到当前异步操作完成再执行，如果异步操作失败，则后面的回调不执行
// 如果返回 false 则后面的回调不执行
proto$1.callHooks = function _callHooks(hookName, Req) {
  var callbacks = this._hooks[hookName] || [];
  var _copyCallbacks = ArrayCopy(callbacks); // 复制一个，避免中间调用了 off 导致 length 变化
  callThenableList(_copyCallbacks, null, [Req]);
  return this;
};

proto$1.addHooks = function addHooks(hookName, callbacks) {
  this._hooks[hookName] = makeSureArray(callbacks);
  return this;
};

// add children
proto$1.addChildren = function addChildren(children) {
  if (isArray(children)) {
    this.children = this.children.concat(children);
  } else {
    this.children.push(children);
  }
  return this;
};

proto$1.removeChild = function removeChild(child) {
  for (var i = 0; i < this.children.length; ++i) {
    if (this.children[i] === child) {
      this.children.splice(i, 1);
      break;
    }
  }
  return this;
};

function createRNode(value) {
  return new RNode(value);
}

function findNode(routeTreeRoot, routePath, createIfNotFound) {
  if (routePath === '') {
    // 当前节点
    return routeTreeRoot;
  }
  var parts = routePath.split('/');
  var target = null,
      found = false;
  var parent = routeTreeRoot;
  var params = void 0;

  var _loop = function _loop(i, len) {
    params = false;
    var realCurrentValue = parts[i];

    var matcher = /:([a-zA-Z_][a-zA-Z0-9_]*)(\([^\)]+\))?/g;

    var k = 0;

    function replacement($1, $2, $3) {
      params = params || [];
      params[k++] = $2;
      if (!$3) {
        // In IE 8 , $3 is an empty String while in other browser it is undefined.
        return '([a-zA-Z0-9_]+)';
      } else {
        return $3;
      }
    }

    realCurrentValue = realCurrentValue.replace(matcher, replacement);

    for (var j = 0; j < parent.children.length; ++j) {
      if (parent.children[j].path === realCurrentValue) {
        target = parent.children[j];
        found = true;
        break;
      }
    }
    if (!found) {
      // 不存在
      if (!createIfNotFound) return {
          v: false
        };
      // 创建新节点
      var extendNode = createRNode(realCurrentValue);
      parent.addChildren(extendNode);
      extendNode.parent = parent;
      extendNode.params = params;
      target = extendNode;
    }
    parent = target;
    found = false;
  };

  for (var i = 0, len = parts.length; i < len; ++i) {
    var _ret = _loop(i, len);

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
  return target;
}

function createRouteNodeInPath(rootNode, routePath) {
  routePath = routePath.replace(/^\/([^\/]*)/, '$1'); // 去掉前置 /
  if (routePath === '*') {
    var rnode = createRNode('');
    rnode.parent = rootNode;
    rootNode.addChildren(rnode);
    return rnode;
  } else {
    return findNode(rootNode, routePath, true);
  }
}

// 构造路由树
function createRouteTree(namedRoutes, routeNode, routeOptions) {
  if (routeOptions.name) {
    if (namedRoutes[routeOptions.name]) {
      warn('\u5DF2\u7ECF\u5B58\u5728\u7684\u5177\u540D\u8DEF\u7531 ' + routeOptions.name + ' \u5C06\u88AB\u8986\u76D6');
    }
    namedRoutes[routeOptions.name] = routeNode;
  }
  if (routeOptions.data) {
    routeNode.data = routeOptions.data;
  }
  if (routeOptions.title) {
    routeNode.title = routeOptions.title;
  }
  if (routeOptions.redirect) {
    routeNode._redirect = routeOptions.redirect;
  }
  if (routeOptions.forward) {
    routeNode._forward = true;
  }
  routeNode.addHooks('beforeEnter', routeOptions.beforeEnter);
  routeNode.addHooks('callbacks', routeOptions.controllers);
  routeNode.addHooks('beforeLeave', routeOptions.beforeLeave);
  if (routeOptions.sub) {
    // 子路由
    for (var subRoutePath in routeOptions.sub) {
      if (routeOptions.sub.hasOwnProperty(subRoutePath)) {
        var subRouteNode = createRouteNodeInPath(routeNode, subRoutePath);
        subRouteNode._registered = true;
        createRouteTree(namedRoutes, subRouteNode, routeOptions.sub[subRoutePath]);
      }
    }
  }
}

// 创建根结点
function createRootRouteTree(namedRoutes, routes) {
  var rootRouteNode = createRNode('');
  createRouteTree(namedRoutes, rootRouteNode, {
    sub: routes
  });
  return rootRouteNode;
}

// 计算一个节点在一棵树的层次
function calcRNodeDepth(currentRouteNode) {
  var depth = 0;
  var rnode = currentRouteNode;
  while (rnode) {
    depth++;
    rnode = rnode.parent;
  }
  return depth;
}

/**
 * dfs 找匹配的路由节点
 * @param {RNode} currentRouteNode 当前节点
 * @param {Array} parts 路径分段数组
 * */
// @TODO pages 很长并且打开 devtools 的时候会变慢？
function dfs(currentRouteNode, parts) {
  var currentPathValue = parts[0];
  var matcher = new RegExp('^' + currentRouteNode.path + '$');
  var matches = currentPathValue.match(matcher);
  if (!matches) {
    // 当前节点不匹配，返回
    // 如果当前节点是 * 节点，则可能在找不到的时候返回这个节点
    if (currentRouteNode.path === '') {
      return {
        rnode: currentRouteNode,
        params: {},
        notFound: true
      };
    }
    return false;
  }
  var currentParams = {};
  if (currentRouteNode.params) {
    var paramsMatches = Array.prototype.slice.call(matches, 1);
    for (var _k = 0; _k < paramsMatches.length; ++_k) {
      currentParams[currentRouteNode.params[_k]] = paramsMatches[_k];
    }
  }
  if (parts.length === 1) {
    // 在当前节点完成匹配
    if (!currentRouteNode._registered) {
      // 不是注册节点
      return false;
    }
    return {
      rnode: currentRouteNode,
      params: currentParams
    };
  }
  var notFoundList = [];
  for (var i = 0; i < currentRouteNode.children.length; ++i) {
    var _result = dfs(currentRouteNode.children[i], parts.slice(1));
    if (_result && !_result.notFound) {
      // 在子树中完成匹配
      // 合并 params
      for (var p in _result.params) {
        if (_result.params.hasOwnProperty(p)) {
          currentParams[p] = _result.params[p];
        }
      }
      return {
        rnode: _result.rnode,
        params: currentParams
      };
    }
    if (_result.notFound) {
      // 合并 currentParams
      for (var _p in currentParams) {
        if (currentParams.hasOwnProperty(_p)) {
          _result.params[_p] = currentParams[_p];
        }
      }
      notFoundList.push(_result);
    }
  }
  // 全部路径都走完，找不到匹配项
  // 如果有 * 节点匹配，则返回匹配路径最长的 * 节点
  if (notFoundList.length > 0) {
    var max = -1,
        maxIndex = -1;
    for (var _i = 0; _i < notFoundList.length; ++_i) {
      var depth = calcRNodeDepth(notFoundList[_i].rnode);
      if (depth > max) {
        max = depth;
        maxIndex = _i;
      }
    }
    return notFoundList[maxIndex];
  }
  return false;
}

/**
 * 搜索路由树，看是否存在匹配的路径，如果存在，返回相应的回调函数
 * @todo 只返回第一个匹配到的路由（如果存在多个匹配？）
 * @param {RNode} tree 树根
 * @param {String} path 要匹配的路径
 * 返回值包含两个，用数组表示[rnode, params]
 * @return {Function|Array|null} 如果存在就返回相应的回调，否则返回null
 * @return {[Array, Object]} 同时返回回调和参数
 *
 * */


function searchRouteTree2(tree, path) {
  path = path === '/' ? '' : path; // 如果是 / 路径，特殊处理（避免 split 之后多一项）

  var result = dfs(tree, path.split('/'));

  if (result && result.rnode) {
    var forwardList = []; // 找到匹配路径上的全部节点
    var node = result.rnode;
    while (node.parent) {
      if (node.parent._registered && node.parent._forward) {
        forwardList.unshift(node.parent);
      }
      node = node.parent;
    }
    result.forwardList = forwardList;
  }

  return result;
}

var lastReq = null;
var lastRouteNode = null;

function handlerHashbangMode(onChangeEvent) {
  var newURL = onChangeEvent && onChangeEvent.newURL || location.hash;
  var url = newURL.replace(/.*#!/, '');
  this.dispatch(url.charAt(0) === '/' ? url : '/' + url);
}

function handlerHistoryMode(onChangeEvent) {
  var url = location.pathname + location.search + location.hash;
  this.dispatch(url.charAt(0) === '/' ? url : '/' + url);
}

function start() {
  if (this._isRunning) {
    // start 只调用一次
    warn('start 方法只能调用一次');
    return this;
  }
  this._isRunning = true;
  var _handler = this.options.mode === 'history' ? handlerHistoryMode : handlerHashbangMode;
  var _this = this;
  Listener.init().add({
    id: this._uid,
    handler: function handler() {
      return _handler.call(_this);
    }
  });
  if (this.options.mode !== 'history' && !/^#!\//.test(location.hash)) {
    var i = location.href.indexOf('#');
    var url = location.hash.replace(/^#!?/, '');
    location.replace(location.href.slice(0, i >= 0 ? i : 0) + '#!/' + url.replace(/^\//, ''));
  } else {
    // 首次触发
    _handler.call(this);
  }
  return this;
}

function stop() {
  Listener.remove(this._uid);
  this._isRunning = false;
  return this;
}

function destroy() {
  this.stop();
  this._namedRoutes = null;
  this._rtree = null;
  this._hooks = null;
  this.options = null;
  return null;
}

// 动态添加新路由（可能会替换原有的路由）
function mount(routePath, routes) {
  routePath = routePath.replace(/^\/([^\/]*)/, '$1'); // 去掉前置 /
  var currentRouteNode = findNode(this._rtree, routePath, true);
  createRouteTree(this._namedRoutes, currentRouteNode, routes);
  return this;
}

// 路由描述对象转换为路径
// 如果缺少参数，会抛出错误
function routeDescObjToPath(namedRoutes, routeDescObj) {
  var routeNode = namedRoutes[routeDescObj.name];
  if (!routeNode) {
    return null;
  }
  var paths = [];
  var rnode = routeNode;
  while (rnode) {
    var pathvalue = rnode.path;
    if (rnode.params) {
      (function () {
        if (!routeDescObj.params) {
          throw new Error('缺少参数');
        }
        var paramsIndex = 0;
        pathvalue = pathvalue.replace(/\([^\)]+\)/g, function ($1) {
          var paramKey = rnode.params[paramsIndex++];
          if (!routeDescObj.params.hasOwnProperty(paramKey)) {
            throw new Error('\u7F3A\u5C11\u53C2\u6570 "' + paramKey + '"');
          }
          return routeDescObj.params[paramKey];
        });
      })();
    }
    paths.unshift(pathvalue);
    rnode = rnode.parent;
  }
  var query = '';
  if (routeDescObj.query) {
    query += '?' + QS.stringify(routeDescObj.query, routeDescObj.traditional);
  }
  return paths.join('/') + query;
}

// 根据给定的路径，遍历路由树，只要找到一个匹配的就把路由返回
function dispatch(path) {
  if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path !== null) {
    // {name: 'routeName', params: {}}
    path = routeDescObjToPath(this._namedRoutes, path);
  }
  if (lastReq) {
    this._callHooks('beforeEachLeave', lastReq);
    if (lastRouteNode) {
      lastRouteNode.callHooks('beforeLeave', lastReq);
    }
  }
  var routeTree = this._rtree;
  // 保存原始请求uri
  var uri = path;
  var queryIndex = path.indexOf('?');
  var _hashIndex = path.indexOf('#');
  var hashIndex = _hashIndex === -1 ? path.length : _hashIndex;
  var queryString = queryIndex === -1 ? '' : path.slice(queryIndex + 1, hashIndex);
  path = queryIndex === -1 ? path : path.slice(0, queryIndex);
  var Req = { uri: uri, path: path, query: QS.parse(queryString), $router: this };

  if (path === '/') {
    path = '';
  }
  var result = searchRouteTree2(routeTree, path);
  if (!result) return this; // 啥都找不到
  var routeNode = result.rnode,
      params = result.params;
  // 如果有 redirect 就重定向
  if (routeNode._redirect) {
    this.redirect(routeNode._redirect);
    return this;
  }
  Req.params = params;
  Req.data = routeNode ? routeNode.data : null;
  // 更新 this.current
  this.current = {
    uri: Req.uri,
    path: Req.path,
    query: Req.query,
    params: Req.params,
    data: Req.data
  };
  if (routeNode) {
    if (routeNode.title !== false) {
      document.title = routeNode.title;
    } else {
      if (this.options.title !== false) {
        document.title = this.options.title;
      }
    }
  }
  this._callHooks('beforeEachEnter', Req);
  var forwardList = result.forwardList;
  // 如果有 forward 先执行 forward
  if (forwardList) {
    for (var i = 0; i < forwardList.length; ++i) {
      var forwardNode = forwardList[i];
      forwardNode.callHooks('callbacks', Req);
    }
  }
  if (routeNode) {
    routeNode.callHooks('beforeEnter', Req); // @TODO 如果 beforeEnter 返回 false 或者 Promise 会影响 callbacks
    routeNode.callHooks('callbacks', Req);
  }
  lastReq = Req;
  lastRouteNode = routeNode;
  return this;
}

// 动态添加路由回调
function on(routePath, callbacks) {
  routePath = routePath.replace(/^\/([^\/]*)/, '$1'); // 去掉前置 /
  var routeNode = findNode(this._rtree, routePath, true);
  if (!routeNode._hooks['callbacks']) {
    routeNode.addHooks('callbacks', callbacks);
  } else {
    routeNode._hooks['callbacks'] = routeNode._hooks['callbacks'].concat(makeSureArray(callbacks));
  }
  return this;
}

// 动态移除路由回调
function off(routePath, cb) {
  routePath = routePath.replace(/^\/([^\/]*)/, '$1'); // 去掉前置 /
  var routeNode = findNode(this._rtree, routePath, false);
  if (routeNode && routeNode._hooks['callbacks']) {
    if (cb) {
      for (var i = 0; i < routeNode._hooks['callbacks'].length; ++i) {
        if (routeNode._hooks['callbacks'][i] === cb) {
          routeNode._hooks['callbacks'].splice(i, 1);
          break;
        }
      }
    } else {
      routeNode._hooks['callbacks'].splice(0, routeNode._hooks['callbacks'].length);
    }
  }
  if (routeNode && routeNode._hooks['callbacks'] && routeNode._hooks['callbacks'].length === 0 && routeNode.children.length === 0 && routeNode.parent) {
    routeNode.parent.removeChild(routeNode);
  }
  return this;
}

// 动态添加路由回调，但是只响应一次
function once(routePath, callbacks) {
  callbacks = makeSureArray(callbacks);
  var _this = this;
  function onlyOnce(req) {
    for (var i = 0; i < callbacks.length; ++i) {
      callbacks[i].call(_this, req);
    }
    _this.off(routePath, onlyOnce);
  }
  return this.on(routePath, onlyOnce);
}

/**
 * 这个方法会改变当前页面的 `url`，从而触发路由
 * 在 history 模式下，用户无法通过标签改变 `url` 而不跳转页面，需要监听 click 事件，禁止默认跳转行为，并调用 go 方法
 * 如果是 history 模式，相当于调用一次 history.pushState() 然后再调用 .dispatch()
 * 如果 url 没有改变，不会"刷新"页面，要通过代码“刷新”页面，可以调用 reload 方法
 *
 * path 可以是一个路由描述对象
 * */
function go(path) {
  var loc = window.location;
  var oldURI = loc.pathname + loc.search;
  if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path !== null) {
    path = routeDescObjToPath(this._namedRoutes, path);
  }
  Listener.setHashHistory(path);
  var newURI = '' + loc.pathname + loc.search;
  if (this.options.mode === 'history' && oldURI !== newURI) {
    this.dispatch(newURI);
  }
  return this;
}

function back() {
  if (Listener.supportHistory()) {
    window['history'].back();
  } else {}
  return this;
}

// 只改变当前的 `url` 但是不触发路由
// 和 dispatch 刚好相反，dispatch 只触发路由但不改变 `url`
function setUrlOnly(path) {
  if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path !== null) {
    path = routeDescObjToPath(this._namedRoutes, path);
  }
  Listener.setUrlOnly = true; // make sure not to trigger anything
  Listener.setHashHistory(path);
  return this;
}

// 重载当前页面
function reload() {
  if (this.options.mode === 'history') {
    this.dispatch('' + location.pathname + location.search + location.hash);
  } else {
    this.dispatch(location.hash.replace(/^#!?/, ''));
  }
  return this;
}

// 重定向（只产生一条历史记录）
function redirect(path) {
  if ((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path !== null) {
    // {name: 'routeName', params: {}}
    path = routeDescObjToPath(this._namedRoutes, path);
  }
  if (this.options.mode === 'history') {
    history.replaceState({}, '', path);
    this.dispatch(path);
  } else {
    location.replace(formatHashBangURI(path));
  }
  return this;
}

// 创建一个链接
function createLink(linkTo) {
  var result = routeDescObjToPath(this._namedRoutes, linkTo);
  if (result === null) {
    warn('\u8DEF\u5F84 ' + linkTo.name + ' \u4E0D\u5B58\u5728');
    result = '/';
  }
  result = result === '' ? '/' : result;
  return this.options.mode === 'history' ? result : '/#!' + result;
}

var uid = 0;

// mode: history|hashbang
// history     使用 HTML5 History API
// hashbang    使用 hash（hashbang 模式）
var optionDefaults = {
  title: false,
  mode: 'hashbang'
};

/**
 * Router (routes)
 * @constructor
 * @param {Object} routes **Optional**
 */
// 虽然允许在同一个应用创建多个 Router ，但是正常情况下你只需要创建一个实例
function Router(routes, options) {
  routes = routes || {};
  this._namedRoutes = {}; // 具名路由
  this._rtree = createRootRouteTree(this._namedRoutes, routes);
  this._hooks = {}; // 全局钩子
  this._init(options);
  this.current = {}; // 记录当前的 path 等信息
}

Router.QS = QS;

var proto = Router.prototype;

proto._init = function _init(options) {
  options = options || {};
  this._uid = uid++;
  this._isRunning = false;
  this.options = extend({}, optionDefaults, options);
  Listener.setMode(options.mode);
  this._hooks['beforeEachEnter'] = makeSureArray(options.beforeEachEnter);
  this._hooks['beforeEachLeave'] = makeSureArray(options.beforeEachLeave);
};

// 调用全局钩子
proto._callHooks = function _callHooks(hookName, Req) {
  var callbacks = this._hooks[hookName] || [];
  for (var i = 0; i < callbacks.length; ++i) {
    callbacks[i].call(this, Req);
  }
};

// start a router
proto.start = start; // 🆗

// stop a router
proto.stop = stop; // 🆗

// destroy a router
proto.destroy = destroy; // 🆗

// mount a sub-route-tree on a route node
proto.mount = mount; // 🆗

// dynamic add a route to route-tree
proto.on = on; // 🆗

// like .on except that it will dispatch only once
proto.once = once; // 🆗

// stop listen to a route
proto.off = off; // 🆗

// dispatch a route if path matches
proto.dispatch = dispatch; // 🆗

proto.go = go; // 🆗

proto.redirect = redirect; // 🆗

proto.back = back;

// only set url, don't dispatch any routes
proto.setUrlOnly = setUrlOnly; // 🆗

// redispatch current route
proto.reload = reload; // 🆗

proto.createLink = createLink;

export default Router;
//# sourceMappingURL=spa-router.js.map
