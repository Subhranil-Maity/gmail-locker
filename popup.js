document.getElementById("add").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return alert("Both fields required.");

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
      li.textContent = email + " - " + locks[email];
      ul.appendChild(li);
    });
  });
}

renderList();

