const targetEmail = "example@gmail.com";

const unlockPassword = "llbtcl";     // <-- your unlock password

let isUnlocked = false; // Prevent re-locking during this session

function checkEmailInTitle() {
	const title = document.title;
	const emailMatch = title.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,})/);
	return emailMatch ? emailMatch[1] : null;
}

function addOverlayUI() {
	if (document.getElementById("gmail-lock-overlay")) return;

	const overlay = document.createElement("div");
	overlay.id = "gmail-lock-overlay";
	overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(255,255,255,0.95);
    z-index: 9999;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
  `;

	overlay.innerHTML = `
    <div style="text-align: center;">
      <h2>🔒 Protected Gmail Account</h2>
      <input type="password" placeholder="Enter password to unlock" id="unlock-pass"
             style="padding:10px; margin-top:10px; width: 250px; font-size: 16px;">
      <br><br>
      <button id="unlock-btn" style="padding:10px 20px;">Unlock</button>
      <br><br>
      <button id="logout-btn" style="background:red; color:white; padding:10px 20px;">Log Out</button>
    </div>
  `;

	document.body.appendChild(overlay);

	// Unlock button
	document.getElementById("unlock-btn").addEventListener("click", () => {
		const entered = document.getElementById("unlock-pass").value;
		if (entered === unlockPassword) {
			isUnlocked = true;
			document.getElementById("gmail-lock-overlay").remove();
			console.log("[Extension] Gmail unlocked.");
		} else {
			alert("❌ Incorrect password!");
		}
	});

	// Log Out button
	document.getElementById("logout-btn").addEventListener("click", () => {
		console.log("[Extension] Attempting Gmail UI logout...");

		// Click the profile/account button
		const avatarBtn = document.querySelector('a[aria-label*="@gmail.com"]');

		if (avatarBtn) {
			avatarBtn.click();

			setTimeout(() => {
				// Find the "Sign out" button by text
				const signOutBtn = Array.from(document.querySelectorAll("a"))
					.find(a => a.textContent.trim().toLowerCase() === "sign out");

				if (signOutBtn) {
					console.log("[Extension] Clicking Sign Out...");
					signOutBtn.click();
				} else {
					console.warn("[Extension] Sign out button not found. Fallback.");
					// fallback: try logout URL anyway
					window.location.href = "https://mail.google.com/mail/logout";
				}
			}, 800); // give time for menu to open
		} else {
			console.warn("[Extension] Gmail avatar not found. Fallback.");
			window.location.href = "https://mail.google.com/mail/logout";
		}
	});



	console.log("[Extension] Overlay added.");
}

function initProtection() {
	if (isUnlocked) {
		console.log("[Extension] Already unlocked, skipping.");
		return;
	}

	const currentEmail = checkEmailInTitle();
	if (currentEmail === targetEmail) {
		console.log("[Extension] Email match. Locking.");
		addOverlayUI();
	} else {
		console.log("[Extension] No match or no email found.");
	}
}

// Gmail is dynamic, so observe title changes
const titleObserver = new MutationObserver(() => {
	console.log("[Extension] Title changed. Re-checking Gmail...");
	initProtection();
});
titleObserver.observe(document.querySelector("title"), { childList: true });

setTimeout(initProtection, 3000); // Initial check after load

