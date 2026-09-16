/* REALYNK PAYMENT ADAPTER V1 — modular Firebase bridge for earning flow */
import { getApps, initializeApp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { getFirestore, collection, doc, setDoc } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
if(!window.__REALYNK_PAYMENT_ADAPTER_V1__){
 window.__REALYNK_PAYMENT_ADAPTER_V1__=true;
 const app=getApps().length?getApps()[0]:initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
 const adapter={auth:()=>auth,firestore:()=>({collection:(name)=>({doc:(id)=>({set:(data)=>setDoc(doc(collection(db,name),id),data)})})})};
 if(!window.firebase)window.firebase=()=>adapter;
 window.realynkPaymentCore={auth,db,ready:true};
 onAuthStateChanged(auth,u=>{window.realynkPaymentCore.currentUser=u||null;});
}
