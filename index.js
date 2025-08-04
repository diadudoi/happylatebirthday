document.addEventListener('DOMContentLoaded', () => {
    const FORCE_ASK_USERNAME = true;

    const users = {
        "Dia": "#ffa53b",
        "Maroun": "#f4592f"
    };

    // Ask for notification permission early
    if (Notification.permission === "default") {
        Notification.requestPermission();
    }

    function notifyBrowser(title, body) {
        if (Notification.permission === "granted") {
            new Notification(title, { body });
        }
    }

    function getUserData() {
        if (FORCE_ASK_USERNAME) {
            localStorage.removeItem('username');
            localStorage.removeItem('userGroup');

            let username = prompt("Hello! Enter your username:")?.trim();
            while (!username) {
                username = prompt("Why didn't you enter a username? :( Please enter your username:")?.trim();
            }

            let userGroup = prompt("Are you Dia or Maroun?");
            while (userGroup !== "Dia" && userGroup !== "Maroun") {
                userGroup = prompt("Nope! Only Dia or Maroun can access:");
            }

            return { username, userGroup };
        } else {
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
    }

    const userData = getUserData();

    const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    const messagesDiv = document.getElementById('messages');
    savedMessages.forEach(msg => {
        addMessage(msg.username, msg.userGroup, msg.text, false); // no notify on load
    });

    document.getElementById('messageForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const message = document.getElementById('messageInput').value.trim();
        if (message) {
            const msgObj = {
                username: userData.username,
                userGroup: userData.userGroup,
                text: message
            };
            savedMessages.push(msgObj);
            localStorage.setItem('messages', JSON.stringify(savedMessages));
            addMessage(userData.username, userData.userGroup, message, true);
            this.reset();
        }
    });

    function addMessage(username, userGroup, text, checkNotify = true) {
        const div = document.createElement('div');
        div.classList.add('message');
        div.style.backgroundColor = users[userGroup] || "#ffa53b";
        div.innerHTML = `<strong>${username}:</strong> ${text}`;
        messagesDiv.insertBefore(div, messagesDiv.firstChild);

        // Notify only if the sender is not the current user and we're not just loading old messages
        if (checkNotify && username !== userData.username) {
            notifyBrowser("New love letter 💌", `${username} sent you a letter!`);
        }
    }
});