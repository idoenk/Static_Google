// ==UserScript==
// @name            Static Google
// @description     Google search interface always visible on screen, and some additional changes for more compact layout.
// @author          idx
// @namespace       idoenk/Static_Google
// @homepageURL     https://github.com/idoenk/Static_Google
// @supportURL      https://github.com/idoenk/Static_Google
// @icon            https://raw.githubusercontent.com/tumpio/gmscripts/master/Static_Google/large.png
// @include         http://www.google.*
// @include         https://www.google.*
// @include         https://encrypted.google.*
// @version         0.1
// @run-at          document-start
// ==/UserScript==
/**
* Forked from:
*  https://github.com/tumpio/gmscripts/blob/master/Static_Google/sgoogle.user.js
*  By tumpio
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

document.onreadystatechange = function () {
  var toggle_view = function(mode){
    var divbkg, dvh, searchform = $D("#searchform", null);
    dvh = (mode == 'fixed' ? '50px' : '59px');

    if( searchform ){
      searchform.style.position = (mode == 'fixed' ? 'fixed' : 'absolute');
      searchform.style.top = (mode == 'fixed' ? '4px' : '15px');

      divbkg = $D('[id="gb"]', searchform, true);
      if( divbkg ){
        divbkg = divbkg.nextElementSibling;
        !divbkg && 
        clog("missing-element: div under form");
        if( divbkg )
          divbkg.style.height = dvh;

        divbkg = $D("div:last-child", divbkg);
        !divbkg && 
        clog("missing-element: div under div");
        if( divbkg )
          divbkg.style.height = dvh;
      }
      else{
        clog("missing-element: form");
      }
    }
    else{
      clog("missing-element: #searchform");
    }
  };

  window.onscroll = function(){
    var el, nVScroll = document.documentElement.scrollTop || document.body.scrollTop;
    if( nVScroll > 0 ) 
      toggle_view('fixed');
    else
      toggle_view('default');
  };
};
/* Mod By Idx. */ 