import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDKGrC-hWe6Uzzgs7MjzcKbFS1R5YdF-xE",
    authDomain: "databake-f49f1.firebaseapp.com",
    projectId: "databake-f49f1",
    storageBucket: "databake-f49f1.firebasestorage.app",
    messagingSenderId: "441330264623",
    appId: "1:441330264623:web:de0fd86c88c78935ce34da",
    measurementId: "G-FW0YCHBYV8"
  };

  const app = initializeApp(firebaseConfig);

  export default app;