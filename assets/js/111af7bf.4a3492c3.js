"use strict";(self.webpackChunkarktype_io=self.webpackChunkarktype_io||[]).push([[5956],{9613:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>m});var r=t(9496);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),c=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(l.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},u=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(t),m=a,f=u["".concat(l,".").concat(m)]||u[m]||d[m]||o;return t?r.createElement(f,i(i({ref:n},p),{},{components:t})):r.createElement(f,i({ref:n},p))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=u;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},7234:(e,n,t)=>{t.d(n,{g:()=>q});var r=t(9346),a=t(7374),o=t(1163),i=t(574),s=t(9496),l=t(5924),c=t(3845),p=t(9417),d=t(5809),u=t(4218),m=t(4637);const f=["className","component"];var y=t(9292);const g=function(e={}){const{defaultTheme:n,defaultClassName:t="MuiBox-root",generateClassName:r}=e,a=(0,c.ZP)("div",{shouldForwardProp:e=>"theme"!==e&&"sx"!==e&&"as"!==e})(p.Z);return s.forwardRef((function(e,s){const c=(0,u.Z)(n),p=(0,d.Z)(e),{className:y,component:g="div"}=p,h=(0,i.Z)(p,f);return(0,m.jsx)(a,(0,o.Z)({as:g,ref:s,className:(0,l.Z)(y,r?r(t):t),theme:c},h))}))}({defaultTheme:(0,t(5579).Z)(),defaultClassName:"MuiBox-root",generateClassName:y.Z.generate}),h=g;var v=t(4454),b=t(6994),x=t(4660),k=t(8658),w=t(3345),S=t(1481),Z=t(9989);function P(e){return(0,Z.Z)("MuiCircularProgress",e)}(0,S.Z)("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);const O=["className","color","disableShrink","size","style","thickness","value","variant"];let D,C,j,E,T=e=>e;const N=44,I=(0,b.F4)(D||(D=T`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),M=(0,b.F4)(C||(C=T`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)),$=(0,w.ZP)("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(e,n)=>{const{ownerState:t}=e;return[n.root,n[t.variant],n[`color${(0,x.Z)(t.color)}`]]}})((({ownerState:e,theme:n})=>(0,o.Z)({display:"inline-block"},"determinate"===e.variant&&{transition:n.transitions.create("transform")},"inherit"!==e.color&&{color:(n.vars||n).palette[e.color].main})),(({ownerState:e})=>"indeterminate"===e.variant&&(0,b.iv)(j||(j=T`
      animation: ${0} 1.4s linear infinite;
    `),I))),R=(0,w.ZP)("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(e,n)=>n.svg})({display:"block"}),_=(0,w.ZP)("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(e,n)=>{const{ownerState:t}=e;return[n.circle,n[`circle${(0,x.Z)(t.variant)}`],t.disableShrink&&n.circleDisableShrink]}})((({ownerState:e,theme:n})=>(0,o.Z)({stroke:"currentColor"},"determinate"===e.variant&&{transition:n.transitions.create("stroke-dashoffset")},"indeterminate"===e.variant&&{strokeDasharray:"80px, 200px",strokeDashoffset:0})),(({ownerState:e})=>"indeterminate"===e.variant&&!e.disableShrink&&(0,b.iv)(E||(E=T`
      animation: ${0} 1.4s ease-in-out infinite;
    `),M))),F=s.forwardRef((function(e,n){const t=(0,k.Z)({props:e,name:"MuiCircularProgress"}),{className:r,color:a="primary",disableShrink:s=!1,size:c=40,style:p,thickness:d=3.6,value:u=0,variant:f="indeterminate"}=t,y=(0,i.Z)(t,O),g=(0,o.Z)({},t,{color:a,disableShrink:s,size:c,thickness:d,value:u,variant:f}),h=(e=>{const{classes:n,variant:t,color:r,disableShrink:a}=e,o={root:["root",t,`color${(0,x.Z)(r)}`],svg:["svg"],circle:["circle",`circle${(0,x.Z)(t)}`,a&&"circleDisableShrink"]};return(0,v.Z)(o,P,n)})(g),b={},w={},S={};if("determinate"===f){const e=2*Math.PI*((N-d)/2);b.strokeDasharray=e.toFixed(3),S["aria-valuenow"]=Math.round(u),b.strokeDashoffset=`${((100-u)/100*e).toFixed(3)}px`,w.transform="rotate(-90deg)"}return(0,m.jsx)($,(0,o.Z)({className:(0,l.Z)(h.root,r),style:(0,o.Z)({width:c,height:c},w,p),ownerState:g,ref:n,role:"progressbar"},S,y,{children:(0,m.jsx)(R,{className:h.svg,ownerState:g,viewBox:"22 22 44 44",children:(0,m.jsx)(_,{className:h.circle,style:b,ownerState:g,cx:N,cy:N,r:(N-d)/2,fill:"none",strokeWidth:d})})}))}));var z={"index.html":'<head>\n    <link href="http://fonts.cdnfonts.com/css/cascadia-code" rel="stylesheet" />\n</head>\n<div id="demo">\n    <div class="section">\n        <h3>Definition</h3>\n        <div class="card">\n            <pre><code id="definition"></code></pre>\n        </div>\n    </div>\n    <div class="section">\n        <h3>Output</h3>\n        <div class="card">\n            <pre><code id="output"></code></pre>\n        </div>\n    </div>\n</div>\n',"demo.css":'body {\n    font-family: "Cascadia Code", sans-serif;\n    background-color: hsl(220 18% 10%);\n}\n\n#demo {\n    display: flex;\n    flex-direction: column;\n    gap: 16px;\n    margin: -8px;\n    padding: 8px;\n}\n\n#input {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n    gap: 8px;\n}\n\n.section {\n    display: flex;\n    flex-direction: column;\n    flex-grow: 1;\n    gap: 8px;\n}\n\n.card {\n    padding: 8px;\n    background-color: rgb(18, 18, 18);\n    color: rgb(255, 255, 255);\n    /* transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms; */\n    border-radius: 4px;\n    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 1px -1px,\n        rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 1px 3px 0px;\n    background-image: linear-gradient(\n        rgba(255, 255, 255, 0.05),\n        rgba(255, 255, 255, 0.05)\n    );\n    height: 100%;\n}\n\np {\n    white-space: pre-wrap;\n}\n\npre {\n    white-space: pre-wrap;\n}\n\nh3 {\n    margin: 0px;\n    color: #fffff0;\n}\n\n.key {\n    color: #80cff8;\n}\n.val {\n    color: #f5cf8f;\n}\n',"populateDemo.ts":'import "./demo.css"\nimport type { Problems, Type } from "arktype"\nimport { stringify } from "arktype/internal/utils/serialize.js"\n\ntype PopulateDemoArgs = {\n    type: Type\n    data: unknown\n    problems: Problems\n}\nexport const populateDemo = ({ data, type, problems }: PopulateDemoArgs) => {\n    const defElement = document.querySelector("#definition")!\n    defElement.textContent = stringify(type.definition, 2)\n    defElement.innerHTML = recolor(defElement.innerHTML)\n\n    const resultElement = document.querySelector("#output")!\n    if (problems) {\n        resultElement.textContent = `\u274c problems:\n\n${problems}`\n    } else {\n        resultElement.textContent = `\u2705 data:\n\n${stringify(\n            type(data).data,\n            2\n        )}`\n        resultElement.innerHTML = recolor(resultElement.innerHTML)\n    }\n}\n\nconst recolor = (input: string) => {\n    const lines = input.split("\\n")\n    const fixedInput: string[] = []\n    for (const line of lines) {\n        if (line.includes(":")) {\n            const parts = line.split(":")\n            fixedInput.push(`${buildKey(parts[0])}: ${buildVal(parts[1])}`)\n        } else {\n            fixedInput.push(line)\n        }\n    }\n    return fixedInput.join("\\n")\n}\n\nconst buildKey = (key: string) => {\n    return `<span class=\'key\'>${key}</span>`\n}\nconst buildVal = (val: string) => {\n    const formatted = val.trim()\n    if (formatted[formatted.length - 1] === ",") {\n        return `<span class=\'val\'>${formatted.replace(",", "")}</span>,`\n    } else if (formatted[formatted.length - 1] === "{") {\n        return "{"\n    }\n    return `<span class=\'val\'>${formatted}</span>`\n}\n',"tsconfig.json":JSON.stringify({compilerOptions:{module:"esnext",target:"esnext",strict:!0}},null,4)},A=t(4096);var L=function(e){var n=B[e];return'import {populateDemo} from "./populateDemo"\n(async () => {\n    try {\n        '+n[0]+"\n        populateDemo("+n[1]+')\n    } catch(e) {\n        populateDemo({ \n            type: {\n                definition: ""\n            },\n            data: "",\n            problems: "ParseError: " + e.originalErr.message\n          } as any)\n    }\n})()'},B={type:['const { user, data, problems } = await import("./type")',"{ type: user, data, problems }"],scope:['const { types, data, problems } = await import("./scope")',"{ type: types.package, data, problems }"]},H={type:'import { type } from "../src/main"\n\n// Define a type...\nexport const user = type({\n    name: "string",\n    device: {\n        platform: "\'android\'|\'ios\'",\n        "version?": "number"\n    }\n})\n\n// Infer it...\nexport type User = typeof user.infer\n\n// Validate your data anytime, anywhere, with the same clarity and precision you expect from TypeScript.\nexport const { data, problems } = user({\n    name: "Alan Turing",\n    device: {\n        platform: "enigma"\n    }\n})\n\nif (problems) {\n    // "device/platform must be \'android\' or \'ios\' (was \'enigma\')"\n    console.log(problems.summary)\n}\n',scope:'import { scope } from "../src/main"\n\n// Scopes are collections of types that can reference each other.\nexport const types = scope({\n    package: {\n        name: "string",\n        "dependencies?": "package[]",\n        "contributors?": "contributor[]"\n    },\n    contributor: {\n        // Subtypes like \'email\' are inferred like \'string\' but provide additional validation at runtime.\n        email: "email",\n        "packages?": "package[]"\n    }\n}).compile()\n\n// Cyclic types are inferred to arbitrary depth...\nexport type Package = typeof types.package.infer\n\n// And can validate cyclic data.\nconst packageData: Package = {\n    name: "arktype",\n    dependencies: [{ name: "typescript" }],\n    contributors: [{ email: "david@sharktypeio" }]\n}\npackageData.dependencies![0].dependencies = [packageData]\n\nexport const { data, problems } = types.package(packageData)\n'},V="arktype-demo",X=function(){var e=(0,a.Z)((0,r.Z)().mark((function e(n){var t,a;return(0,r.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=n.embedId,e.abrupt("return",A.Z.embedProject(V,{files:Object.assign((t={},t[a+".ts"]=H[a],t["index.ts"]=L(a),t),z),title:a,description:"ArkType "+a+" demo",template:"typescript",dependencies:{arktype:"1.0.4-alpha"},settings:{compile:{clearConsole:!1,trigger:"keystroke"}}},{height:"100%",openFile:a+".ts"}));case 2:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),q=function(e){var n=(0,s.useState)(!0),t=n[0],o=n[1];return(0,s.useEffect)((function(){(0,a.Z)((0,r.Z)().mark((function n(){var t;return(0,r.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,X(e);case 2:t=n.sent,setTimeout((function(){return t.applyFsDiff({create:{"tsconfig.json":JSON.stringify({compilerOptions:{module:"esnext",target:"esnext",strict:!0}},null,4)},destroy:[]})}),3e3),o(!1);case 5:case"end":return n.stop()}}),n)})))()}),[]),s.createElement(h,{style:{width:"100%",height:"660px",border:0,marginLeft:-8,marginRight:-8,padding:16,overflow:"hidden",borderRadius:"8px",display:"flex",justifyContent:"center",alignItems:"center"}},t?s.createElement(F,{style:{position:"absolute"},color:"secondary"}):null,s.createElement("div",{style:{opacity:t?0:1},id:V}))}},8246:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>c,default:()=>f,frontMatter:()=>l,metadata:()=>p,toc:()=>u});var r=t(4250),a=t(7075),o=(t(9496),t(9613)),i=t(7234),s=["components"],l={id:"intro",hide_table_of_contents:!0,title:"Intro"},c="Getting Started",p={unversionedId:"intro",id:"version-1.0.3-alpha/intro",title:"Intro",description:"Installation \ud83d\udce6",source:"@site/versioned_docs/version-1.0.3-alpha/index.mdx",sourceDirName:".",slug:"/",permalink:"/docs/1.0.3-alpha/",draft:!1,tags:[],version:"1.0.3-alpha",frontMatter:{id:"intro",hide_table_of_contents:!0,title:"Intro"},sidebar:"sidebar",next:{title:"Scopes",permalink:"/docs/1.0.3-alpha/scopes"}},d={},u=[{value:"Installation \ud83d\udce6",id:"installation-",level:2},{value:"Your first type",id:"your-first-type",level:2}],m={toc:u};function f(e){var n=e.components,t=(0,a.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"getting-started"},"Getting Started"),(0,o.kt)("h2",{id:"installation-"},"Installation \ud83d\udce6"),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"npm install arktype")),(0,o.kt)("p",null,"(feel free to substitute ",(0,o.kt)("inlineCode",{parentName:"p"},"yarn"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"pnpm"),", et al.)"),(0,o.kt)("p",null,"If you're using TypeScript, you'll need at least ",(0,o.kt)("inlineCode",{parentName:"p"},"4.8"),"."),(0,o.kt)("h2",{id:"your-first-type"},"Your first type"),(0,o.kt)(i.g,{embedId:"type",mdxType:"StackBlitzDemo"}))}f.isMDXComponent=!0}}]);