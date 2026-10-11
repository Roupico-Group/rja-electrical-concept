/* Variant-only sector selector. The shared service list and enquiry handlers remain in app.js. */
(() => {
  const groups = document.getElementById('sector-service-groups');
  if (!groups) return;
  const panels = [...groups.querySelectorAll('.sector-service')];
  if (panels.length < 2) return;
  const tabs = document.createElement('div');
  tabs.className = 'sector-tabs';
  tabs.setAttribute('role', 'tablist');
  tabs.setAttribute('aria-label', 'Choose a service setting');
  const buttons = panels.map((panel, index) => {
    const label = panel.querySelector('h3')?.textContent?.trim() || `Setting ${index + 1}`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sector-tab';
    button.id = `sector-tab-${index}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `sector-panel-${index}`);
    button.textContent = label;
    panel.id = `sector-panel-${index}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);
    tabs.append(button);
    return button;
  });
  function select(index, focus = false) {
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    buttons.forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    if (focus) buttons[index].focus();
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
      if (!direction) return;
      event.preventDefault();
      select((index + direction + buttons.length) % buttons.length, true);
    });
  });
  groups.before(tabs);
  select(0);
})();
