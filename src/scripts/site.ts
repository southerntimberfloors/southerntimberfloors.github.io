// Site-wide behaviour: nav menus, open/closed status, sample list, scroll reveal.
import { business } from '../data/site';

/* ---------- Navigation ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
const navEl = document.querySelector<HTMLElement>('[data-nav]');
const burger = document.querySelector<HTMLButtonElement>('[data-burger]');
const toggles = [...document.querySelectorAll<HTMLButtonElement>('[data-menu-toggle]')];
const desktop = window.matchMedia('(min-width: 900px)');

function closeMenus(except?: HTMLButtonElement) {
  toggles.forEach((t) => {
    if (t === except) return;
    t.setAttribute('aria-expanded', 'false');
    document.getElementById(t.getAttribute('aria-controls')!)?.classList.remove('is-open');
  });
}
toggles.forEach((t) => {
  const menu = document.getElementById(t.getAttribute('aria-controls')!)!;
  const set = (open: boolean) => {
    t.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  };
  t.addEventListener('click', () => {
    const open = t.getAttribute('aria-expanded') !== 'true';
    closeMenus(t);
    set(open);
  });
  const item = t.parentElement!;
  let timer: number | undefined;
  item.addEventListener('mouseenter', () => { if (!desktop.matches) return; clearTimeout(timer); closeMenus(t); set(true); });
  item.addEventListener('mouseleave', () => { if (!desktop.matches) return; timer = window.setTimeout(() => set(false), 120); });
});
document.addEventListener('click', (e) => {
  if (desktop.matches && !(e.target as Element).closest('.nav__item')) closeMenus();
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = toggles.find((t) => t.getAttribute('aria-expanded') === 'true');
  closeMenus();
  open?.focus();
  closeDrawer();
  if (burger?.getAttribute('aria-expanded') === 'true') setBurger(false);
});
function setBurger(open: boolean) {
  burger?.setAttribute('aria-expanded', String(open));
  burger?.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navEl?.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
burger?.addEventListener('click', () => setBurger(burger.getAttribute('aria-expanded') !== 'true'));
desktop.addEventListener('change', () => { setBurger(false); closeMenus(); });

const onScroll = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
  document.body.classList.toggle('scrolled-past-top', window.scrollY > 36);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Open / closed status (Melbourne time) ---------- */
function melbourneNow() {
  const parts = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Melbourne', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '0';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, hour: (Number(get('hour')) % 24) + Number(get('minute')) / 60 };
}
const fmt = (h: number) => {
  const hr = Math.floor(h), m = Math.round((h - hr) * 60);
  return `${((hr + 11) % 12) + 1}${m ? ':' + String(m).padStart(2, '0') : ''}${hr >= 12 ? 'pm' : 'am'}`;
};
function updateStatus() {
  const { day, hour } = melbourneNow();
  const today = business.hoursSchedule[day];
  const open = !!today && hour >= today[0] && hour < today[1];
  let text: string;
  if (open) text = `Showroom open now, until ${fmt(today![1])} today`;
  else {
    let d = day, label = '';
    for (let i = 0; i < 8; i++) {
      const sched = business.hoursSchedule[d];
      if (sched && (i > 0 || hour < sched[0])) {
        label = i === 0 ? 'today' : i === 1 ? 'tomorrow' : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d];
        text = `Showroom closed. Opens ${label} at ${fmt(sched[0])}`;
        break;
      }
      d = (d + 1) % 7;
    }
    text ??= 'Showroom closed';
    if (day === 6) text = 'Saturday showroom visits by appointment';
  }
  document.querySelectorAll('[data-open-text]').forEach((el) => (el.textContent = text));
  document.querySelectorAll('[data-open-dot]').forEach((el) => el.classList.toggle('is-open', open));
}
updateStatus();
setInterval(updateStatus, 60_000);

/* ---------- Sample list ---------- */
export type Sample = { slug: string; name: string; category: string; color: string };
const KEY = 'stf-samples';
export const MAX_SAMPLES = 6;
export function getSamples(): Sample[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function saveSamples(list: Sample[]) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
  renderSamples();
  window.dispatchEvent(new CustomEvent('samples:change', { detail: list }));
}
export function toggleSample(s: Sample): 'added' | 'removed' | 'full' {
  const list = getSamples();
  const i = list.findIndex((x) => x.slug === s.slug);
  if (i >= 0) { list.splice(i, 1); saveSamples(list); return 'removed'; }
  if (list.length >= MAX_SAMPLES) return 'full';
  list.push(s); saveSamples(list); return 'added';
}

const drawer = document.querySelector<HTMLElement>('[data-drawer]');
let lastFocus: Element | null = null;
function openDrawer() {
  if (!drawer) return;
  lastFocus = document.activeElement;
  drawer.hidden = false;
  document.body.style.overflow = 'hidden';
  drawer.querySelector<HTMLElement>('.drawer__close')?.focus();
}
function closeDrawer() {
  if (!drawer || drawer.hidden) return;
  drawer.hidden = true;
  document.body.style.overflow = '';
  (lastFocus as HTMLElement | null)?.focus?.();
}
document.querySelectorAll('[data-open-samples]').forEach((b) => b.addEventListener('click', openDrawer));
document.querySelectorAll('[data-close-samples]').forEach((b) => b.addEventListener('click', closeDrawer));
document.querySelector('[data-clear-samples]')?.addEventListener('click', () => saveSamples([]));
drawer?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const f = [...drawer.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter((el) => el.offsetParent);
  if (!f.length) return;
  if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
});

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
function renderSamples() {
  const list = getSamples();
  document.querySelectorAll<HTMLElement>('[data-sample-count]').forEach((el) => {
    el.textContent = String(list.length);
    el.hidden = list.length === 0;
  });
  const ul = document.querySelector('[data-sample-list]');
  if (ul) {
    ul.innerHTML = list
      .map(
        (s) => `<li class="sample-row"><span class="sample-row__sw" style="background:${esc(s.color)}"></span>
        <div><a href="/flooring/${esc(s.slug)}">${esc(s.name)}</a><small>${esc(s.category)}</small></div>
        <button type="button" data-remove="${esc(s.slug)}" aria-label="Remove ${esc(s.name)}">×</button></li>`,
      )
      .join('');
    ul.querySelectorAll<HTMLButtonElement>('[data-remove]').forEach((b) =>
      b.addEventListener('click', () => saveSamples(getSamples().filter((x) => x.slug !== b.dataset.remove))),
    );
  }
  const empty = document.querySelector<HTMLElement>('[data-sample-empty]');
  const foot = document.querySelector<HTMLElement>('[data-sample-foot]');
  if (empty) empty.hidden = list.length > 0;
  if (foot) foot.hidden = list.length === 0;

  document.querySelectorAll<HTMLButtonElement>('[data-sample-toggle]').forEach((b) => {
    const on = list.some((x) => x.slug === b.dataset.slug);
    b.setAttribute('aria-pressed', String(on));
    const label = b.querySelector('[data-label]');
    if (label) label.textContent = on ? 'In your samples' : (b.dataset.addLabel ?? 'Add to samples');
  });
}

document.addEventListener('click', (e) => {
  const b = (e.target as Element).closest<HTMLButtonElement>('[data-sample-toggle]');
  if (!b) return;
  e.preventDefault();
  const r = toggleSample({ slug: b.dataset.slug!, name: b.dataset.name!, category: b.dataset.category!, color: b.dataset.color! });
  if (r === 'full') toast(`You can request up to ${MAX_SAMPLES} samples at a time.`);
  else if (r === 'added') toast(`${b.dataset.name} added to your samples`, { label: 'View list', fn: openDrawer });
});
window.addEventListener('storage', (e) => { if (e.key === KEY) renderSamples(); });
window.addEventListener('samples:refresh', renderSamples);
renderSamples();

/* ---------- Toast ---------- */
let toastEl: HTMLDivElement | null = null;
let toastTimer: number | undefined;
export function toast(msg: string, action?: { label: string; fn: () => void }) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.append(toastEl);
  }
  toastEl.innerHTML = `<span>${esc(msg)}</span>`;
  if (action) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = action.label;
    btn.onclick = () => { action.fn(); toastEl!.classList.remove('show'); };
    toastEl.append(btn);
  }
  requestAnimationFrame(() => toastEl!.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toastEl?.classList.remove('show'), 4000);
}

/* ---------- Reveal on scroll ----------
   Elements with .reveal or [data-reveal] fade in as they enter the viewport (like the previous site).
   Items that arrive together are staggered slightly so rows cascade in. */
const revealEls = document.querySelectorAll<HTMLElement>('.reveal, [data-reveal]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const io = 'IntersectionObserver' in window && !reduceMotion
  ? new IntersectionObserver((entries) => {
      let i = 0;
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target as HTMLElement;
        el.style.transitionDelay = `${Math.min(i++, 6) * 0.12}s`;
        el.classList.add('in');
        io!.unobserve(el);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 })
  : null;
revealEls.forEach((el) => (io ? io.observe(el) : el.classList.add('in')));
