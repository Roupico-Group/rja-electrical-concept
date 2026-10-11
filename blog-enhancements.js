(() => {
  if (document.body.dataset.page !== 'blog') return;

  const search = document.getElementById('blog-search');
  const articles = [...document.querySelectorAll('.blog-article')];
  const buttons = [...document.querySelectorAll('[data-blog-filter]')];
  const count = document.getElementById('blog-count');
  if (!search || !articles.length || !buttons.length || !count) return;

  let selected = 'all';
  function update() {
    const term = search.value.trim().toLocaleLowerCase('en-GB');
    let visible = 0;
    articles.forEach(article => {
      const matchesCategory = selected === 'all' || article.dataset.blogCategory === selected;
      const matchesSearch = article.querySelector('h2').textContent.toLocaleLowerCase('en-GB').includes(term);
      article.hidden = !(matchesCategory && matchesSearch);
      if (!article.hidden) visible += 1;
    });
    count.textContent = `${visible} ${visible === 1 ? 'article' : 'articles'}`;
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.blogFilter;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    update();
  }));
  search.addEventListener('input', update);
  update();
})();
