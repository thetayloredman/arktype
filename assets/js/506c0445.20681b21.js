"use strict";(self.webpackChunkarktype_io=self.webpackChunkarktype_io||[]).push([[4557],{57522:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>d});var n=r(29901);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=n.createContext({}),u=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):p(p({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(i.Provider,{value:t},e.children)},s="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),s=u(r),f=o,d=s["".concat(i,".").concat(f)]||s[f]||m[f]||a;return r?n.createElement(d,p(p({ref:t},c),{},{components:r})):n.createElement(d,p({ref:t},c))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,p=new Array(a);p[0]=f;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[s]="string"==typeof e?e:o,p[1]=l;for(var u=2;u<a;u++)p[u]=r[u];return n.createElement.apply(null,p)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},88901:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>d,frontMatter:()=>l,metadata:()=>u,toc:()=>s});var n=r(12314),o=r(6639),a=(r(29901),r(57522)),p=["components"],l={hide_table_of_contents:!0},i="morph",u={unversionedId:"api/morph",id:"version-1.0.23-alpha/api/morph",title:"morph",description:"operator",source:"@site/versioned_docs/version-1.0.23-alpha/api/morph.md",sourceDirName:"api",slug:"/api/morph",permalink:"/docs/1.0.23-alpha/api/morph",draft:!1,tags:[],version:"1.0.23-alpha",frontMatter:{hide_table_of_contents:!0}},c={},s=[{value:"operator",id:"operator",level:2},{value:"tuple",id:"tuple",level:2},{value:"helper",id:"helper",level:2}],m={toc:s},f="wrapper";function d(e){var t=e.components,r=(0,o.Z)(e,p);return(0,a.kt)(f,(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"morph"},"morph"),(0,a.kt)("h2",{id:"operator"},"operator"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/1.0.23-alpha/api/morph"},"|",">"))),(0,a.kt)("h2",{id:"tuple"},"tuple"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},'[inputType, "',"|",'>", (data) => output]'," ",(0,a.kt)("br",null)),(0,a.kt)("li",{parentName:"ul"},"const tupleMorph = type( ",'["string", "',"|",'>" , (data) => ',"`","morphed ${data}","`]",")",(0,a.kt)("br",null))),(0,a.kt)("h2",{id:"helper"},"helper"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"morph(inputType, (data) => output) ",(0,a.kt)("br",null)),(0,a.kt)("li",{parentName:"ul"},'const helperMorph = morph("string", (data) => ',"`","morphed ${data}","`",")",(0,a.kt)("br",null))))}d.isMDXComponent=!0}}]);