import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, push, onChildAdded, query, orderByChild } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC_ubzElTVeAHaYY3jj0quftpkydFiS4OY",
  authDomain: "soulmates-b4991.firebaseapp.com",
  projectId: "soulmates-b4991",
  storageBucket: "soulmates-b4991.firebasestorage.app",
  messagingSenderId: "876785340113",
  appId: "1:876785340113:web:0f2145842bc722a2d6bff0",
  measurementId: "G-MMRR4X04CG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

const users = {
  "Dia": "#ffa53b",
  "Maroun": "#f4592f"
};

function notifyBrowser(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

function getUserData() {
  let username = localStorage.getItem('username');
  let userGroup = localStorage.getItem('userGroup');

  if (!username) {
    username = prompt("Hello! Enter your username:")?.trim();
    while (!username) {
      username = prompt("Why didn't you enter a username? :( Please enter your username:")?.trim();
    }
    localStorage.setItem('username', username);
  }

  if (!userGroup) {
    userGroup = prompt("Are you Dia or Maroun?");
    while (userGroup !== "Dia" && userGroup !== "Maroun") {
      userGroup = prompt("Nope! Only Dia or Maroun can access:");
    }
    localStorage.setItem('userGroup', userGroup);
  }

  return { username, userGroup };
}

document.addEventListener('DOMContentLoaded', () => {
  if (Notification.permission === "default") {
    Notification.requestPermission();
  }

  const userData = getUserData();
  const messagesDiv = document.getElementById('messages');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
      push(ref(db, "messages"), {
        username: userData.username,
        userGroup: userData.userGroup,
        text: message,
        timestamp: Date.now()
      });
      messageForm.reset();
    }
  });

  const messagesQuery = query(ref(db, "messages"), orderByChild("timestamp"));
  onChildAdded(messagesQuery, (snapshot) => {
    const msg = snapshot.val();
    addMessage(msg.username, msg.userGroup, msg.text, msg.username !== userData.username);
  });

  function addMessage(username, userGroup, text, checkNotify = true) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.style.backgroundColor = users[userGroup] || "#ffa53b";
    div.innerHTML = `<strong>${username}:</strong> ${text}`;
    messagesDiv.insertBefore(div, messagesDiv.firstChild);

    if (checkNotify) {
      notifyBrowser("New love letter 💌", `${username} sent you a letter!`);
    }
    messagesDiv.scrollTop = 0;
  }
});
