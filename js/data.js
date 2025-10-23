function initStorage() {
  if (!localStorage.getItem('clients')) {
    localStorage.setItem('clients', JSON.stringify([]));
  }
  if (!localStorage.getItem('comments')) {
    localStorage.setItem('comments', JSON.stringify({}));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

function createUser(username, password, role) {
  const users = getUsers();
  if (users.some(u => u.username === username)) return false;
  users.push({ username, password, role });
  localStorage.setItem('users', JSON.stringify(users));
  return true;
}

function deleteUser(username) {
  if (username === 'admin') return false;
  const users = getUsers().filter(u => u.username !== username);
  localStorage.setItem('users', JSON.stringify(users));
  return true;
}

function getClients() {
  return JSON.parse(localStorage.getItem('clients') || '[]');
}

function saveClients(clients) {
  localStorage.setItem('clients', JSON.stringify(clients));
}

function addClient(client) {
  const clients = getClients();
  client.id = Date.now().toString();
  client.createdAt = new Date().toISOString();
  clients.push(client);
  saveClients(clients);
}

function updateClient(id, data) {
  const clients = getClients();
  const idx = clients.findIndex(c => c.id === id);
  if (idx !== -1) {
    clients[idx] = { ...clients[idx], ...data };
    saveClients(clients);
  }
}

function getClientById(id) {
  return getClients().find(c => c.id === id);
}

function addComment(clientId, text, author) {
  const all = JSON.parse(localStorage.getItem('comments') || '{}');
  if (!all[clientId]) all[clientId] = [];
  all[clientId].push({
    id: Date.now(),
    text,
    author,
    date: new Date().toLocaleString()
  });
  localStorage.setItem('comments', JSON.stringify(all));
}

function getComments(clientId) {
  const all = JSON.parse(localStorage.getItem('comments') || '{}');
  return all[clientId] || [];
}

function getTodaysReminders(user, role) {
  const clients = getClients();
  const today = new Date().toISOString().split('T')[0];
  return clients.filter(c => {
    if (role !== 'admin' && c.manager !== user) return false;
    return c.reminder && c.reminder.startsWith(today);
  });
}

function showReminders(user, role) {
  const reminders = getTodaysReminders(user, role);
  if (reminders.length > 0 && document.body) {
    const div = document.createElement('div');
    div.className = 'reminder-popup';
    div.innerHTML = `
      <strong>🔔 Напоминаний: ${reminders.length}</strong><br>
      ${reminders.map(c => c.name).join('<br>')}
      <button onclick="this.parentElement.remove()" style="float:right;margin-top:8px;background:#3b82f6;color:white;border:none;padding:4px 10px;border-radius:4px;font-size:12px;">Закрыть</button>
    `;
    document.body.appendChild(div);
  }
}

function sortClients(clients, field) {
  return [...clients].sort((a, b) => {
    if (field === 'status') return (a.status || '').localeCompare(b.status || '');
    if (field === 'source') return (a.source || '').localeCompare(b.source || '');
    if (field === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });
}