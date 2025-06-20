function getLoggedInEmail() {
  return document.title.match(/([a-zA-Z0-9._%+-]+@gmail\.com)/)?.[1] || null;
}
var isLocked = false;

function lockScreen(emailToProtect) {
  const overlay = document.createElement("div");
  overlay.id = "gmail-lock-overlay";
  overlay.style = `position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;
    background:rgba(255,255,255,0.99);display:flex;flex-direction:column;
    align-items:center;justify-content:center;font-family:sans-serif;`;
  overlay.innerHTML = `
    <div>
      <h2>🔒 Protected Gmail Account</h2>
      <!-- <h2>This Gmail is locked</h2> -->
      <input id="lock-pass" type="password" placeholder="Enter password"/>
      <button id="unlock">Unlock</button>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("unlock").addEventListener("click", () => {
    const entered = document.getElementById("lock-pass").value.trim();
    chrome.storage.local.get(["locks"], (data) => {
      if (data.locks && data.locks[emailToProtect] === entered) {
        // sessionStorage.setItem("unlocked", "true");
				isLocked = false;
        overlay.remove();
      } else {
        alert("Wrong password");
      }
    });
  });
}

const checkAndLock = () => {
  const email = getLoggedInEmail();
  // if (!email || sessionStorage.getItem("unlocked") === "true") return;
  if (!email || isLocked === "true") return;
	

  chrome.storage.local.get(["locks"], (data) => {
    if (data.locks && data.locks[email]) {
			isLocked = true;
      lockScreen(email);
    }
  });
};

// Wait a moment after page loads
setTimeout(checkAndLock, 2000);

