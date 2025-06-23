document.getElementById("add").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
	const errorString = document.getElementById("error-string");
	
	const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!email || !password) {
		errorString.hidden = false;
		errorString.textContent = "Both email and password are required.";
		return;
	}
	if(!emailRegex.test(email)) {
		errorString.hidden = false;
		errorString.textContent = "Please enter a valid Gmail address.";
		return;
	}
	

  chrome.storage.local.get(["locks"], (data) => {
    const locks = data.locks || {};
    locks[email] = password;

    chrome.storage.local.set({ locks }, () => {
      renderList();
    });
  });
});

function renderList() {
  chrome.storage.local.get(["locks"], (data) => {
    const locks = data.locks || {};
    const ul = document.getElementById("lockList");
    ul.innerHTML = "";

    Object.keys(locks).forEach(email => {
      const li = document.createElement("li");

      // Email label
      const emailSpan = document.createElement("span");
      emailSpan.textContent = email;

      // Delete button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "✖";
      deleteBtn.style.background = "#e74c3c";
      deleteBtn.style.color = "white";
      deleteBtn.style.border = "none";
      deleteBtn.style.borderRadius = "4px";
      deleteBtn.style.padding = "4px 8px";
      deleteBtn.style.cursor = "pointer";
      deleteBtn.style.width = "75px";

      // Delete logic with password confirmation
      deleteBtn.addEventListener("click", () => {
        const enteredPassword = prompt(`Enter password to delete lock for ${email}:`);
        if (enteredPassword === null) return; // Cancel pressed

        if (enteredPassword === locks[email]) {
          delete locks[email];
          chrome.storage.local.set({ locks }, () => {
            renderList(); // Refresh the list
          });
        } else {
          alert("Incorrect password. Cannot delete.");
        }
      });

      li.appendChild(emailSpan);
      li.appendChild(deleteBtn);
      ul.appendChild(li);
    });
  });
}

renderList();

