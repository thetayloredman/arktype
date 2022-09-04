"use strict";(self.webpackChunkredo_dev=self.webpackChunkredo_dev||[]).push([[812],{8044:(e,r,t)=>{t.d(r,{Zo:()=>s,kt:()=>d});var n=t(9231);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function c(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=n.createContext({}),l=function(e){var r=n.useContext(p),t=r;return e&&(t="function"==typeof e?e(r):c(c({},r),e)),t},s=function(e){var r=l(e.components);return n.createElement(p.Provider,{value:r},e.children)},f={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},u=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),u=l(t),d=o,y=u["".concat(p,".").concat(d)]||u[d]||f[d]||a;return t?n.createElement(y,c(c({ref:r},s),{},{components:t})):n.createElement(y,c({ref:r},s))}));function d(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,c=new Array(a);c[0]=u;var i={};for(var p in r)hasOwnProperty.call(r,p)&&(i[p]=r[p]);i.originalType=e,i.mdxType="string"==typeof e?e:o,c[1]=i;for(var l=2;l<a;l++)c[l]=t[l];return n.createElement.apply(null,c)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"},4069:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>m,contentTitle:()=>d,default:()=>b,frontMatter:()=>u,metadata:()=>y,toc:()=>O});var n=t(8044),o=Object.defineProperty,a=Object.defineProperties,c=Object.getOwnPropertyDescriptors,i=Object.getOwnPropertySymbols,p=Object.prototype.hasOwnProperty,l=Object.prototype.propertyIsEnumerable,s=(e,r,t)=>r in e?o(e,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[r]=t,f=(e,r)=>{for(var t in r||(r={}))p.call(r,t)&&s(e,t,r[t]);if(i)for(var t of i(r))l.call(r,t)&&s(e,t,r[t]);return e};const u={},d="References",y={unversionedId:"api/References",id:"api/References",title:"References",description:"tags",source:"@site/docs/type/api/References.md",sourceDirName:"api",slug:"/api/References",permalink:"/type/api/References",draft:!1,tags:[],version:"current",frontMatter:{}},m={},O=[{value:"tags",id:"tags",level:2},{value:"text",id:"text",level:2}],v={toc:O};function b(e){var r,t=e,{components:o}=t,s=((e,r)=>{var t={};for(var n in e)p.call(e,n)&&r.indexOf(n)<0&&(t[n]=e[n]);if(null!=e&&i)for(var n of i(e))r.indexOf(n)<0&&l.call(e,n)&&(t[n]=e[n]);return t})(t,["components"]);return(0,n.kt)("wrapper",(r=f(f({},v),s),a(r,c({components:o,mdxType:"MDXLayout"}))),(0,n.kt)("h1",f({},{id:"references"}),"References"),(0,n.kt)("h2",f({},{id:"tags"}),"tags"),(0,n.kt)("pre",null,(0,n.kt)("code",f({parentName:"pre"},{className:"language-ts"}),"undefined\n")),(0,n.kt)("h2",f({},{id:"text"}),"text"),(0,n.kt)("pre",null,(0,n.kt)("code",f({parentName:"pre"},{className:"language-ts"}),'export declare type References<\n    Def,\n    Dict,\n    Options extends Node.References.TypeOptions = {}\n> = Merge<\n    {\n        filter: string\n        preserveStructure: false\n        format: "list"\n    },\n    Options\n> extends Node.References.TypeOptions<\n    infer Filter,\n    infer PreserveStructure,\n    infer Format\n>\n    ? TransformReferences<\n          Root.References<Def, Dict, PreserveStructure>,\n          Filter,\n          Format\n      >\n    : {}\n')))}b.isMDXComponent=!0}}]);