async function loadLatest() {
  try {
    const res = await fetch('/news/latest');
    const data = await res.json();
    const root = document.getElementById('news-list');
    root.innerHTML = '';
    data.forEach(a => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${a.title}</h3><p>${a.summary || ''}</p><a href="/news/${a.id}">Open</a><hr/>`;
      root.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    document.getElementById('news-list').innerText = 'Error loading news';
  }
}
loadLatest();
