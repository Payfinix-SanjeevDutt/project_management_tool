import{r as g,bP as O,ay as z,al as v,as as l,j as o,s as F,az as le,bR as Z,aS as e,c9 as ce,f as ue,G as me,S as V,b0 as I,b1 as B,b2 as E,c as j,H as L,ah as _}from"./index-BXVaN-Bg.js";import{C as de}from"./CardHeader-CynLBTsA.js";import{C as pe}from"./CardContent-DM5qRC3a.js";import{v as U,P as be,b as y,d as fe,e as K,f as Te,r as H,R as he,a as W}from"./date-time-utils-CU9-YODR.js";import{F as $}from"./FormControlLabel-BRFnA9-2.js";import{B as xe,b as ve,c as Pe,s as J,d as je,P as ge,e as ke,f as Ce,g as Me,k as ye,l as A,h as G,m as Se,C as S,n as Y,q as we,E as ee,F as De,w as oe,x as se,G as Re,z as te,y as Ie,H as Le,D as Oe}from"./DatePicker-01LY8aSd.js";import{g as Fe,a as Ae,u as Ne,c as Ve}from"./createStyled-mUU3E4G-.js";import"./DialogContent-CxPgUekA.js";const Be=s=>{const t=xe(s),{forwardedProps:c,internalProps:r}=ve(t,"time");return Pe({forwardedProps:c,internalProps:r,valueManager:J,fieldValueManager:je,validator:U,valueType:"time"})},Ee=["slots","slotProps","InputProps","inputProps"],ae=g.forwardRef(function(t,c){const r=O({props:t,name:"MuiTimeField"}),{slots:i,slotProps:a,InputProps:f,inputProps:d}=r,h=z(r,Ee),m=r,T=(i==null?void 0:i.textField)??(t.enableAccessibleFieldDOMStructure?ge:v),p=ke({elementType:T,externalSlotProps:a==null?void 0:a.textField,externalForwardedProps:h,ownerState:m,additionalProps:{ref:c}});p.inputProps=l({},d,p.inputProps),p.InputProps=l({},f,p.InputProps);const n=Be(p),u=Ce(n),b=Me(l({},u,{slots:i,slotProps:a}));return o.jsx(T,l({},b))});function He(s){return Ae("MuiTimePickerToolbar",s)}const w=Fe("MuiTimePickerToolbar",["root","separator","hourMinuteLabel","hourMinuteLabelLandscape","hourMinuteLabelReverse","ampmSelection","ampmLandscape","ampmLabel"]),We=["ampm","ampmInClock","value","isLandscape","onChange","view","onViewChange","views","disabled","readOnly","className"],$e=s=>{const{isLandscape:t,classes:c,isRtl:r}=s;return Ve({root:["root"],separator:["separator"],hourMinuteLabel:["hourMinuteLabel",t&&"hourMinuteLabelLandscape",r&&"hourMinuteLabelReverse"],ampmSelection:["ampmSelection",t&&"ampmLandscape"],ampmLabel:["ampmLabel"]},He,c)},_e=F(ye,{name:"MuiTimePickerToolbar",slot:"Root",overridesResolver:(s,t)=>t.root})({}),ze=F(be,{name:"MuiTimePickerToolbar",slot:"Separator",overridesResolver:(s,t)=>t.separator})({outline:0,margin:"0 4px 0 2px",cursor:"default"}),Ue=F("div",{name:"MuiTimePickerToolbar",slot:"HourMinuteLabel",overridesResolver:(s,t)=>[{[`&.${w.hourMinuteLabelLandscape}`]:t.hourMinuteLabelLandscape,[`&.${w.hourMinuteLabelReverse}`]:t.hourMinuteLabelReverse},t.hourMinuteLabel]})({display:"flex",justifyContent:"flex-end",alignItems:"flex-end",variants:[{props:{isRtl:!0},style:{flexDirection:"row-reverse"}},{props:{isLandscape:!0},style:{marginTop:"auto"}}]}),Je=F("div",{name:"MuiTimePickerToolbar",slot:"AmPmSelection",overridesResolver:(s,t)=>[{[`.${w.ampmLabel}`]:t.ampmLabel},{[`&.${w.ampmLandscape}`]:t.ampmLandscape},t.ampmSelection]})({display:"flex",flexDirection:"column",marginRight:"auto",marginLeft:12,[`& .${w.ampmLabel}`]:{fontSize:17},variants:[{props:{isLandscape:!0},style:{margin:"4px 0 auto",flexDirection:"row",justifyContent:"space-around",flexBasis:"100%"}}]});function Ge(s){const t=O({props:s,name:"MuiTimePickerToolbar"}),{ampm:c,ampmInClock:r,value:i,isLandscape:a,onChange:f,view:d,onViewChange:h,views:m,disabled:T,readOnly:p,className:n}=t,u=z(t,We),b=A(),k=G(),N=Ne(),D=!!(c&&!r&&m.includes("hours")),{meridiemMode:C,handleMeridiemChange:M}=Se(i,c,f),R=q=>c?b.format(q,"hours12h"):b.format(q,"hours24h"),P=l({},t,{isRtl:N}),x=$e(P),Q=o.jsx(ze,{tabIndex:-1,value:":",variant:"h3",selected:!1,className:x.separator});return o.jsxs(_e,l({landscapeDirection:"row",toolbarTitle:k.timePickerToolbarTitle,isLandscape:a,ownerState:P,className:le(x.root,n)},u,{children:[o.jsxs(Ue,{className:x.hourMinuteLabel,ownerState:P,children:[S(m,"hours")&&o.jsx(y,{tabIndex:-1,variant:"h3",onClick:()=>h("hours"),selected:d==="hours",value:i?R(i):"--"}),S(m,["hours","minutes"])&&Q,S(m,"minutes")&&o.jsx(y,{tabIndex:-1,variant:"h3",onClick:()=>h("minutes"),selected:d==="minutes",value:i?b.format(i,"minutes"):"--"}),S(m,["minutes","seconds"])&&Q,S(m,"seconds")&&o.jsx(y,{variant:"h3",onClick:()=>h("seconds"),selected:d==="seconds",value:i?b.format(i,"seconds"):"--"})]}),D&&o.jsxs(Je,{className:x.ampmSelection,ownerState:P,children:[o.jsx(y,{disableRipple:!0,variant:"subtitle2",selected:C==="am",typographyClassName:x.ampmLabel,value:Y(b,"am"),onClick:p?void 0:()=>M("am"),disabled:T}),o.jsx(y,{disableRipple:!0,variant:"subtitle2",selected:C==="pm",typographyClassName:x.ampmLabel,value:Y(b,"pm"),onClick:p?void 0:()=>M("pm"),disabled:T})]})]}))}function ne(s,t){var f;const c=A(),r=O({props:s,name:t}),i=r.ampm??c.is12HourCycleInCurrentLocale(),a=g.useMemo(()=>{var d;return((d=r.localeText)==null?void 0:d.toolbarTitle)==null?r.localeText:l({},r.localeText,{timePickerToolbarTitle:r.localeText.toolbarTitle})},[r.localeText]);return l({},r,{ampm:i,localeText:a},we({views:r.views,openTo:r.openTo,defaultViews:["hours","minutes"],defaultOpenTo:"hours"}),{disableFuture:r.disableFuture??!1,disablePast:r.disablePast??!1,slots:l({toolbar:Ge},r.slots),slotProps:l({},r.slotProps,{toolbar:l({ampm:i,ampmInClock:r.ampmInClock},(f=r.slotProps)==null?void 0:f.toolbar)})})}const re=g.forwardRef(function(t,c){var D,C,M,R;const r=G(),i=A(),a=ne(t,"MuiDesktopTimePicker"),{shouldRenderTimeInASingleColumn:f,views:d,timeSteps:h}=fe(a),m=f?Te:K,T=l({hours:m,minutes:m,seconds:m,meridiem:m},a.viewRenderers),p=a.ampmInClock??!0,n=f?[]:["accept"],b=((D=T.hours)==null?void 0:D.name)===K.name?d:d.filter(P=>P!=="meridiem"),k=l({},a,{ampmInClock:p,timeSteps:h,viewRenderers:T,format:ee(i,a),views:f?["hours"]:b,slots:l({field:ae,openPickerIcon:De},a.slots),slotProps:l({},a.slotProps,{field:P=>{var x;return l({},oe((x=a.slotProps)==null?void 0:x.field,P),se(a),{ref:c})},toolbar:l({hidden:!0,ampmInClock:p},(C=a.slotProps)==null?void 0:C.toolbar),actionBar:l({actions:n},(M=a.slotProps)==null?void 0:M.actionBar)})}),{renderPicker:N}=Re({props:k,valueManager:J,valueType:"time",getOpenDialogAriaText:Z({utils:i,formatKey:"fullTime",contextTranslation:r.openTimePickerDialogue,propsTranslation:(R=k.localeText)==null?void 0:R.openTimePickerDialogue}),validator:U});return N()});re.propTypes={ampm:e.bool,ampmInClock:e.bool,autoFocus:e.bool,className:e.string,closeOnSelect:e.bool,defaultValue:e.object,disabled:e.bool,disableFuture:e.bool,disableIgnoringDatePartForTimeValidation:e.bool,disableOpenPicker:e.bool,disablePast:e.bool,enableAccessibleFieldDOMStructure:e.any,format:e.string,formatDensity:e.oneOf(["dense","spacious"]),inputRef:te,label:e.node,localeText:e.object,maxTime:e.object,minTime:e.object,minutesStep:e.number,name:e.string,onAccept:e.func,onChange:e.func,onClose:e.func,onError:e.func,onOpen:e.func,onSelectedSectionsChange:e.func,onViewChange:e.func,open:e.bool,openTo:e.oneOf(["hours","meridiem","minutes","seconds"]),orientation:e.oneOf(["landscape","portrait"]),readOnly:e.bool,reduceAnimations:e.bool,referenceDate:e.object,selectedSections:e.oneOfType([e.oneOf(["all","day","empty","hours","meridiem","minutes","month","seconds","weekDay","year"]),e.number]),shouldDisableTime:e.func,skipDisabled:e.bool,slotProps:e.object,slots:e.object,sx:e.oneOfType([e.arrayOf(e.oneOfType([e.func,e.object,e.bool])),e.func,e.object]),thresholdToRenderTimeInASingleColumn:e.number,timeSteps:e.shape({hours:e.number,minutes:e.number,seconds:e.number}),timezone:e.string,value:e.object,view:e.oneOf(["hours","meridiem","minutes","seconds"]),viewRenderers:e.shape({hours:e.func,meridiem:e.func,minutes:e.func,seconds:e.func}),views:e.arrayOf(e.oneOf(["hours","minutes","seconds"]).isRequired)};const ie=g.forwardRef(function(t,c){var T,p;const r=G(),i=A(),a=ne(t,"MuiMobileTimePicker"),f=l({hours:H,minutes:H,seconds:H},a.viewRenderers),d=a.ampmInClock??!1,h=l({},a,{ampmInClock:d,viewRenderers:f,format:ee(i,a),slots:l({field:ae},a.slots),slotProps:l({},a.slotProps,{field:n=>{var u;return l({},oe((u=a.slotProps)==null?void 0:u.field,n),se(a),{ref:c})},toolbar:l({hidden:!1,ampmInClock:d},(T=a.slotProps)==null?void 0:T.toolbar)})}),{renderPicker:m}=Ie({props:h,valueManager:J,valueType:"time",getOpenDialogAriaText:Z({utils:i,formatKey:"fullTime",contextTranslation:r.openTimePickerDialogue,propsTranslation:(p=h.localeText)==null?void 0:p.openTimePickerDialogue}),validator:U});return m()});ie.propTypes={ampm:e.bool,ampmInClock:e.bool,autoFocus:e.bool,className:e.string,closeOnSelect:e.bool,defaultValue:e.object,disabled:e.bool,disableFuture:e.bool,disableIgnoringDatePartForTimeValidation:e.bool,disableOpenPicker:e.bool,disablePast:e.bool,enableAccessibleFieldDOMStructure:e.any,format:e.string,formatDensity:e.oneOf(["dense","spacious"]),inputRef:te,label:e.node,localeText:e.object,maxTime:e.object,minTime:e.object,minutesStep:e.number,name:e.string,onAccept:e.func,onChange:e.func,onClose:e.func,onError:e.func,onOpen:e.func,onSelectedSectionsChange:e.func,onViewChange:e.func,open:e.bool,openTo:e.oneOf(["hours","minutes","seconds"]),orientation:e.oneOf(["landscape","portrait"]),readOnly:e.bool,reduceAnimations:e.bool,referenceDate:e.object,selectedSections:e.oneOfType([e.oneOf(["all","day","empty","hours","meridiem","minutes","month","seconds","weekDay","year"]),e.number]),shouldDisableTime:e.func,slotProps:e.object,slots:e.object,sx:e.oneOfType([e.arrayOf(e.oneOfType([e.func,e.object,e.bool])),e.func,e.object]),timezone:e.string,value:e.object,view:e.oneOf(["hours","minutes","seconds"]),viewRenderers:e.shape({hours:e.func,minutes:e.func,seconds:e.func}),views:e.arrayOf(e.oneOf(["hours","minutes","seconds"]).isRequired)};const Qe=["desktopModeMediaQuery"],X=g.forwardRef(function(t,c){const r=O({props:t,name:"MuiTimePicker"}),{desktopModeMediaQuery:i=Le}=r,a=z(r,Qe);return ce(i,{defaultMatches:!0})?o.jsx(re,l({ref:c},a)):o.jsx(ie,l({ref:c},a))}),qe={projectName:"",jobName:"",workItem:"",description:"",startDate:_(),billableStatus:"Billable",totalHours:"",startTime:null,endTime:null,selectedTimeMode:"manual",timer:0,timerRunning:!1};function ao(){const[s,t]=g.useState(qe),[c,r]=g.useState(null),i=n=>{const{name:u,value:b}=n.target;t(k=>({...k,[u]:b}))},a=(n,u)=>{t(b=>({...b,[n]:u}))},f=n=>{t({...s,selectedTimeMode:n.target.value})},d=()=>{if(s.startTime&&s.endTime){const n=_(s.endTime).diff(_(s.startTime),"minute");return`${Math.floor(n/60)}h ${n%60}m`}return"00:00"},h=()=>{if(!s.timerRunning){const n=setInterval(()=>{t(u=>({...u,timer:u.timer+1}))},1e3);r(n),t(u=>({...u,timerRunning:!0}))}},m=()=>{clearInterval(c),t(n=>({...n,timerRunning:!1}))},T=()=>{clearInterval(c),t(n=>({...n,timer:0,timerRunning:!1}))},p=()=>{const n=Math.floor(s.timer/3600),u=Math.floor(s.timer%3600/60),b=s.timer%60;return`${n.toString().padStart(2,"0")}:${u.toString().padStart(2,"0")}:${b.toString().padStart(2,"0")}`};return o.jsxs(ue,{sx:{mx:"auto",width:"80%"},children:[o.jsx(de,{title:"Create Timesheet",subheader:"Fill in the details below",sx:{mb:3}}),o.jsx(me,{}),o.jsx(pe,{children:o.jsxs(V,{gap:3,children:[o.jsxs(I,{fullWidth:!0,children:[o.jsx(B,{children:"Project Name"}),o.jsxs(E,{name:"projectName",value:s.projectName,onChange:i,children:[o.jsx(j,{value:"",children:"Select"}),o.jsx(j,{value:"Project A",children:"Project A"}),o.jsx(j,{value:"Project B",children:"Project B"})]})]}),o.jsxs(I,{fullWidth:!0,children:[o.jsx(B,{children:"Job Name"}),o.jsxs(E,{name:"jobName",value:s.jobName,onChange:i,children:[o.jsx(j,{value:"",children:"Select"}),o.jsx(j,{value:"Job A",children:"Job A"}),o.jsx(j,{value:"Job B",children:"Job B"})]})]}),o.jsx(v,{fullWidth:!0,name:"workItem",label:"Work Item",variant:"outlined",value:s.workItem,onChange:i}),o.jsx(v,{fullWidth:!0,multiline:!0,rows:5,label:"Description",variant:"outlined",name:"description",value:s.description,onChange:i}),o.jsx(I,{component:"fieldset",children:o.jsxs(he,{row:!0,value:s.selectedTimeMode,onChange:f,children:[o.jsx($,{value:"manual",control:o.jsx(W,{}),label:"Total Hours"}),o.jsx($,{value:"startEnd",control:o.jsx(W,{}),label:"Start & End Time"}),o.jsx($,{value:"timer",control:o.jsx(W,{}),label:"Timer"})]})}),s.selectedTimeMode==="manual"&&o.jsx(v,{fullWidth:!0,name:"totalHours",label:"Total Hours",variant:"outlined",value:s.totalHours,onChange:i}),s.selectedTimeMode==="startEnd"&&o.jsxs(V,{direction:"row",gap:2,children:[o.jsx(X,{label:"Start Time",value:s.startTime,onChange:n=>a("startTime",n),renderInput:n=>o.jsx(v,{...n,fullWidth:!0})}),o.jsx(X,{label:"End Time",value:s.endTime,onChange:n=>a("endTime",n),renderInput:n=>o.jsx(v,{...n,fullWidth:!0})}),o.jsx(v,{label:"Duration",value:d(),disabled:!0,fullWidth:!0})]}),s.selectedTimeMode==="timer"&&o.jsxs(V,{direction:"row",gap:2,alignItems:"center",children:[o.jsx(v,{label:"Timer",value:p(),disabled:!0,fullWidth:!0}),o.jsx(L,{variant:"contained",color:"primary",onClick:h,disabled:s.timerRunning,children:"Start"}),o.jsx(L,{variant:"contained",color:"secondary",onClick:m,disabled:!s.timerRunning,children:"Stop"}),o.jsx(L,{variant:"outlined",color:"error",onClick:T,children:"Reset"})]}),o.jsx(Oe,{label:"Date",name:"startDate",value:s.startDate,onChange:n=>a("startDate",n),renderInput:n=>o.jsx(v,{...n,fullWidth:!0,variant:"outlined"})}),o.jsxs(I,{fullWidth:!0,children:[o.jsx(B,{children:"Billable Status"}),o.jsxs(E,{name:"billableStatus",value:s.billableStatus,onChange:i,children:[o.jsx(j,{value:"Billable",children:"Billable"}),o.jsx(j,{value:"Non-Billable",children:"Non-Billable"})]})]}),o.jsx(L,{className:"px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400",children:"Cancel"})]})})]})}export{ao as default};
