import{c8 as J,g as z,aU as Y,j as e,r as o,ah as O,l as L,B as h,f as T,k as M,x as B,H as k,b0 as p,b1 as W,b2 as w,c as a,bC as b,al as V,ae as F,W as N,P as $}from"./index-BXVaN-Bg.js";var P={exports:{}};(function(f,C){(function(c,u){f.exports=u()})(J,function(){var c="day";return function(u,m,x){var j=function(t){return t.add(4-t.isoWeekday(),c)},n=m.prototype;n.isoWeekYear=function(){return j(this).year()},n.isoWeek=function(t){if(!this.$utils().u(t))return this.add(7*(t-this.isoWeek()),c);var l,r,i,d,v=j(this),y=(l=this.isoWeekYear(),r=this.$u,i=(r?x.utc:x)().year(l).startOf("year"),d=4-i.isoWeekday(),i.isoWeekday()>4&&(d+=7),i.add(d,c));return v.diff(y,"week")+1},n.isoWeekday=function(t){return this.$utils().u(t)?this.day()||7:this.day(this.day()%7?t:t-7)};var g=n.startOf;n.startOf=function(t,l){var r=this.$utils(),i=!!r.u(l)||l;return r.p(t)==="isoweek"?i?this.date(this.date()-(this.isoWeekday()-1)).startOf("day"):this.date(this.date()-1-(this.isoWeekday()-1)+7).endOf("day"):g.bind(this)(t,l)}}})})(P);var U=P.exports;const R=z(U),G=Y(e.jsx("path",{d:"M9 1h6v2H9zm10.03 6.39 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61M13 14h-2V8h2z"}),"Timer"),K=Y(e.jsx("path",{d:"M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 18H4V8h16z"}),"CalendarToday");O.extend(R);function q(){const[f]=o.useState("00:00:00"),[C,c]=o.useState(""),[u,m]=o.useState(""),[x,j]=o.useState(""),[n,g]=o.useState("billable"),[t,l]=o.useState({}),[r,i]=o.useState(O()),[d,v]=o.useState(!0),y=L(),D=()=>y(N.main.timesheet.create),S=s=>i(E=>E.add(s,"week")),H=r.startOf("isoWeek"),A=r.endOf("isoWeek");return e.jsx(h,{p:3,bgcolor:"#f3f4f6",children:e.jsxs(T,{sx:{p:3,boxShadow:3},children:[e.jsxs(h,{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:1,borderColor:"#e0e0e0",pb:2,children:[e.jsx(M,{variant:"h6",fontWeight:600,children:"Time Logs"}),e.jsxs(h,{display:"flex",alignItems:"center",gap:1,position:"relative",p:1,border:1,borderColor:"#ccc",borderRadius:1,bgcolor:"#fff",onMouseEnter:()=>v(!0),children:[d&&e.jsx(B,{title:"Previous",children:e.jsx(k,{onClick:()=>S(-1),size:"small",children:"◁"})}),e.jsx(K,{}),d&&e.jsx(B,{title:"Next",children:e.jsx(k,{onClick:()=>S(1),size:"small",children:"▷"})}),e.jsxs(M,{children:[H.format("DD-MMM-YYYY")," to ",A.format("DD-MMM-YYYY")]})]}),e.jsx(k,{variant:"contained",onClick:D,children:"Log Time"})]}),e.jsxs(h,{display:"flex",alignItems:"center",gap:2,py:2,children:[e.jsxs(p,{sx:{width:240},error:!!t.project,children:[e.jsx(W,{children:"Select Project"}),e.jsxs(w,{value:C,onChange:s=>c(s.target.value),children:[e.jsx(a,{value:"",children:"Select Project"}),e.jsx(a,{value:"Project A",children:"Project A"}),e.jsx(a,{value:"Project B",children:"Project B"})]}),t.project&&e.jsx(b,{children:t.project})]}),e.jsxs(p,{sx:{width:240},error:!!t.job,children:[e.jsx(W,{children:"Select Job"}),e.jsxs(w,{value:u,onChange:s=>m(s.target.value),children:[e.jsx(a,{value:"",children:"Select Job"}),e.jsx(a,{value:"Job A",children:"Job A"}),e.jsx(a,{value:"Job B",children:"Job B"})]}),t.job&&e.jsx(b,{children:t.job})]}),e.jsxs(p,{sx:{flexGrow:1},error:!!t.description,children:[e.jsx(V,{label:"What are you working on?",variant:"outlined",fullWidth:!0,value:x,onChange:s=>j(s.target.value)}),t.description&&e.jsx(b,{children:t.description})]}),e.jsxs(p,{sx:{width:240},error:!!t.billable,children:[e.jsx(W,{children:"Billable"}),e.jsxs(w,{value:n,onChange:s=>g(s.target.value),children:[e.jsx(a,{value:"billable",children:"Billable"}),e.jsx(a,{value:"non-billable",children:"Non-Billable"})]}),t.billable&&e.jsx(b,{children:t.billable})]}),e.jsxs(h,{bgcolor:"black",color:"white",p:1,borderRadius:1,display:"flex",alignItems:"center",children:[e.jsx(G,{sx:{mr:1}})," ",f]})]}),e.jsx(T,{sx:{mt:2,textAlign:"center",p:25},children:e.jsx(F,{title:"No Logs",description:"No time logs added currently. To add new time logs, click Log Time"})})]})})}function Q(){return e.jsx(q,{})}const I={title:"Minimals UI: The starting point for your next project",description:"The starting point for your next project with Minimal UI Kit, built on the newest version of Material-UI ©, ready to be customized to your style"};function Z(){return e.jsxs(e.Fragment,{children:[e.jsxs($,{children:[e.jsxs("title",{children:[" ",I.title]}),e.jsx("meta",{name:"description",content:I.description})]}),e.jsx(Q,{})]})}export{Z as default};
