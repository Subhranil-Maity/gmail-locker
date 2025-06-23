# 🔒 Gmail Lock Extension

A lightweight Chrome extension to protect specific Gmail accounts by locking them behind a custom password screen.

---

## 🚀 Features

- 🔐 Lock Gmail accounts by email address
- 🧩 Custom password prompt overlay (not your Google password!)
- 📥 Manage locked accounts via a popup interface
- 🛡️ Secure password storage using hashed values
- 🕵️ Prevents viewing, even if someone switches tabs or reloads
- ✨ Smooth, blurred overlay with animation and styling

---

## 📸 Screenshots
![Alt text](/Screenshots/lock.png?raw=true "Optional Title")

## 🛠️ How It Works

1. The extension monitors the Gmail tab.
2. When a protected email is detected, it overlays a full-page lock screen.
3. The user must enter the correct password to unlock the session.
4. You can manage (add/remove) protected emails and passwords from the extension popup.

---

## 🧩 How to Install (Development Mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/yourusername/gmail-lock-extension.git
```

