// ==UserScript==
// @name            Static Google
// @description     Google search interface always visible on screen, and some additional changes for more compact layout.
// @author          idx
// @namespace       idoenk/Static_Google
// @homepageURL     https://github.com/idoenk/Static_Google
// @supportURL      https://github.com/idoenk/Static_Google
// @icon            https://dl.dropboxusercontent.com/u/33009152/misc/glarge96-min.png
// @include         http://www.google.*
// @include         https://www.google.*
// @include         https://encrypted.google.*
// @version         0.2.2
// @timestamp       1444128908196
// @run-at          document-start
// ==/UserScript==
/**
* Forked from:
*  https://github.com/tumpio/gmscripts/blob/master/Static_Google/sgoogle.user.js
*  By tumpio
* 
window.alert(new Date().getTime());
*
*/

// Do not run on iframes > image search
if (window.top !== window.self) {
  return;
}

function clog(x){console.log(x)}
var $D=function (q, root, single) {
    var el;
    if (root && typeof root == 'string') {
        root = $D(root, null, true);
        if (!root) { return null; }
    }
    if( !q ) return false;
    if ( typeof q == 'object') return q;
    root = root || document;
    if (q[0]=='/' || (q[0]=='.' && q[1]=='/')) {
        if (single) {
          return document.evaluate(q, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
        return document.evaluate(q, root, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    }
    else if (q[0]=='.') {
      el = root.getElementsByClassName(q.substr(1));
      return single ? el[0] : el;
    }
    else if( q[0]=='#' ){
      return root.getElementById( q.substr(1) );
    }
    else{
        return root.querySelector(q);
    }
};
// native add - remove element
var Dom = {
  remove: function(el) {
    var el = $D(el);
    if (el && el.parentNode)
      el.parentNode.removeChild(el);
  },
  Ev: function() {
    if (window.addEventListener) {
      return function(el, type, fn, phase) {
        phase = (phase ? phase : false);
        if ('object' === typeof el && el)
          $D(el).addEventListener(type, function(e) {
            fn(e);
          }, phase);
      };
    } else if (window.attachEvent) {
      return function(el, type, fn) {
        var f = function() {
          fn.call($D(el), window.event);
        };
        $D(el).attachEvent('on' + type, f);
      };
    }
  }(),
};
var GM_addGlobalStyle = function (a, b, c) {
  var d, e;
  if (a.match(/^https?:\/\/.+/)) {
    d = createEl("link", { type: "text/css", rel:'stylesheet', href:a });
  }else{
    d = createEl("style", { type: "text/css" });
    d.appendChild(createTextEl(a));
  }
  if (isDefined(b) && isString(b)) d.setAttribute("id", b);
  c = ("undefined" == typeof c ? !1 : (!c ? document.body : c));
  
  if ( c ) {
      c.appendChild(d)
  } else {
    e = document.getElementsByTagName("head");
    if (isDefined(e[0]) && e[0].nodeName == "HEAD") setTimeout(function () {
      e[0].appendChild(d)
    }, 100);
    else document.body.insertBefore(d, document.body.firstChild)
  }
  return d
};

//=== mini-functions
// static routine
function isDefined(x)   { return !(x == null && x !== null); }
function isUndefined(x) { return x == null && x !== null; }
function isString(x) { return (typeof(x)!='object' && typeof(x)!='function'); }
function trimStr(x) { return (typeof(x)=='string' && x ? x.replace(/^\s+|\s+$/g,"") : '') };

function _o(m,e,f){Dom.Ev(e,m,function(e){typeof(f)=='function'?f(e):void(0)});}
function createTextEl(a) {
  return document.createTextNode(a)
}
function g(x, par){
  !par && (par = document);
  return ('string' == typeof x ? par.querySelector(x) : x);
}
function gAll(x, par){
  !par && (par = document);
  return ('string' == typeof x ? par.querySelectorAll(x) : x);
}
function createEl(a, b, c) {
  var d = document.createElement(a);
  for (var e in b)
    if (b.hasOwnProperty(e)) d.setAttribute(e, b[e]);
  if (c) d.innerHTML = c;
  return d
}
function addClass(cName, Obj){
  if(cName=="") return;
  var neocls = (Obj.className ? Obj.className : '');
  if(neocls.indexOf(cName)!=-1) return;
  neocls+=(neocls!=''?' ':'')+cName;
  setAttr('class', neocls, Obj);
}
function removeClass(cName, Obj){
  if(!cName || !Obj) return;
  var neocls, rmvclss = getAttr('class', Obj);
  neocls = getAttr('class', Obj);
  rmvclss = cName.split(' ');
  for(var i=0; i<rmvclss.length; ++i)
    neocls = neocls.replace(rmvclss[i], '');
  neocls = trimStr(neocls);
  setAttr('class', neocls, Obj);
}
function hasClass(cName, Obj){
  if(!cName || !Obj) return;
  var clss = getAttr('class', Obj).split(' ');
  return (clss.indexOf(cName) != -1);
}
function getAttr(name, Obj){
  if("string" === typeof name && "object" === typeof Obj && Obj)
    return Obj.getAttribute(name)||'';
  else
    return;
}
function setAttr(name, value, Obj){
  if("string" === typeof name && "object" === typeof Obj)
    return Obj.setAttribute(name, value);
}

(function(window, document){
  var i = '!important';
  var top2nd = '33px';
  var hlh2nd = '30px';
  var grey_trans = 'background-color: rgba(241, 241, 241, 0.8)';
  var white_trans = 'background-color:rgba(255,255,255, 0.7878)';
  var bkwhite = 'background-color:#fff';
  var css = ''
    +'body.stgoogfixed #searchform{position:fixed'+i+'; top:6px'+i+'; cursor: n-resize;}'
    +'body.stgoogfixed #cnt{padding-top:70px'+i+';}'
    +'body.stgoogfixed div#gb + div, body.stgoogfixed #gb + div > div{height: 48px;'+grey_trans+';}'
    +'body.stgoogfixed #sfdiv, body.stgoogfixed #sfdiv > div:first-child{background-color: transparent;}'
    +'body.stgoogfixed #sfdiv.sbfcn, body.stgoogfixed #searchform:hover #sfdiv{'+bkwhite+';}'
    +'body.stgoogfixed #searchform:hover div#gb + div{background:#f1f1f1;}'
    +'body.stgoogfixed div#top_nav{position: fixed;top: 40px;width: 100%;height: '+top2nd+'; z-index:101;}'
    +'body.stgoogfixed div#top_nav, body.stgoogfixed div#hdtbSum{'+white_trans+';}'
    +'body.stgoogfixed div#top_nav:hover, body.stgoogfixed #searchform:hover + #main div#top_nav{'+bkwhite+';}'
    +'body.stgoogfixed div#hdtbSum{height: '+top2nd+';line-height: '+hlh2nd+';position:absolute; width:100%;}'
    +'body.stgoogfixed div#hdtb-msb .hdtb-mitem.hdtb-msel, body.stgoogfixed #hdtb-msb .hdtb-mitem.hdtb-msel-pre{height: '+hlh2nd+';}'
    +'body.stgoogfixed .hdtb-mn-o, body.stgoogfixed #hdtbMenus.hdtb-td-o{top:'+top2nd+i+';}'
    +''
  ;
  
  var basic_css = ''
  +'#searchform, #hdtbSum, #top_nav{ transition: top 220ms ease-in-out; -webkit-transition: top 220ms ease-in-out;}'
  +'#topalert [href*="alerts"]{margin-bottom:0;}'
  ;
  GM_addGlobalStyle(basic_css);
  
  var el, id_css = 'stgoogfixed';
  
  if( !$D('#'+id_css) )
    GM_addGlobalStyle(css, id_css);
  
  
  function toggle_view(mode){
    if( mode == 'fixed' ){
      addClass(id_css, $D('body'));
    }
    else{
      removeClass(id_css, $D('body'));
    }
  };

  // remove tracker onclick|onmousedown of result link
  function cleanup_tracker(parent){
    var el, par, newEl, els, elen, attr;
    if("undefined" == typeof parent)
      parent = null;

    els = $D('//a[contains(@onmousedown,"return rwt")]', parent);

    if( elen = els.snapshotLength )
    for(var i=0; i<elen; i++){
      el = els.snapshotItem(i);
      par = el.parentNode;

      el.onmousedown = "return !1";

      attr = {href: getAttr("href", el)};
      if( el.className )
        attr["class"] = el.className;
      newEl = createEl("a", attr, el.innerHTML);
      par.replaceChild(newEl, el);
    }
    //clog("els-len="+elen+'; cleanup done');
  }

  var observer = new MutationObserver(function(mutations) {
    var BreakException = {};
    try{
      mutations.forEach(function(mev) {
        // var $el = $(mev.target);
        var lastNode, addedNodes = mev.addedNodes;
        if( addedNodes.length > 0 ){
          addedNodes = mev.target.lastElementChild;
          //clog(addedNodes);
          lastNode = addedNodes.lastElementChild;
          if( lastNode && (lastNode.id == 'ires') ){
            // do cleanup...
            setTimeout(function(){

              cleanup_tracker($D('#search'));
            }, 0);
          }
        }
        //clog(mev);
        
      });
    }catch(e){}
  });
  
  document.addEventListener('DOMContentLoaded', function(){

    var el, targetSearch;

    targetSearch = $D('#search');
    

    // pass in the target node, as well as the observer options
    if( targetSearch )
    observer.observe(targetSearch, {
      attributes: false,
      childList: true,
      characterData: false
    });

    setTimeout(function(){
      clog(targetSearch);
      cleanup_tracker(targetSearch);
    }, 2783);

    
    // in news page?
    el = $D('//a[contains(@href,"alerts")]', null, true);
    if( el ){
      var ol = $D("ol", $D("#hdtbSum"), true);
      var clNode = el.cloneNode(true);
      var innerLi = createEl('li', {"class":"ab_ctl","id":"topalert"});
      innerLi.appendChild(clNode);
      
      ol.insertBefore(innerLi, ol.firstChild);
    }
    
    // events
    _o("scroll", window, function(){
      var nVScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if( nVScroll > 0 ) 
        toggle_view('fixed');
      else
        toggle_view('default');
    });

    //click on fixed-bar
    _o("click", $D("#searchform"), function(e){
      var identy_el, e = e.target||e;
      if( e ){
        identy_el = e.parentNode;
        if( identy_el && hasClass("nojsv", identy_el) )
          window.scrollTo(0,0);
      }
    });
  }, false);
    
})(window, document);
