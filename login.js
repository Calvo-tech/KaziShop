// ==================== ADMIN AUTH SYSTEM ====================

// ✅ Credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "techlooma123";

// ✅ Generate MD5 hash from password
const ADMIN_PASS_HASH = CryptoJS.MD5(ADMIN_PASS).toString(); // Automatically creates the correct hash

// ✅ Convert string to MD5 hash
function md5(str) {
  return CryptoJS.MD5(str).toString();
}

// ✅ Login function
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("msg");

  if (username === ADMIN_USER && md5(password) === ADMIN_PASS_HASH) {
    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("adminLoginTime", Date.now());
    msg.textContent = "✅ Login successful! Redirecting...";
    msg.style.color = "green";
    setTimeout(() => (window.location.href = "admin.html"), 1000);
  } else {
    msg.textContent = "❌ Invalid username or password.";
    msg.style.color = "red";
  }
}

// ✅ Protect admin page
function protectAdminPage() {
  const isAdmin = localStorage.getItem("isAdmin");
  const loginTime = localStorage.getItem("adminLoginTime");

  if (!isAdmin || !loginTime || Date.now() - loginTime > 30 * 60 * 1000) {
    logoutAdmin();
  }
}

// ✅ Logout function
function logoutAdmin() {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("adminLoginTime");
  window.location.href = "login.html";
}

// ✅ Auto-run security checks
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const onAdminPage = path.includes("admin.html");
  const onLoginPage = path.includes("login.html");

  if (onAdminPage) protectAdminPage();
  if (onLoginPage && localStorage.getItem("isAdmin") === "true") {
    window.location.href = "admin.html";
  }
});

