const CLIENT_ID = '1101862904380272747'; 
const REDIRECT_URI = 'https://trserver-inc.github.io/YTMT-BOT-SITE/dashboard.html';

const loginBtn = document.getElementById('login-btn');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

loginBtn.href = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify%20guilds`;

function getAccessToken() {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  return fragment.get('access_token');
}

async function init() {
  let token = getAccessToken();

  if (token) {
    localStorage.setItem('dc_access_token', token);
    window.location.hash = '';
  } else {
    token = localStorage.getItem('dc_access_token');
  }

  if (token) {
    try {
      const res = await fetch('https://discord.com/api/users/@me', {
        headers: { authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Token süresi dolmuş veya geçersiz');

      const user = await res.json();

      document.getElementById('user-name').innerText = user.global_name || user.username;
      document.getElementById('user-id').innerText = `@${user.username} • ID: ${user.id}`;
      document.getElementById('user-avatar').src = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';

      loginSection.classList.add('hidden');
      dashboardSection.classList.remove('hidden');

    } catch (err) {
      console.error('Giriş Hatası:', err);
      localStorage.removeItem('dc_access_token');
    }
  }
}

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('dc_access_token');
  window.location.reload();
});

init();
