import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBE1Qnm22zYM8vZoRjiBhSa2rei8oWIafY",
  authDomain: "taskflow-3c113.firebaseapp.com",
  projectId: "taskflow-3c113",
  storageBucket: "taskflow-3c113.appspot.com",
  messagingSenderId: "577726964881",
  appId: "1:577726964881:web:9b83998df4153178890b30",
  measurementId: "G-W3NYYEK50K"
};

//Initialize Firebase
if( firebase.app.length ) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
