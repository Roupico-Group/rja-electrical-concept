(() => {
  document.querySelectorAll('[data-catalogue-category]').forEach(link => {
    link.addEventListener('click', () => {
      const category = link.dataset.catalogueCategory;
      const chip = [...document.querySelectorAll('#shop-categories [data-category]')]
        .find(button => button.dataset.category === category);
      chip?.click();
    });
  });
})();
