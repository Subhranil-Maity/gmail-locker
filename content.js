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
        background: rgba(255, 255, 255, 0.97);
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
    </style>
    <div class="lock-wrapper">
      <h2>🔒 Protected Gmail Account</h2>
      <input id="lock-pass-bs" type="password" placeholder="Enter password"/>
      <button id="unlock-bs">Unlock</button>
    </div>
  `;

  document.body.appendChild(overlayHost);

  // Bind button logic
  const unlockBtn = shadow.getElementById("unlock-bs");
  const passInput = shadow.getElementById("lock-pass-bs");

 unlockBtn.addEventListener("click", () => {
	const entered = passInput.value.trim();

	chrome.storage.local.get(["locks"], (data) => {
		if (data.locks && data.locks[emailToProtect] === entered) {
			setEmailUnlocked(emailToProtect); // ✅ store unlocked state
			overlayHost.remove();
		} else {
			alert("Wrong password");
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

