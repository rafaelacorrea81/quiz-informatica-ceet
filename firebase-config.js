// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBFcsAx2k0QhFphhC1ODzNiT4dQyIDGHLs",
    authDomain: "quiz-informatica-ceet.firebaseapp.com",
    projectId: "quiz-informatica-ceet",
    storageBucket: "quiz-informatica-ceet.firebasestorage.app",
    messagingSenderId: "400446802950",
    appId: "1:400446802950:web:3221d98a5131260e9a4787",
    measurementId: "G-KBMV38KD86"
};

let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase inicializado com sucesso.");
} catch (error) {
    console.error("Erro ao inicializar Firebase:", error);
}

export { db, collection, addDoc, onSnapshot, query, orderBy };