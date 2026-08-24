/* REALYNK migration: move older local properties into the shared Firestore network once. */
import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig);const auth=getAuth(app),db=getFirestore(app);
(async()=>{try{const u=auth.currentUser||(await signInAnonymously(auth)).user;let list=[];try{list=JSON.parse(localStorage.getItem("realynkProperties")||"[]")}catch{};const p=(()=>{try{return JSON.parse(localStorage.getItem("realynkBrokerProfile")||"{}")}catch{return {}}})();if(!u||!Array.isArray(list)||!list.length)return;for(const x of list.slice(0,30)){if(!x?.id)continue;await setDoc(doc(db,"properties",String(x.id)),{...x,brokerUid:x.brokerUid||u.uid,brokerName:x.brokerName||p.agentName||"Realynk Broker",brokerPhone:x.brokerPhone||p.accountPhone||x.phone||"",description:x.description||x.desc||"",status:x.status||"active"},{merge:true})}localStorage.setItem("realynkCloudMigrationV1","1")}catch(e){console.warn("Realynk migration",e)}})();
