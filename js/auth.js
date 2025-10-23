function authenticate(username, password) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users.find(u => u.username === username && u.password === password);
}

function initAuth() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      { username: 'admin', password: 'admin123', role: 'admin' }
    ]));
  }
}