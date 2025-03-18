import{cr as D,s as x,aB as n,as as o,cs as R,r as N,ax as z,ay as w,j as v,az as E,aA as B,ct as F}from"./index-BXVaN-Bg.js";const I=["className","color","disableShrink","size","style","thickness","value","variant"];let l=r=>r,P,b,S,$;const a=44,K=D(P||(P=l`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),U=D(b||(b=l`
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
`)),W=r=>{const{classes:s,variant:e,color:t,disableShrink:d}=r,u={root:["root",e,`color${n(t)}`],svg:["svg"],circle:["circle",`circle${n(e)}`,d&&"circleDisableShrink"]};return B(u,F,s)},A=x("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,s)=>{const{ownerState:e}=r;return[s.root,s[e.variant],s[`color${n(e.color)}`]]}})(({ownerState:r,theme:s})=>o({display:"inline-block"},r.variant==="determinate"&&{transition:s.transitions.create("transform")},r.color!=="inherit"&&{color:(s.vars||s).palette[r.color].main}),({ownerState:r})=>r.variant==="indeterminate"&&R(S||(S=l`
      animation: ${0} 1.4s linear infinite;
    `),K)),G=x("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(r,s)=>s.svg})({display:"block"}),L=x("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,s)=>{const{ownerState:e}=r;return[s.circle,s[`circle${n(e.variant)}`],e.disableShrink&&s.circleDisableShrink]}})(({ownerState:r,theme:s})=>o({stroke:"currentColor"},r.variant==="determinate"&&{transition:s.transitions.create("stroke-dashoffset")},r.variant==="indeterminate"&&{strokeDasharray:"80px, 200px",strokeDashoffset:0}),({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink&&R($||($=l`
      animation: ${0} 1.4s ease-in-out infinite;
    `),U)),Z=N.forwardRef(function(s,e){const t=z({props:s,name:"MuiCircularProgress"}),{className:d,color:u="primary",disableShrink:_=!1,size:p=40,style:j,thickness:i=3.6,value:f=0,variant:k="indeterminate"}=t,M=w(t,I),c=o({},t,{color:u,disableShrink:_,size:p,thickness:i,value:f,variant:k}),h=W(c),m={},g={},y={};if(k==="determinate"){const C=2*Math.PI*((a-i)/2);m.strokeDasharray=C.toFixed(3),y["aria-valuenow"]=Math.round(f),m.strokeDashoffset=`${((100-f)/100*C).toFixed(3)}px`,g.transform="rotate(-90deg)"}return v.jsx(A,o({className:E(h.root,d),style:o({width:p,height:p},g,j),ownerState:c,ref:e,role:"progressbar"},y,M,{children:v.jsx(G,{className:h.svg,ownerState:c,viewBox:`${a/2} ${a/2} ${a} ${a}`,children:v.jsx(L,{className:h.circle,style:m,ownerState:c,cx:a,cy:a,r:(a-i)/2,fill:"none",strokeWidth:i})})}))});export{Z as C};
