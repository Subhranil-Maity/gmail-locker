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
      alert("Lock added.");
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
      li.textContent = email;
      ul.appendChild(li);
    });
  });
}

renderList();

