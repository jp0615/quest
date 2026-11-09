/* 試煉題目產生器（國小二上 單元 1～5，一步驟應用題）。瀏覽器：window.QG；Node：module.exports */
(function(root){
'use strict';
var R=Math.random;
function setRand(f){R=f||Math.random}
function ri(a,b){return a+Math.floor(R()*(b-a+1))}
function pick(a){return a[Math.floor(R()*a.length)]}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(R()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var MI='−',BOX='□';
var UNITS={1:{n:'200以內的數',r:'海拉魯平原',e:'🌾'},2:{n:'二位數的加減',r:'卡卡利科村',e:'🏮'},3:{n:'公分',r:'鼓隆城',e:'🌋'},4:{n:'加減應用',r:'哈特諾村',e:'🏡'},5:{n:'容量',r:'卓拉領地',e:'💧'},
  6:{n:'兩步驟的應用',r:'利特村',e:'🪶',soon:1},7:{n:'乘法',r:'格魯德小鎮',e:'🏜️',soon:1},8:{n:'更多冒險',r:'海布拉地區',e:'❄️',soon:1},9:{n:'更多冒險',r:'費羅尼地區',e:'🌴',soon:1},10:{n:'更多冒險',r:'拉聶爾地區',e:'⛰️',soon:1}};
var READY=[1,2,3,4,5];
var NAMES=['林克','薩爾達','林克','薩爾達','Brie','小美','小安','小樂','小宇','小晴','小雨','小風','小花','小葵'];
function names2(){var a=pick(NAMES),b;do{b=pick(NAMES)}while(b===a);return [a,b]}
var ITEMS=[{it:'餅乾',un:'片',v:'吃掉'},{it:'貼紙',un:'張',v:'送給同學'},{it:'彈珠',un:'顆',v:'送給弟弟'},{it:'貝殼',un:'個',v:'送給朋友'},
  {it:'色紙',un:'張',v:'用掉'},{it:'積木',un:'塊',v:'用掉'},{it:'花',un:'朵',v:'送給老師'},{it:'寶石',un:'顆',v:'放回寶箱'},{it:'蘋果',un:'顆',v:'分給鄰居'},{it:'箭',un:'枝',v:'射出'},{it:'蘑菇',un:'朵',v:'煮成料理用掉'},{it:'木柴',un:'根',v:'燒掉'}];
var MONS=['波克布林','莫力布林','啾啾','小波克布林'];
var GIVERS=['媽媽','爸爸','奶奶','老師','阿姨','哥哥'];
var THINGS=['筆記本','色鉛筆','冰淇淋','故事書','三明治','水壺','玩具車','髮夾','小盆栽'];
var PLACES=[['島上的果樹','顆','蘋果','結了','又結了'],['排球社','顆','排球','有','又買了'],['方塊屋','塊','方塊','用了','又用了'],['卡卡利科村的倉庫','根','木柴','有','又搬來了'],['林克的箭袋裡','枝','箭','有','又撿到了']];
/* ---------- 共用：算式 ---------- */
/* eq = {x,op,y,z}，其中一個是 null（□）；x op y = z */
function val(x,op,y){return op==='+'?x+y:x-y}
function eqTrue(e,ans){var x=e.x===null?ans:e.x,y=e.y===null?ans:e.y,z=e.z===null?ans:e.z;if(x<0||y<0||z<0)return false;return val(x,e.op,y)===z}
function eqStr(e){function f(v){return v===null?BOX:String(v)}return f(e.x)+' '+(e.op==='+'?'+':MI)+' '+f(e.y)+' = '+f(e.z)}
/* 這個算式實際要怎麼算 □：回傳 {a,op,b}（a op b = □） */
function eqEff(e){
  if(e.z===null)return {a:e.x,op:e.op,b:e.y};
  if(e.op==='+')return {a:e.z,op:'-',b:e.x===null?e.y:e.x};   /* □+y=z、x+□=z → z−… */
  if(e.x===null)return {a:e.z,op:'+',b:e.y};                    /* □−y=z → z+y */
  return {a:e.x,op:'-',b:e.z}}                                  /* x−□=z → x−z */
function E(x,op,y,z){return {x:x,op:op,y:y,z:z}}
/* 給兩個已知數 g1 g2 和答案 ans，列出所有可能的算式寫法（不出現負數），並標出對錯 */
function allForms(g1,g2,ans){var L=[],P=[[g1,g2],[g2,g1]];
  P.forEach(function(p){var a=p[0],b=p[1];
    L.push(E(a,'+',b,null));if(a>=b)L.push(E(a,'-',b,null));
    L.push(E(null,'+',a,b));L.push(E(a,'+',null,b));L.push(E(null,'-',a,b));if(a>=b)L.push(E(a,'-',null,b))});
  var seen={};return L.filter(function(e){var k=eqStr(e);if(seen[k])return false;seen[k]=1;return true}).map(function(e){e.ok=eqTrue(e,ans);e.s=eqStr(e);return e})}
/* 選項：canon 是課本寫法；alt=true 時再放一個也正確的寫法（加減關係） */
function eqOpts(canon,g1,g2,ans,alt){var all=allForms(g1,g2,ans),cs=eqStr(canon),c=all.filter(function(e){return e.s===cs})[0];
  if(!c){c=canon;c.ok=eqTrue(c,ans);c.s=cs;c.canon=true}
  c.canon=true;
  var wrong=all.filter(function(e){if(e.ok)return false;var f=eqEff(e),s=val(f.a,f.op,f.b);return s>=0&&s!==ans}),tempt=wrong.filter(function(e){return e.z===null}),other=wrong.filter(function(e){return e.z!==null});
  var out=[c];
  if(tempt.length)out.push(pick(tempt));
  var good=all.filter(function(e){return e.ok&&e.s!==cs});
  if(alt&&good.length){var g=pick(good);g.alt=true;out.push(g)}
  else if(other.length&&out.length<3)out.push(pick(other));
  if(out.length<2&&other.length)out.push(pick(other));
  return shuf(out).map(function(e){return {x:e.x,op:e.op,y:e.y,z:e.z,s:e.s,ok:!!e.ok,canon:!!e.canon,alt:!!e.alt}})}
/* 計算的小提示（進位、退位） */
function calcTip(a,op,b){var oa=a%10,ob=b%10,ta=Math.floor(a/10)%10,tb=Math.floor(b/10)%10;
  if(op==='+'){if(oa+ob>=10)return '個位 '+oa+' + '+ob+' = '+(oa+ob)+'，滿十要進 1 到十位喔！';
    if(ta+tb>=10)return '十位 '+ta+' + '+tb+' = '+(ta+tb)+'，滿十要進 1 到百位喔！';return '先算個位 '+oa+' + '+ob+'，再算十位。'}
  if(oa<ob)return '個位 '+oa+' 不夠減 '+ob+'，要向十位借 1 當 10：'+(oa+10)+' '+MI+' '+ob+' = '+(oa+10-ob)+'。';
  if(a>=100&&ta<tb)return '十位 '+ta+' 不夠減 '+tb+'，要向百位借 1。';
  return '先算個位 '+oa+' '+MI+' '+ob+'，再算十位。'}
function effTxt(f){return f.a+' '+(f.op==='+'?'+':MI)+' '+f.b}
/* ---------- 部分—全體（T = a + b）與比較（B = S + d） ---------- */
function fill(t,v){return t.replace(/\{(\w+)\}/g,function(m,k){return v[k]!==undefined?String(v[k]):m})}
function core(o){ /* o:{u,id,kind,unk,v,ctx,qs,q,lab,unit,bar,pic,check,rev} */
  var v=o.v,ans,g1,g2,canon,unk=o.unk;
  if(o.kind==='pw'){var T=v.T,a=v.a,b=v.b;
    if(unk==='T'){ans=T;g1=a;g2=b;canon=E(a,'+',b,null)}
    else if(unk==='a'){ans=a;g1=T;g2=b;canon=E(T,'-',b,null)}
    else {ans=b;g1=T;g2=a;canon=E(T,'-',a,null)}}
  else{var B=v.B,S=v.S,d=v.d;
    if(unk==='d'){ans=d;g1=B;g2=S;canon=E(B,'-',S,null)}
    else if(unk==='B'){ans=B;g1=S;g2=d;canon=E(S,'+',d,null)}
    else {ans=S;g1=B;g2=d;canon=E(B,'-',d,null)}}
  var roles=o.kind==='pw'?['T','a','b']:['B','S','d'];
  var askO=shuf(roles.map(function(r){return {t:fill(o.q[r],v),ok:r===unk}}));
  var P={u:o.u,id:o.id,kind:o.kind,unk:unk,v:v,ctx:fill(o.ctx,v),qs:fill(o.qs,v),unit:o.unit,ans:ans,nums:[g1,g2],
    steps:['ask','eq','calc'],ask:{opts:askO},eq:{opts:eqOpts(canon,g1,g2,ans,!!o.alt)},canon:eqStr(canon),rev:!!o.rev,
    lab:o.lab?(function(){var r={},k;for(k in o.lab)r[k]=fill(o.lab[k],v);return r})():null,bar:o.bar===false?null:o.kind,pic:o.pic||null};
  var f=eqEff(canon);P.eff=f;
  if(o.check){var c=f.op==='-'?{x:ans,op:'+',y:f.b,res:f.a}:{x:ans,op:'-',y:f.b,res:f.a};
    c.s=eqStr(E(c.x,c.op,c.y,null));c.cmp=f.a;P.check=c;P.steps.push('check')}
  P.steps.push('ans');P.ansQ=P.qs;
  P.why={ask:'題目最後一句問「'+P.qs+'」，要找的就是它喔！',eq:eqWhy(P,o),calc:calcTip(f.a,f.op,f.b)};
  P.key=o.id+'|'+unk+'|'+g1+'|'+g2;
  return P}
function eqWhy(P,o){var L=P.lab||{},v=P.v,u=P.unk;
  if(P.kind==='pw'){if(u==='T')return '要把兩個部分合起來，用加法：'+v.a+' 和 '+v.b+' 合起來。';
    return '全部是 '+v.T+'，知道其中一部分是 '+(u==='a'?v.b:v.a)+'，要找另一部分：全部 '+MI+' 部分。也可以想成「部分 + □ = 全部」。'}
  if(u==='d')return '要知道「多幾」，就用多的 '+MI+' 少的：'+v.B+' '+MI+' '+v.S+'。';
  if(u==='B')return '要找比較多的那一個，就是把 '+v.S+' 再加上多出來的 '+v.d+'。';
  return '要找比較少的那一個，就是從 '+v.B+' 拿掉多出來的 '+v.d+'。'+(o.rev?'小心！題目裡有「多」字，但是要找的那個比較少喔。':'')}
/* 數字範圍 */
function addPair(lo,hi,max,carry){for(var k=0;k<200;k++){var a=ri(lo,hi),b=ri(lo,hi);if(a+b>max)continue;var c=(a%10)+(b%10)>=10;if(carry===undefined||c===carry)return [a,b]}return [12,13]}
function subPair(lo,hi,borrow,minB){minB=minB||3;for(var k=0;k<200;k++){var T=ri(lo,hi),a=ri(Math.max(1,Math.floor(lo/3)),T-minB);if(a<1||T-a<minB)continue;var bw=(T%10)<(a%10);if(borrow===undefined||bw===borrow)return [T,a]}return [45,18]}
/* ---------- 單元 2、4：生活情境 ---------- */
function ctxPW(kind){var it=pick(ITEMS),nm=names2(),g=pick(GIVERS);
  var v={n:nm[0],n2:nm[1],it:it.it,un:it.un,vb:it.v,g:g,thing:pick(THINGS)};
  if(kind==='join')return {v:v,unit:it.un,
    ctx:{T:'{n}有 {a} {un}{it}，{n2}有 {b} {un}{it}。',a:'{n}和{n2}一共有 {T} {un}{it}，其中{n2}有 {b} {un}。',b:'{n}和{n2}一共有 {T} {un}{it}，其中{n}有 {a} {un}。'},
    qs:{T:'兩個人合起來有幾{un}？',a:'{n}有幾{un}？',b:'{n2}有幾{un}？'},q:{T:'兩個人合起來有幾{un}',a:'{n}有幾{un}',b:'{n2}有幾{un}'},lab:{T:'合起來',a:'{n}',b:'{n2}'}};
  if(kind==='add')return {v:v,unit:it.un,
    ctx:{T:'{n}原本有 {a} {un}{it}，{g}又給{n} {b} {un}。',b:'{n}原本有 {a} {un}{it}，{g}又給{n}一些，現在有 {T} {un}。',a:'{n}原本有一些{it}，{g}又給{n} {b} {un}，現在有 {T} {un}。'},
    qs:{T:'{n}現在有幾{un}？',b:'{g}給了幾{un}？',a:'{n}原本有幾{un}？'},q:{T:'現在有幾{un}',b:'{g}給了幾{un}',a:'原本有幾{un}'},lab:{T:'現在',a:'原本',b:'又給的'}};
  /* take */
  return {v:v,unit:it.un,
    ctx:{b:'{n}有 {T} {un}{it}，{vb}了 {a} {un}。',a:'{n}有 {T} {un}{it}，{vb}了一些，還剩下 {b} {un}。',T:'{n}有一些{it}，{vb}了 {a} {un}，還剩下 {b} {un}。'},
    qs:{b:'還剩下幾{un}？',a:'{vb}了幾{un}？',T:'{n}原本有幾{un}？'},q:{b:'還剩下幾{un}',a:'{vb}了幾{un}',T:'原本有幾{un}'},lab:{T:'原本',a:'{vb}',b:'剩下'}}}
function ctxMon(){var m=pick(MONS),pl=pick(['海拉魯平原上','營地裡','山洞裡','橋邊']);var v={m:m,pl:pl,un:'隻'};
  return {v:v,unit:'隻',ctx:{b:'{pl}有 {T} 隻{m}，林克打倒了 {a} 隻。',a:'{pl}有 {T} 隻{m}，林克打倒了一些，還剩下 {b} 隻。',T:'{pl}有一些{m}，林克打倒了 {a} 隻，還剩下 {b} 隻。'},
    qs:{b:'還剩下幾隻{m}？',a:'林克打倒了幾隻？',T:'原本有幾隻{m}？'},q:{b:'還剩下幾隻',a:'林克打倒了幾隻',T:'原本有幾隻'},lab:{T:'原本',a:'打倒',b:'剩下'}}}
function ctxBuy(){var nm=names2(),th=pick(THINGS);var v={n:nm[0],thing:th,un:'元'};
  return {v:v,unit:'元',ctx:{b:'{n}有 {T} 元，買了一個 {a} 元的{thing}。',a:'{n}有 {T} 元，買了一個{thing}以後，還剩下 {b} 元。',T:'{n}買了一個 {a} 元的{thing}，還剩下 {b} 元。'},
    qs:{b:'{n}還剩下幾元？',a:'{thing}是幾元？',T:'{n}原本有幾元？'},q:{b:'還剩下幾元',a:'{thing}是幾元',T:'原本有幾元'},lab:{T:'原本的錢',a:'{thing}',b:'剩下'}}}
function ctxPlace(){var p=pick(PLACES);var v={pl:p[0],un:p[1],it:p[2],v1:p[3],v2:p[4]};
  return {v:v,unit:p[1],ctx:{T:'{pl}{v1} {a} {un}{it}，{v2} {b} {un}。'},qs:{T:'一共有幾{un}？'},q:{T:'一共有幾{un}',a:'第一次有幾{un}',b:'後來有幾{un}'},lab:{T:'一共',a:'先',b:'後來'}}}
function ctxCmp(){var nm=names2(),it=pick(ITEMS);var v={n:nm[0],n2:nm[1],it:it.it,un:it.un};
  return {v:v,unit:it.un,ctx:{d:'{n}有 {B} {un}{it}，{n2}有 {S} {un}{it}。',B:'{n2}有 {S} {un}{it}，{n}比{n2}多 {d} {un}。',S:'{n}有 {B} {un}{it}，{n2}比{n}少 {d} {un}。',
    Sr:'{n}有 {B} {un}{it}，{n}比{n2}多 {d} {un}。',Br:'{n2}有 {S} {un}{it}，{n2}比{n}少 {d} {un}。'},
    qs:{d:'{n}比{n2}多幾{un}？',B:'{n}有幾{un}？',S:'{n2}有幾{un}？'},q:{d:'{n}比{n2}多幾{un}',B:'{n}有幾{un}',S:'{n2}有幾{un}'},lab:{B:'{n}',S:'{n2}',d:'多'}}}
function build(u,id,kind,unk,C,v,opt){opt=opt||{};var key=opt.ck||unk,x={},k;for(k in C.v)x[k]=C.v[k];for(k in v)x[k]=v[k];
  return core({u:u,id:id,kind:kind,unk:unk,v:x,ctx:C.ctx[key]+'',qs:C.qs[unk],q:C.q,lab:C.lab,unit:C.unit,check:opt.check,alt:opt.alt,rev:opt.rev,pic:opt.pic,bar:opt.bar})}
function vPW(T,a){return {T:T,a:a,b:T-a}}
function vCmp(B,S){return {B:B,S:S,d:B-S}}
/* 單元 2：二位數加減（直接算：合起來、拿走、比多少） */
function u2(check){var t=ri(0,5),p,C;
  if(t===0){p=addPair(10,99,198,R()<.5);C=ctxPW('join');return build(2,'join','pw','T',C,{a:p[0],b:p[1],T:p[0]+p[1]},{check:check})}
  if(t===1){p=addPair(10,99,198,R()<.5);C=ctxPW('add');return build(2,'add','pw','T',C,{a:p[0],b:p[1],T:p[0]+p[1]},{check:check})}
  if(t===2){p=subPair(R()<.3?100:30,R()<.3?199:99,R()<.5);C=R()<.4?ctxMon():ctxPW('take');return build(2,'take','pw','b',C,vPW(p[0],p[1]),{check:check})}
  if(t===3){p=subPair(30,100,R()<.5);C=ctxBuy();return build(2,'buy','pw','b',C,vPW(p[0],p[1]),{check:check})}
  if(t===4){p=addPair(10,99,198);C=ctxPlace();return build(2,'place','pw','T',C,{a:p[0],b:p[1],T:p[0]+p[1]},{check:check})}
  var B=ri(30,99),S=ri(10,B-5);C=ctxCmp();var w=pick(['d','B','S']);
  if(w==='d')return build(2,'cmp','cmp','d',C,vCmp(B,S),{check:check});
  if(w==='B'){S=ri(10,90);var d=ri(5,Math.min(60,198-S));return build(2,'cmp','cmp','B',C,{S:S,d:d,B:S+d},{check:check})}
  return build(2,'cmp','cmp','S',C,vCmp(B,S),{check:check})}
/* 單元 4：加減關係（倒過來想）＋ 4-2 解題和驗算 */
function u4(){var t=ri(0,6),p,C;
  if(t===6){var q=u2(true);q.u=4;q.id='chk'+q.id;q.key='chk'+q.key;return q}                  /* 4-2：解題，再驗算 */
  if(t===0){p=subPair(15,99,undefined,3);C=R()<.35?ctxMon():ctxPW('take');return build(4,'take','pw','a',C,vPW(p[0],p[1]),{alt:true,rev:true,check:R()<.35})}  /* 吃掉一些剩下 7 片，吃掉幾片 */
  if(t===1){p=subPair(15,99,undefined,3);C=ctxPW('take');return build(4,'take','pw','T',C,vPW(p[0],p[1]),{alt:true,rev:true,check:R()<.35})}  /* 原本有幾 */
  if(t===2){p=subPair(20,99,undefined,4);C=ctxPW('add');return build(4,'add','pw','b',C,{T:p[0],a:p[0]-p[1],b:p[1]},{alt:true,rev:true,check:R()<.35})}
  if(t===3){p=subPair(20,99,undefined,4);C=ctxPW('add');return build(4,'add','pw','a',C,{T:p[0],a:p[0]-p[1],b:p[1]},{alt:true,rev:true,check:R()<.35})}
  if(t===4){p=subPair(20,100,undefined,4);C=ctxBuy();return build(4,'buy','pw','a',C,vPW(p[0],p[1]),{alt:true,rev:true,check:R()<.35})}
  C=ctxCmp();var B=ri(25,99),S=ri(8,B-4);
  if(R()<.5)return build(4,'cmpr','cmp','S',C,vCmp(B,S),{ck:'Sr',rev:true,alt:true});   /* 比…多，求少的 */
  S=ri(10,90);var d=ri(4,Math.min(40,198-S));return build(4,'cmpr','cmp','B',C,{S:S,d:d,B:S+d},{ck:'Br',rev:true,alt:true})}
/* ---------- 單元 3：公分 ---------- */
var LPAIR=[['林克的劍','木棒'],['薩爾達的弓','林克的弓'],['鉛筆','蠟筆'],['紅緞帶','藍緞帶'],['木棒','竹棒'],['大毛毛蟲','小毛毛蟲'],['哥哥的跳繩','妹妹的跳繩']];
function u3(check){var t=ri(0,4),C,p;
  if(t===0){p=subPair(20,99,R()<.5,3);var c=pick(['一條','一捲','媽媽買的']);
    C={v:{c:c},unit:'公分',ctx:{b:'{c}緞帶長 {T} 公分，剪掉 {a} 公分。'},qs:{b:'還剩下幾公分？'},q:{b:'還剩下幾公分',T:'緞帶原來長幾公分',a:'剪掉幾公分'},lab:{T:'原來',a:'剪掉',b:'剩下'}};
    return build(3,'cut','pw','b',C,vPW(p[0],p[1]),{check:check})}
  if(t===1){p=addPair(8,60,120,R()<.5);
    C={v:{},unit:'公分',ctx:{T:'一條紅緞帶長 {a} 公分，一條藍緞帶長 {b} 公分，把兩條接起來（接的地方不重疊）。'},qs:{T:'一共長幾公分？'},q:{T:'接起來一共長幾公分',a:'紅緞帶長幾公分',b:'藍緞帶長幾公分'},lab:{T:'接起來',a:'紅',b:'藍'}};
    return build(3,'tie','pw','T',C,{a:p[0],b:p[1],T:p[0]+p[1]},{check:check})}
  if(t===2){var a=pick([10,15,20,30]),b=ri(3,a-1),nm=pick(NAMES),ob=pick(['書桌','窗戶','書架','白板']);
    C={v:{n:nm,ob:ob},unit:'公分',ctx:{T:'{n}用一把 {a} 公分長的尺量{ob}，量完一次 {a} 公分，後面還有 {b} 公分。'},qs:{T:'{ob}長幾公分？'},q:{T:'{ob}長幾公分',a:'尺長幾公分',b:'後面還有幾公分'},lab:{T:'{ob}',a:'尺量一次',b:'還有'}};
    return build(3,'ruler','pw','T',C,{a:a,b:b,T:a+b},{check:check,pic:'ruler'})}
  if(t===3){p=addPair(5,60,120);var fr=pick(['小青蛙','小兔子','林克']);
    C={v:{f:fr},unit:'公分',ctx:{T:'{f}第一次跳了 {a} 公分，第二次又往前跳了 {b} 公分。'},qs:{T:'兩次一共跳了幾公分？'},q:{T:'兩次一共跳了幾公分',a:'第一次跳了幾公分',b:'第二次跳了幾公分'},lab:{T:'一共',a:'第一次',b:'第二次'}};
    return build(3,'jump','pw','T',C,{a:p[0],b:p[1],T:p[0]+p[1]},{check:check})}
  var lp=pick(LPAIR),B=ri(12,99),S=ri(5,B-3),w=pick(['d','d','B','S']);
  C={v:{X:lp[0],Y:lp[1]},unit:'公分',ctx:{d:'{X}長 {B} 公分，{Y}長 {S} 公分。',B:'{Y}長 {S} 公分，{X}比{Y}長 {d} 公分。',S:'{X}長 {B} 公分，{Y}比{X}短 {d} 公分。'},
    qs:{d:'{X}比{Y}長幾公分？',B:'{X}長幾公分？',S:'{Y}長幾公分？'},q:{d:'{X}比{Y}長幾公分',B:'{X}長幾公分',S:'{Y}長幾公分'},lab:{B:'{X}',S:'{Y}',d:'長'}};
  if(w==='B'){S=ri(5,80);var d=ri(3,40);return build(3,'lcmp','cmp','B',C,{S:S,d:d,B:S+d},{check:check})}
  return build(3,'lcmp','cmp',w,C,vCmp(B,S),{check:check})}
/* ---------- 單元 5：容量（同樣的杯子） ---------- */
var CPAIR=[['藍水缸','紅水缸','個水缸','在卓拉領地，'],['甲瓶','乙瓶','瓶'],['綠水壺','黃水壺','個水壺'],['紅水桶','藍水桶','個水桶'],['A 鍋','B 鍋','個鍋子']];
function u5(){var t=ri(0,4),cp=pick(CPAIR),B=ri(4,18),S=ri(2,B-1),C;
  var pre=(cp[3]||'')+'用同樣大小的杯子倒水，';
  if(t<=1){var more=t===0,X=more?cp[0]:cp[1];var a=R()<.5;var v1=a?B:S,v2=a?S:B,n1=cp[0],n2=cp[1];
    var big=v1>v2?n1:n2,small=v1>v2?n2:n1;
    var P={u:5,id:'cupwho',kind:'choice',ctx:pre+n1+'裝滿可以倒 '+v1+' 杯，'+n2+'裝滿可以倒 '+v2+' 杯。',qs:'哪一'+cp[2].replace(/^個/,'個')+'裝的水比較'+(more?'多':'少')+'？',
      unit:'',steps:['ask','ans'],nums:[v1,v2],v:{n1:n1,n2:n2,v1:v1,v2:v2},pic:'cups',bar:null};
    P.ask={opts:shuf([{t:'哪一'+cp[2]+'裝的水比較'+(more?'多':'少'),ok:true},{t:'兩'+cp[2].replace(/^個/,'個')+'一共可以倒幾杯',ok:false},{t:(more?big:small)+'比'+(more?small:big)+'多幾杯',ok:false}])};
    P.ans={type:'choice',opts:shuf([{t:n1,ok:(more?big:small)===n1},{t:n2,ok:(more?big:small)===n2}]),post:'裝的水比較'+(more?'多':'少')};
    P.why={ask:'題目最後一句問「'+P.qs+'」，要找的就是它喔！',ans:'倒的杯數越多，裝的水就越多。'+n1+' '+v1+' 杯、'+n2+' '+v2+' 杯，'+(v1>v2?v1+' 比 '+v2+' 多':v2+' 比 '+v1+' 多')+'。'};
    P.key='cupwho|'+n1+'|'+v1+'|'+v2+'|'+(more?1:0);P.ansV=(more?big:small);return P}
  var pv={X:cp[0],Y:cp[1]};
  if(t===2){C={v:pv,unit:'杯',ctx:{d:pre+'{X}裝滿可以倒 {B} 杯，{Y}裝滿可以倒 {S} 杯。'},qs:{d:'{X}比{Y}多裝幾杯水？'},q:{d:'{X}比{Y}多裝幾杯',B:'{X}可以倒幾杯',S:'{Y}可以倒幾杯'},lab:{B:'{X}',S:'{Y}',d:'多'}};
    return build(5,'cupd','cmp','d',C,vCmp(B,S),{pic:'cups'})}
  if(t===3){var a=ri(3,15),b=ri(2,15);C={v:pv,unit:'杯',ctx:{T:pre+'{X}裝滿可以倒 {a} 杯，{Y}裝滿可以倒 {b} 杯。'},qs:{T:'兩個合起來一共可以倒幾杯？'},q:{T:'合起來一共可以倒幾杯',a:'{X}可以倒幾杯',b:'{Y}可以倒幾杯'},lab:{T:'合起來',a:'{X}',b:'{Y}'}};
    return build(5,'cupt','pw','T',C,{a:a,b:b,T:a+b},{pic:'cups'})}
  var T=ri(8,20),x=ri(2,T-2);var ct=pick(['水桶','大水壺','魚缸']);
  C={v:{c:ct},unit:'杯',ctx:{b:'{c}裝滿水可以倒 {T} 杯，已經倒出 {a} 杯了。'},qs:{b:'還可以再倒幾杯？'},q:{b:'還可以再倒幾杯',T:'裝滿可以倒幾杯',a:'已經倒出幾杯'},lab:{T:'裝滿',a:'倒出',b:'還可以倒'}};
  return build(5,'cupb','pw','b',C,vPW(T,x),{pic:'cups'})}
/* ---------- 單元 1：200 以內的數 ---------- */
function u1(){var t=ri(0,5);
  if(t===0){var h=1,te=ri(0,9),o=ri(0,9);if(R()<.25){h=0;te=ri(2,9)}var n=h*100+te*10+o;if(n<20)n=147,h=1,te=4,o=7;
    var place=pick(['寶箱','神廟的大門','冒險地圖']);
    var P={u:1,id:'pv',kind:'num',ctx:place+'上寫著密碼：'+(h?h+' 個百、':'')+te+' 個十、'+o+' 個一。',qs:'合起來是多少？',unit:'',ans:n,nums:[h,te,o],steps:['ask','calc','ans'],
      ask:{opts:shuf([{t:'合起來是多少',ok:true},{t:'有幾個十',ok:false},{t:'有幾個一',ok:false}])},calc:{s:(h?h+' 個百、':'')+te+' 個十、'+o+' 個一 → '+BOX,r:n}};
    P.why={ask:'題目最後一句問「合起來是多少？」',calc:(h?h+' 個百是 100，':'')+te+' 個十是 '+te*10+'，'+o+' 個一是 '+o+'。'+(h?'100 + ':'')+te*10+' + '+o+' = '+n+'。'};
    P.ansPre='答：合起來是';P.key='pv|'+n;return P}
  if(t===1){var cs=[100,50,10,5,1],cnt,tot,k;
    for(k=0;k<100;k++){cnt=[ri(0,1),ri(0,1),ri(0,4),ri(0,2),ri(0,5)];tot=cnt[0]*100+cnt[1]*50+cnt[2]*10+cnt[3]*5+cnt[4];if(tot>=20&&tot<=200&&cnt.filter(function(c){return c>0}).length>=3)break}
    var nm=pick(NAMES),parts=[],run=0,rs=[];cs.forEach(function(c,i){if(cnt[i]){parts.push(c+' 元 '+cnt[i]+' 個');for(var j=0;j<cnt[i];j++){run+=c}rs.push(run)}});
    var P={u:1,id:'coin',kind:'num',ctx:nm+'的錢包裡有：'+parts.join('、')+'。',qs:nm+'一共有幾元？',unit:'元',ans:tot,nums:cnt.slice(),coins:cnt,steps:['ask','calc','ans'],pic:'coins',
      ask:{opts:shuf([{t:'一共有幾元',ok:true},{t:'一共有幾個錢幣',ok:false},{t:'最大的錢幣是幾元',ok:false}])},calc:{s:'一共 '+BOX+' 元',r:tot}};
    P.why={ask:'題目最後一句問「'+P.qs+'」，要算的是錢有幾元。',calc:'從大的開始數：'+rs.join('、')+' 元。'};P.key='coin|'+cnt.join(',');return P}
  if(t===2){var a,b;do{a=ri(100,199);b=pick([a+ri(1,9),a-ri(1,9),Math.floor(a/100)*100+(a%10)*10+Math.floor(a/10)%10,a+ri(10,40)])}while(b===a||b<100||b>200);
    var nm2=names2(),more=R()<.6,IT=pick([['星星','顆'],['貝殼','個'],['金色葉子','片'],['貼紙','張']]),it=IT[0],cw=IT[1];
    var big=a>b?nm2[0]:nm2[1],small=a>b?nm2[1]:nm2[0];
    var P={u:1,id:'big',kind:'choice',ctx:nm2[0]+'收集了 '+a+' '+cw+it+'，'+nm2[1]+'收集了 '+b+' '+cw+it+'。',qs:'誰收集的比較'+(more?'多':'少')+'？',unit:'',nums:[a,b],steps:['ask','ans'],
      ask:{opts:shuf([{t:'誰收集的比較'+(more?'多':'少'),ok:true},{t:'兩人一共收集了幾'+cw,ok:false},{t:'多幾'+cw,ok:false}])},
      ans:{type:'choice',opts:shuf([{t:nm2[0],ok:(more?big:small)===nm2[0]},{t:nm2[1],ok:(more?big:small)===nm2[1]}]),post:'收集的比較'+(more?'多':'少')}};
    var pa=String(a),pb=String(b),i=0;while(pa[i]===pb[i])i++;var pn=['百','十','個'][i];
    P.why={ask:'題目最後一句問「'+P.qs+'」',ans:'先比百位，再比十位，最後比個位。'+a+' 和 '+b+' '+(i===1?'百位一樣，':i===2?'百位和十位都一樣，':'')+pn+'位是 '+pa[i]+' 和 '+pb[i]+'，'+Math.max(+pa[i],+pb[i])+' 比較大。'};
    P.key='big|'+a+'|'+b+'|'+(more?1:0);P.ansV=more?big:small;return P}
  if(t===3){var plus=R()<.5,dd=pick([10,10,10,1]),X=plus?ri(100,199-dd):ri(100+dd,199);
    if(R()<.5){var C0={v:{},unit:'',ctx:{B:'林克在石板上看到 {S}。',S:'林克在石板上看到 {B}。'},qs:{B:'比 {S} 多 {d} 的數是多少？',S:'比 {B} 少 {d} 的數是多少？'},
        q:{B:'比 {S} 多 {d} 的數',S:'比 {B} 少 {d} 的數',d:'{S} 和 {B} 差多少'}};
      var P0=plus?build(1,'pm','cmp','B',C0,{S:X,d:dd,B:X+dd},{bar:false}):build(1,'pm','cmp','S',C0,{B:X,d:dd,S:X-dd},{bar:false});P0.ansPre='答：這個數是';var X0=X,op0=plus?'多':'少',op1=plus?'少':'多';
      P0.ask={opts:shuf([{t:'比 '+X0+' '+op0+' '+dd+' 的數',ok:true},{t:'比 '+X0+' '+op1+' '+dd+' 的數',ok:false},{t:X0+' 的十位是幾',ok:false}])};return P0}
    var C1=ctxCmp();return plus?build(1,'pmc','cmp','B',C1,{S:X,d:dd,B:X+dd}):build(1,'pmc','cmp','S',C1,{B:X,d:dd,S:X-dd})}
  return riddle()}
var CL={
  tlo:{t:'十位的數字比個位的數字小',f:function(m){return T10(m)<m%10}},
  tgt:{t:'十位的數字比個位的數字大',f:function(m){return T10(m)>m%10}},
  teq:{t:'十位和個位的數字一樣',f:function(m){return T10(m)===m%10}},
  even:{t:'個位是雙數',f:function(m){return m%2===0}},
  odd:{t:'個位是單數',f:function(m){return m%2===1}},
  sum:{t:'十位和個位的數字加起來是 {s}',f:function(m,s){return T10(m)+m%10===s}}};
function T10(m){return Math.floor(m/10)%10}
function clueOK(c,m){return CL[c.k].f(m,c.s)}
function clueTxt(c){return CL[c.k].t.replace('{s}',c.s)}
function riddle(){for(var tr=0;tr<500;tr++){var n=R()<.8?ri(110,195):ri(25,95),lo=n-ri(2,6),hi=n+ri(2,6);if(hi>200)continue;
    var cand=[];for(var m=lo+1;m<hi;m++)cand.push(m);if(cand.length<5)continue;
    var pool=Object.keys(CL).map(function(k){return {k:k,s:k==='sum'?T10(n)+n%10:undefined}}).filter(function(c){return clueOK(c,n)});
    var cs=shuf(pool).slice(0,ri(1,2)),ok=cand.filter(function(m){return cs.every(function(c){return clueOK(c,m)})});
    if(ok.length!==1)continue;
    var all=[{k:'rng',t:'比 '+lo+' 大，比 '+hi+' 小'}].concat(cs.map(function(c){return {k:c.k,s:c.s,t:clueTxt(c)}}));
    var P={u:1,id:'riddle',kind:'riddle',ctx:pick(['薩爾達','林克'])+'在神廟的石板上，發現神秘數字的線索：',clues:all,qs:'這個數是多少？',unit:'',ans:n,nums:[lo,hi],cand:cand,lo:lo,hi:hi,steps:['pick','ans'],ansPre:'答：這個數是'};
    P.why={pick:'一條一條檢查：先看第 ① 條，把範圍裡的數排好，再用下一條線索把不對的刪掉。'};P.key='riddle|'+lo+'|'+hi+'|'+cs.map(function(c){return c.k+(c.s||'')}).join(',');return P}
  return null}
function riddleWhy(P,m){var bad=[];P.clues.forEach(function(c,i){var ok=c.k==='rng'?(m>P.lo&&m<P.hi):clueOK(c,m);if(!ok)bad.push(i)});return bad}
/* ---------- 對外 ---------- */
var GEN={1:u1,2:function(){return u2(R()<.25)},3:function(){return u3(R()<.25)},4:u4,5:u5};
function sp(s){return typeof s==='string'?s.replace(/([A-Za-z])([\u4e00-\u9fff])/g,'$1 $2').replace(/([\u4e00-\u9fff])([A-Za-z])/g,'$1 $2'):s}
function tidy(p){['ctx','qs','ansQ'].forEach(function(k){p[k]=sp(p[k])});if(p.ask)p.ask.opts.forEach(function(o){o.t=sp(o.t)});if(p.ans&&p.ans.opts)p.ans.opts.forEach(function(o){o.t=sp(o.t)});
  p.ansQ=p.ansQ||p.qs;if(p.ansV)p.ansV=sp(p.ansV);if(p.why)for(var k in p.why)p.why[k]=sp(p.why[k]);if(p.lab)for(var j in p.lab)p.lab[j]=sp(p.lab[j]);return p}
function make(u){var p=null,k=0;while(!p&&k<20){p=GEN[u]();k++}return tidy(p)}
function round(units,n,avoid){units=(units||READY).filter(function(u){return GEN[u]});if(!units.length)units=READY;var out=[],seen={},bag=[],k=0;avoid=avoid||{};
  while(out.length<n&&k<200){k++;if(!bag.length)bag=shuf(units);var u=bag.pop(),p=make(u);if(!p||seen[p.key]||avoid[p.key])continue;
    var sameId=out.filter(function(x){return x.id===p.id}).length;if(sameId>=2&&k<150)continue;seen[p.key]=1;out.push(p)}
  return out}
/* 答案檢查：回傳 'ok' | 'check'（填成驗算的結果） | 'given'（填成題目裡的數） | 'op'（用錯加減） | 'no' */
function ansKind(P,v,checked){v=+v;if(P.ans===undefined)return 'no';if(v===P.ans)return 'ok';
  if(checked&&P.check&&v===P.check.res)return 'check';
  if((P.nums||[]).indexOf(v)>=0)return 'given';
  if(P.eff){var w=P.eff.op==='+'?P.eff.a-P.eff.b:P.eff.a+P.eff.b;if(v===w)return 'op'}
  return 'no'}
function ansHint(P,kind){var q='「'+P.ansQ+'」';
  if(kind==='check')return '這是驗算的結果喔！驗算只是用來檢查的。題目問的是'+q+'，答案是你一開始算出來的那個數。';
  if(kind==='given')return '這個數是題目裡本來就有的喔！題目問的是'+q+'？';
  if(kind==='op')return '想一想：要用加法還是減法？題目問的是'+q+'。';
  return '再看一次上面算出來的數，題目問的是'+q+'。'}
function speakText(P){var t=P.ctx+(P.clues?P.clues.map(function(c,i){return '第'+(i+1)+'條，'+c.t+'。'}).join(''):'')+P.qs;
  return t.replace(/□/g,'多少').replace(/−/g,'減').replace(/\+/g,'加').replace(/Brie/g,'布莉')}
var api={setRand:setRand,UNITS:UNITS,READY:READY,make:make,round:round,eqTrue:eqTrue,eqStr:eqStr,eqEff:eqEff,allForms:allForms,ansKind:ansKind,ansHint:ansHint,
  calcTip:calcTip,effTxt:effTxt,riddleWhy:riddleWhy,clueOK:clueOK,speakText:speakText,GEN:GEN,MI:MI,BOX:BOX,_u:{build:build,ctxBuy:ctxBuy,ctxCmp:ctxCmp,ctxPW:ctxPW,ctxMon:ctxMon,tidy:tidy,u1:u1,u2:u2,u3:u3,u4:u4,u5:u5,riddle:riddle}};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.QG=api;
})(this);
