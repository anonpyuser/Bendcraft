/* Bendcraft touch measurement keypad shared by conduit and trade calculators. */
(() => {
  'use strict';
  const mount = document.getElementById('measurement-keypad');
  if (!mount) return;
  const conduit = Boolean(document.getElementById('fields'));
  const selector = conduit ? '#fields input' : '#a, #b, #c';
  const root = conduit ? document.getElementById('fields') : document.querySelector('.panel');
  const common = ['1/2', '1/4', '3/4', '1/8', '3/8', '5/8', '7/8', '1/16'];
  const sixteenths = ['3/16', '5/16', '7/16', '9/16', '11/16', '13/16', '15/16'];
  const button = (label, attr, value, extra = '') =>
    '<button type="button" class="mp-key ' + extra + '" ' + attr + '="' + value +
    '" aria-label="' + (attr === 'data-frac' ? 'Fraction ' : '') + label + '">' + label + '</button>';
  const digitButtons = [
    ['7', 'data-digit', '7'], ['8', 'data-digit', '8'], ['9', 'data-digit', '9'], ['⌫', 'data-action', 'back', 'mp-subtle'],
    ['4', 'data-digit', '4'], ['5', 'data-digit', '5'], ['6', 'data-digit', '6'], ['Clear', 'data-action', 'clear', 'mp-subtle'],
    ['1', 'data-digit', '1'], ['2', 'data-digit', '2'], ['3', 'data-digit', '3'], ['.', 'data-action', 'decimal'],
    ['±', 'data-action', 'sign'], ['0', 'data-digit', '0'], ['00', 'data-digit', '00'], ['Next ↦', 'data-action', 'next', 'mp-next']
  ];
  mount.innerHTML =
    '<div class="mp-wrap" aria-label="Built-in measurement keypad">' +
    '<div class="mp-top"><strong>Tap-to-enter measurements</strong><span class="mp-active" aria-live="polite"></span></div>' +
    '<p class="mp-hint">Select a measurement above, then tap numbers or a fraction. No phone keyboard needed.</p>' +
    '<div class="mp-grid mp-digits">' + digitButtons.map(a => button(...a)).join('') + '</div>' +
    '<div class="mp-label">Quick fractions</div>' +
    '<div class="mp-grid mp-fractions">' + common.map(f => button(f, 'data-frac', f)).join('') + '</div>' +
    '<button type="button" class="mp-more" data-action="more" aria-expanded="false">More sixteenths ＋</button>' +
    '<div class="mp-grid mp-fractions mp-extra" hidden>' + sixteenths.map(f => button(f, 'data-frac', f)).join('') + '</div>' +
    (conduit ? '' :
      '<div class="mp-label">Measurement units</div><div class="mp-grid mp-units">' +
      ['ft', 'in', 'mm', 'cm', 'm', 'yd'].map(u => button(u, 'data-unit', u)).join('') + '</div>') +
    '</div>';
  const label = mount.querySelector('.mp-active');
  const extra = mount.querySelector('.mp-extra');
  const more = mount.querySelector('.mp-more');
  let active = null;
  let replaceOnDigit = true;
  const visible = () => [...document.querySelectorAll(selector)].filter(input => !input.closest('[hidden]'));
  const isTouch = () => typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  function fieldName(input) {
    const parent = input.closest('label');
    if (!parent) return 'measurement';
    const span = parent.querySelector('span');
    return ((span ? span.textContent : parent.childNodes[0]?.textContent) || 'measurement').trim();
  }
  function select(input) {
    if (!input) return;
    if (active) active.classList.remove('mp-selected');
    active = input;
    active.classList.add('mp-selected');
    replaceOnDigit = true;
    label.textContent = 'Editing: ' + fieldName(active);
  }
  function refresh() {
    const inputs = visible();
    for (const input of inputs) {
      if (isTouch()) {
        input.readOnly = true;
        input.setAttribute('inputmode', 'none');
      }
    }
    if (!inputs.includes(active)) select(inputs[0]);
    const scalar = !conduit && active && active.id === 'b' &&
      ['scale', 'divide', 'spacing'].includes(document.getElementById('mode').value);
    mount.querySelectorAll('[data-unit]').forEach(b => { b.disabled = Boolean(scalar); });
  }
  function inputChange(value) {
    active.value = value;
    active.dispatchEvent(new Event('input', { bubbles: true }));
    replaceOnDigit = false;
  }
  function fraction(f) {
    let text = active.value.trimEnd();
    // A tap on a prefilled mixed-unit field starts a fresh fraction measurement.
    if (replaceOnDigit && /(?:ft|in|yd|mm|cm|m)$/.test(text)) text = '';
    if (/(?:^|\s)\d+\/\d+$/.test(text)) {
      text = text.replace(/(?:^|\s)\d+\/\d+$/, '').trimEnd();
    }
    inputChange(text ? text + ' ' + f : f);
  }
  function unit(u) {
    const text = active.value.trimEnd();
    if (!/\d$/.test(text)) return;
    inputChange(text + ' ' + u + ' ');
  }
  function decimal() {
    const text = replaceOnDigit ? '' : active.value;
    const tail = text.match(/(?:^|[^\d])(\d+(?:\.\d*)?|\.\d+)$/);
    if ((tail && tail[1].includes('.')) || /\/\d+$/.test(text)) return;
    inputChange(text + (tail ? '.' : '0.'));
  }
  function next() {
    const inputs = visible(), index = inputs.indexOf(active);
    select(inputs[(index + 1) % inputs.length]);
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    refresh();
  }
  mount.addEventListener('click', e => {
    const key = e.target.closest('button');
    if (!key || key.disabled) return;
    if (key.dataset.action === 'more') {
      extra.hidden = !extra.hidden;
      more.textContent = extra.hidden ? 'More sixteenths ＋' : 'Hide sixteenths −';
      more.setAttribute('aria-expanded', String(!extra.hidden));
      return;
    }
    refresh();
    if (!active) return;
    if (key.dataset.digit !== undefined) {
      inputChange((replaceOnDigit ? '' : active.value) + key.dataset.digit);
    } else if (key.dataset.frac) fraction(key.dataset.frac);
    else if (key.dataset.unit) unit(key.dataset.unit);
    else if (key.dataset.action === 'decimal') decimal();
    else if (key.dataset.action === 'clear') inputChange('');
    else if (key.dataset.action === 'back') inputChange(replaceOnDigit ? '' : active.value.slice(0, -1));
    else if (key.dataset.action === 'sign') inputChange(active.value.startsWith('-') ? active.value.slice(1) : '-' + active.value);
    else if (key.dataset.action === 'next') next();
  });
  document.addEventListener('focusin', e => {
    if (e.target.matches?.(selector)) { refresh(); select(e.target); }
  });
  document.addEventListener('click', e => {
    if (e.target.matches?.(selector)) { refresh(); select(e.target); }
  });
  if (!conduit) {
    document.getElementById('mode').addEventListener('change', () => {
      select(visible()[0]);
      refresh();
    });
  }
  if (conduit && typeof MutationObserver !== 'undefined') {
    new MutationObserver(refresh).observe(root, { childList: true, subtree: true });
  }
  refresh();
})();