
// This script toggles between light and dark mode
const btn = document.getElementById('toggleModeBtn');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedMode = localStorage.getItem('colorMode');
function setMode(dark) {
    if (dark) {
        document.body.classList.add('dark-mode');
        btn.textContent = '☀️ Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        btn.textContent = '🌙 Dark Mode';
    }
}

// Initial mode
if (savedMode === 'dark' || (!savedMode && prefersDark)) {
    setMode(true);
} else {
    setMode(false);
}
btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    setMode(isDark);
    localStorage.setItem('colorMode', isDark ? 'dark' : 'light');
});