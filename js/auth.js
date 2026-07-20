/* =========================================================
   AUTH.JS
   Handles the Sign Up and Login forms.

   Users are stored in localStorage under the "users" key as:
   [{ name, email, password }, ...]

   NOTE: Passwords are stored in plain text. This is NOT secure
   and would never be done in a real product - it's only okay
   here because this is a local, offline university demo with
   no real backend or server to hash passwords on.
   ========================================================= */

function showFormMessage(elementId, text, isError) {
  const el = document.getElementById(elementId);
  el.textContent = text;
  el.className = 'form-message ' + (isError ? 'error' : 'success');
}

/* ---------- SIGN UP ---------- */
const signupForm = document.getElementById('signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', function (event) {
    event.preventDefault(); // stop the browser from reloading the page

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;

    if (password !== confirmPassword) {
      showFormMessage('signup-message', 'Passwords do not match.', true);
      return;
    }

    const users = getUsers();
    const emailAlreadyUsed = users.some(user => user.email === email);

    if (emailAlreadyUsed) {
      showFormMessage('signup-message', 'An account with this email already exists.', true);
      return;
    }

    users.push({ name: name, email: email, password: password });
    saveUsers(users);

    showFormMessage('signup-message', 'Account created! Redirecting to login...', false);

    setTimeout(function () {
      window.location.href = 'login.html';
    }, 1200);
  });
}

/* ---------- LOGIN ---------- */
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const matchedUser = users.find(u => u.email === email && u.password === password);

    if (!matchedUser) {
      showFormMessage('login-message', 'Incorrect email or password.', true);
      return;
    }

    // We only store name + email in the "logged in" session - not the password
    setCurrentUser({ name: matchedUser.name, email: matchedUser.email });
    showFormMessage('login-message', 'Login successful! Redirecting...', false);

    setTimeout(function () {
      window.location.href = '../index.html';
    }, 1000);
  });
}
