function getLoggedInEmail() {
	return document.title.match(/([a-zA-Z0-9._%+-]+@gmail\.com)/)?.[1] || null;
}
var isGmailLocked = false;
var inMemoryStorage = new Map();
function isEmailUnlocked(email) {
	// return sessionStorage.getItem("unlocked_" + email) === "true";
	return inMemoryStorage.get(email) === true;
}

function setEmailUnlocked(email) {
	// sessionStorage.setItem("unlocked_" + email, "true");
	inMemoryStorage.set(email, true);
}

function lockScreen(emailToProtect) {
	// Prevent multiple overlays
	if (document.getElementById("gmail-lock-overlay")) {
		console.log("Overlay already exists — skipping reinjection");
		return;
	}

	const overlayHost = document.createElement("div");
	overlayHost.id = "gmail-lock-overlay";
	overlayHost.style = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    z-index: 999999;
  `;

	const shadow = overlayHost.attachShadow({ mode: "open" });

	shadow.innerHTML = `
    <style>
      .lock-wrapper {
        width: 100vw;
        height: 100vh;
        background: rgba(255, 255, 255, 0.99);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: sans-serif;
      }
      input, button {
        font-size: 16px;
        margin-top: 8px;
        padding: 6px 12px;
      }
			button {
				border: 1px solid rgba(27, 31, 35, .15);
  			border-radius: 6px;
			}
			input[type="password"] {
  			padding: 10px 14px;
  			font-size: 16px;
  			border: 1px solid #ccc;
  			border-radius: 12px;
  			outline: none;
  			width: 250px;
  			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  			transition: all 0.2s ease;
  			background-color: #fff;
			}

			input[type="password"]:focus {
  			border-color: #4A90E2;
  			box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
			}
	@keyframes horizontal-shaking {
 0% { transform: translateX(0) }
 25% { transform: translateX(5px) }
 50% { transform: translateX(-5px) }
 75% { transform: translateX(5px) }
 100% { transform: translateX(0) }
}
			#logout-bs {
				background-color: #f44336;
				color: white;
			}
			#unlock-bs {
				background-color: #4CAF50;
				color: white;
			}
			.shake{
				animation: horizontal-shaking 0.5s ease-in-out infinite;
			}
			#wrong-pass-bs {
				color: red;
				margin-top: 10px;
				font-size: 14px;
			}
    </style>
    <div class="lock-wrapper">
      <h2>🔒 Protected Gmail Account</h2>
      <input id="lock-pass-bs" type="password" placeholder="Enter password"/>
			<div hidden id="wrong-pass-bs">The password you have entered is worng</div>
			<div>
				<button id="logout-bs">Logout</button>
				<button id="unlock-bs">Unlock</button>
			</div>
    </div>
  `;

	document.body.appendChild(overlayHost);

	// Bind button logic
	const unlockBtn = shadow.getElementById("unlock-bs");
	const passInput = shadow.getElementById("lock-pass-bs");
	const logoutBtn = shadow.getElementById("logout-bs");
	const wrongPassMsg = shadow.getElementById("wrong-pass-bs");


	logoutBtn.addEventListener("click", () => {
		window.location.href = "https://mail.google.com/mail/logout";
	});

	unlockBtn.addEventListener("click", () => {
		const entered = passInput.value.trim();

		chrome.storage.local.get(["locks"], (data) => {
			if (data.locks && data.locks[emailToProtect] === entered) {
				setEmailUnlocked(emailToProtect); // ✅ store unlocked state
				overlayHost.remove();
			} else {
				// alert("Wrong password");
				wrongPassMsg.hidden = false; // Show error message
				unlockBtn.classList.remove("shake"); // Reset if already applied
				void unlockBtn.offsetWidth; // Force reflow so animation can re-run
				unlockBtn.classList.add("shake");
				setTimeout(() => {
					unlockBtn.classList.remove("shake");
				}, 500);
			}
		});
	});

}


function checkAndLock() {
	const email = getLoggedInEmail();
	if (!email || isEmailUnlocked(email)) return;

		chrome.storage.local.get(["locks"], (data) => {
			if (data.locks && data.locks[email]) {
				lockScreen(email);
			}
		});
}

// Gmail is dynamic, so observe title changes
const titleObserver = new MutationObserver(() => {
	console.log("[Extension] Title changed. Re-checking Gmail...");
	checkAndLock();
});
titleObserver.observe(document.querySelector("title"), { childList: true });
// Wait a moment after page loads
setTimeout(checkAndLock, 2000);

