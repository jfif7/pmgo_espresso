(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[177],{6057:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,9324,23)),Promise.resolve().then(r.bind(r,6529))},6529:(e,t,r)=>{"use strict";r.d(t,{P:()=>c,UserDataProvider:()=>i});var o=r(5155),a=r(2115);let l=(0,a.createContext)(null);l.displayName="UserDataContext";let s="pmgo_user_data",n={strings:{},formats:[{id:"all/overall/1500",name:"Great League",cup:"all",category:"overall",cp:1500,active:!0,topCut:100,tType:"percentRank",tValue:99},{id:"all/overall/2500",name:"Ultra League",cup:"all",category:"overall",cp:2500,active:!0,topCut:100,tType:"percentRank",tValue:99},{id:"all/overall/10000",name:"Master League",cup:"all",category:"overall",cp:1e4,active:!0,topCut:100,tType:"absoluteRank",tValue:1}],boxes:{cp500:new Set,cp1500:new Set,cp2500:new Set,cp10000:new Set,XL:new Set},thresholds:{cp500:{},cp1500:{},cp2500:{},cp10000:{}}};function i(e){let{children:t}=e,[r,i]=(0,a.useState)(n),[c,d]=(0,a.useState)(!1);return(0,a.useEffect)(()=>{try{let e=localStorage.getItem(s);if(e){let t=function(e){try{var t,r,o,a,l;let s=JSON.parse(e);return{strings:s.strings||{},formats:s.formats||[],boxes:{cp500:new Set((null===(t=s.boxes)||void 0===t?void 0:t.cp500)||[]),cp1500:new Set((null===(r=s.boxes)||void 0===r?void 0:r.cp1500)||[]),cp2500:new Set((null===(o=s.boxes)||void 0===o?void 0:o.cp2500)||[]),cp10000:new Set((null===(a=s.boxes)||void 0===a?void 0:a.cp10000)||[]),XL:new Set((null===(l=s.boxes)||void 0===l?void 0:l.XL)||[])},thresholds:s.thresholds||{}}}catch(e){return console.error("Failed to parse user data:",e),{...n}}}(e);i(t)}}catch(e){console.error("Failed to load user data from localStorage:",e)}finally{d(!0)}},[]),(0,a.useEffect)(()=>{if(c)try{let e=JSON.stringify({...r,boxes:{cp500:Array.from(r.boxes.cp500),cp1500:Array.from(r.boxes.cp1500),cp2500:Array.from(r.boxes.cp2500),cp10000:Array.from(r.boxes.cp10000),XL:Array.from(r.boxes.XL)}});localStorage.setItem(s,e)}catch(e){console.error("Failed to save user data to localStorage:",e)}},[r,c]),(0,o.jsx)(l.Provider,{value:{userData:r,updateStringSetting:(e,t)=>{i(r=>({...r,strings:{...r.strings,[e]:{...r.strings[e],...t}}}))},updateFormatSetting:(e,t,r)=>{i(o=>{let a=[...o.formats],l=a.findIndex(t=>t.id===e);if(-1!==l?a[l]={...a[l],...t}:a.push(t),void 0!==r){let t=a.findIndex(t=>t.id===e);if(-1!==t&&r<a.length){let[e]=a.splice(t,1);a.splice(r,0,e)}}return{...o,formats:a}})},deleteFormatSetting:e=>{i(t=>{let r=[...t.formats];return r=r.filter(t=>t.id!==e),{...t,formats:r}})},addToBox:(e,t)=>{i(r=>{let o=new Set(r.boxes[e]);return o.add(t),{...r,boxes:{...r.boxes,[e]:o}}})},removeFromBox:(e,t)=>{i(r=>{let o=new Set(r.boxes[e]);return o.delete(t),{...r,boxes:{...r.boxes,[e]:o}}})},updateThreshold:(e,t,r)=>{i(o=>{let a={...o.thresholds};return null===r?a[e]&&a[e][t]&&delete a[e][t]:a[e]={...a[e],[t]:r},{...o,thresholds:a}})}},children:t})}function c(){let e=(0,a.useContext)(l);if(void 0===e)throw Error("useUserData must be used within a UserDataProvider");if(null===e)throw Error("UserDataProvider null?");return e}},9324:()=>{}},e=>{var t=t=>e(e.s=t);e.O(0,[533,441,667,358],()=>t(6057)),_N_E=e.O()}]);