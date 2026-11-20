(function(){
var C=window.SK_FIREBASE,OWN=!!window.SK_OWNER,on=!!(C&&C.apiKey&&C.apiKey.indexOf("PASTE")<0&&window.firebase),db=null,au=null;
if(on){try{firebase.initializeApp(C);db=firebase.firestore();au=firebase.auth()}catch(e){on=false}}
var none=Promise.resolve([]),ready=Promise.resolve(null);
if(on){ready=new Promise(function(res){au.onAuthStateChanged(function(u){if(u)res(u);else if(!OWN)au.signInAnonymously().catch(function(){res(null)})})})}
function gate(){
 var d=document.createElement("div");d.style.cssText="position:fixed;inset:0;z-index:9999;background:#0b0b0b;color:#fff;display:flex;align-items:center;justify-content:center;font-family:sans-serif";
 d.innerHTML='<form style="display:grid;gap:10px;width:min(320px,90vw)"><h2 style="margin:0">Owner login</h2><input id="oe" type="email" placeholder="Owner email" style="padding:12px;border-radius:8px;border:0"><input id="op" type="password" placeholder="Password" style="padding:12px;border-radius:8px;border:0"><button style="padding:12px;border:0;border-radius:8px;background:#5cc47a;font-weight:700">Login</button><small id="oer" style="color:#f88"></small></form>';
 document.body.appendChild(d);
 d.querySelector("form").onsubmit=function(e){e.preventDefault();au.signInWithEmailAndPassword(d.querySelector("#oe").value.trim(),d.querySelector("#op").value).then(function(){d.remove()}).catch(function(){d.querySelector("#oer").textContent="Wrong email or password"})};
 return d}
if(on&&OWN){document.addEventListener("DOMContentLoaded",function(){var g=null;au.onAuthStateChanged(function(u){if(u&&u.email){if(g){g.remove();g=null}}else if(!g)g=gate()})})}
window.SK={on:on,
 save:function(o){if(!on)return none;return ready.then(function(u){if(!u)return;return db.collection("orders").doc(String(o.no)).set(Object.assign({},o,{uid:u.uid}))}).catch(function(){})},
 mine:function(){if(!on)return none;return ready.then(function(u){if(!u)return[];return db.collection("orders").where("uid","==",u.uid).get()}).then(function(s){return s.docs?s.docs.map(function(d){return d.data()}).sort(function(a,b){return b.at-a.at}):[]}).catch(function(){return[]})},
 watch:function(cb){if(!on)return;var un=null;au.onAuthStateChanged(function(u){if(un){un();un=null}if(u&&u.email)un=db.collection("orders").onSnapshot(function(s){cb(s.docs.map(function(d){return d.data()}))},function(){})})},
 setS:function(no,s,x){if(on)db.collection("orders").doc(String(no)).update(Object.assign({s:s},x||{})).catch(function(){})}
};})();
