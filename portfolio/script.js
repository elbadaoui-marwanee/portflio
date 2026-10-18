document.documentElement.classList.add('js');

const data = window.PORTFOLIO_DATA || { profile: {}, projects: {} };
const profile = data.profile || {};
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.nav-links');
const toast = document.querySelector('#toast');

const isPlaceholder = value => !value || /^\[.+\]$/.test(String(value).trim());

document.querySelectorAll('[data-profile]').forEach(element => {
  const key = element.dataset.profile;
  if (profile[key]) element.textContent = profile[key];
});

const profileImage = document.querySelector('[data-profile-image]');
if (profileImage && profile.photo) profileImage.src = profile.photo;

const showToast = message => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
};

document.querySelectorAll('[data-profile-link]').forEach(link => {
  const key = link.dataset.profileLink;
  const value = profile[key];
  if (isPlaceholder(value)) {
    link.hidden = true;
    return;
  }

  link.href = key === 'email' ? `mailto:${value}` : value;
  if (key !== 'email') {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

if (['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) {
  document.querySelectorAll('[data-local-demo]').forEach(link => { link.hidden = false; });
}

const closeMenu = () => {
  if (!menuButton || !navigation) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Ouvrir le menu');
  navigation.classList.remove('is-open');
};

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Fermer le menu' : 'Ouvrir le menu');
  navigation?.classList.toggle('is-open', willOpen);
});

navigation?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation?.classList.contains('is-open')) {
    closeMenu();
    menuButton?.focus();
  }
});
window.addEventListener('resize', () => { if (window.innerWidth > 1080) closeMenu(); });

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const motionAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionAllowed && window.matchMedia('(pointer: fine)').matches) {
  const heroVisual = document.querySelector('.hero-visual');
  heroVisual?.addEventListener('pointermove', event => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    heroVisual.style.setProperty('--rx', `${(-y * 7).toFixed(2)}deg`);
    heroVisual.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`);
    heroVisual.style.setProperty('--spot-x', `${(x * 100 + 50).toFixed(1)}%`);
    heroVisual.style.setProperty('--spot-y', `${(y * 100 + 50).toFixed(1)}%`);
  });
  heroVisual?.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--rx', '0deg');
    heroVisual.style.setProperty('--ry', '0deg');
    heroVisual.style.setProperty('--spot-x', '50%');
    heroVisual.style.setProperty('--spot-y', '50%');
  });

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.classList.add('is-tilting');
      card.style.setProperty('--card-rx', `${((.5 - y) * 5).toFixed(2)}deg`);
      card.style.setProperty('--card-ry', `${((x - .5) * 5).toFixed(2)}deg`);
      card.style.setProperty('--spot-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--spot-y', `${(y * 100).toFixed(1)}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.setProperty('--card-rx', '0deg');
      card.style.setProperty('--card-ry', '0deg');
      card.style.setProperty('--spot-x', '50%');
      card.style.setProperty('--spot-y', '50%');
    });
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a')];

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        const current = link.getAttribute('href') === `#${entry.target.id}`;
        if (current) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55%', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(element => revealObserver.observe(element));
} else {
  document.querySelectorAll('[data-reveal]').forEach(element => element.classList.add('is-visible'));
}

const dialog = document.querySelector('#project-dialog');

// Browse the project's real screenshots without leaving its card.
document.querySelectorAll('.project-card').forEach(card => {
  const projectKey = card.querySelector('[data-project-details]')?.dataset.projectDetails;
  const images = data.projects?.[projectKey]?.images;
  const media = card.querySelector('.project-media');
  const picture = media?.querySelector('img');
  if (!images || images.length < 2 || !media || !picture) return;

  let currentImage = 0;
  media.setAttribute('role', 'group');
  media.setAttribute('aria-label', `Captures du projet ${data.projects[projectKey].title}`);
  const count = document.createElement('span');
  count.className = 'gallery-count';
  count.setAttribute('aria-live', 'polite');
  count.setAttribute('aria-atomic', 'true');
  const renderImage = () => {
    picture.src = images[currentImage].src;
    picture.alt = images[currentImage].alt;
    count.textContent = `${currentImage + 1} / ${images.length}`;
  };
  const moveImage = direction => {
    currentImage = (currentImage + direction + images.length) % images.length;
    renderImage();
  };
  [-1, 1].forEach(direction => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `gallery-button gallery-button--${direction === -1 ? 'prev' : 'next'}`;
    button.setAttribute('aria-label', direction === -1 ? 'Capture précédente' : 'Capture suivante');
    button.textContent = direction === -1 ? '‹' : '›';
    button.addEventListener('click', () => moveImage(direction));
    media.append(button);
  });
  media.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    moveImage(event.key === 'ArrowLeft' ? -1 : 1);
  });
  media.append(count);
  renderImage();
});

const dialogFields = {
  title: document.querySelector('#dialog-title'),
  intro: document.querySelector('#dialog-intro'),
  problem: document.querySelector('#dialog-problem'),
  solution: document.querySelector('#dialog-solution'),
  features: document.querySelector('#dialog-features'),
  tech: document.querySelector('#dialog-tech')
};

document.querySelectorAll('[data-project-details]').forEach(button => {
  button.addEventListener('click', () => {
    const project = data.projects?.[button.dataset.projectDetails];
    if (!project || !dialog) return;
    dialogFields.title.textContent = project.title;
    dialogFields.intro.textContent = project.intro;
    dialogFields.problem.textContent = project.problem;
    dialogFields.solution.textContent = project.solution;
    dialogFields.features.replaceChildren(...project.features.map(feature => {
      const item = document.createElement('li');
      item.textContent = feature;
      return item;
    }));
    dialogFields.tech.replaceChildren(...project.technologies.map(technology => {
      const item = document.createElement('span');
      item.textContent = technology;
      return item;
    }));
    dialog.showModal();
  });
});

document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  if (outside) dialog.close();
});

const terminalDialog = document.querySelector('#terminal-dialog');
const terminalOutput = document.querySelector('#terminal-output');
const terminalForm = document.querySelector('#terminal-form');
const terminalInput = document.querySelector('#terminal-command');
const terminalHistory = [];
let terminalHistoryIndex = 0;
let focusTimer;

const appendTerminalLine = (text, modifier = '') => {
  if (!terminalOutput) return null;
  const line = document.createElement('p');
  line.className = `terminal-line${modifier ? ` terminal-line--${modifier}` : ''}`;
  line.textContent = text;
  terminalOutput.append(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
  return line;
};

const formatFocusTime = seconds => {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
};

const startFocusSession = minutes => {
  window.clearInterval(focusTimer);
  let remaining = minutes * 60;
  const status = appendTerminalLine(`Session focus démarrée · ${formatFocusTime(remaining)}`, 'success');
  focusTimer = window.setInterval(() => {
    remaining -= 1;
    if (status) status.textContent = `Session focus en cours · ${formatFocusTime(Math.max(remaining, 0))}`;
    if (remaining > 0) return;
    window.clearInterval(focusTimer);
    if (status) status.textContent = 'Session focus terminée · bravo !';
  }, 1000);
};

const runTerminalCommand = rawCommand => {
  const command = rawCommand.trim();
  if (!command) return;
  terminalHistory.push(command);
  terminalHistoryIndex = terminalHistory.length;
  appendTerminalLine(`planner › ${command}`, 'command');

  const [name, ...args] = command.toLowerCase().split(/\s+/);
  if (name === 'help') {
    appendTerminalLine('Commandes disponibles :\n  dashboard      afficher un résumé\n  modules        lister les modules\n  focus [minutes] lancer une session de concentration\n  theme dark|light changer le thème\n  clear          nettoyer le terminal\n  exit           fermer le terminal');
  } else if (name === 'dashboard') {
    appendTerminalLine('TABLEAU DE BORD\n  Examens à préparer : 3\n  Modules actifs     : 5\n  Progression globale: 68 %', 'success');
  } else if (name === 'modules') {
    appendTerminalLine('MODULES\n  01  Développement web     82 %\n  02  Bases de données      70 %\n  03  Réseaux informatiques 61 %\n  04  Algorithmique         55 %\n  05  Systèmes              48 %', 'success');
  } else if (name === 'focus') {
    const minutes = Number(args[0] || 25);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) {
      appendTerminalLine('Indiquez une durée entière entre 1 et 120 minutes.', 'error');
    } else {
      startFocusSession(minutes);
    }
  } else if (name === 'theme') {
    const theme = args[0] || 'dark';
    if (!['dark', 'light'].includes(theme)) {
      appendTerminalLine('Thèmes disponibles : dark, light.', 'error');
    } else {
      terminalDialog?.classList.toggle('is-light', theme === 'light');
      appendTerminalLine(`Thème « ${theme} » activé.`, 'success');
    }
  } else if (name === 'clear') {
    terminalOutput?.replaceChildren();
  } else if (name === 'exit') {
    appendTerminalLine('Fermeture du terminal…');
    window.setTimeout(() => terminalDialog?.close(), 250);
  } else {
    appendTerminalLine(`Commande inconnue : ${command}. Tapez help pour afficher l’aide.`, 'error');
  }
};

document.querySelector('[data-terminal-open]')?.addEventListener('click', () => {
  terminalDialog?.showModal();
  window.requestAnimationFrame(() => terminalInput?.focus());
});

document.querySelector('.terminal-close')?.addEventListener('click', () => terminalDialog?.close());
terminalDialog?.addEventListener('click', event => {
  if (event.target === terminalDialog) terminalDialog.close();
});

terminalForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!terminalInput) return;
  runTerminalCommand(terminalInput.value);
  terminalInput.value = '';
});

terminalInput?.addEventListener('keydown', event => {
  if (!['ArrowUp', 'ArrowDown'].includes(event.key) || terminalHistory.length === 0) return;
  event.preventDefault();
  terminalHistoryIndex += event.key === 'ArrowUp' ? -1 : 1;
  terminalHistoryIndex = Math.max(0, Math.min(terminalHistoryIndex, terminalHistory.length));
  terminalInput.value = terminalHistory[terminalHistoryIndex] || '';
});

document.querySelectorAll('[data-terminal-command]').forEach(button => {
  button.addEventListener('click', () => {
    runTerminalCommand(button.dataset.terminalCommand);
    terminalInput?.focus();
  });
});

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const validators = {
  name: value => value.trim().length >= 2 ? '' : 'Indiquez votre nom (2 caractères minimum).',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Saisissez une adresse e-mail valide.',
  subject: value => value.trim().length >= 3 ? '' : 'Précisez le sujet de votre message.',
  message: value => value.trim().length >= 20 ? '' : 'Votre message doit contenir au moins 20 caractères.'
};

const validateField = field => {
  const message = validators[field.name]?.(field.value) || '';
  const error = document.querySelector(`#${field.name}-error`);
  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (error) error.textContent = message;
  return !message;
};

form?.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
  });
});

form?.addEventListener('submit', event => {
  event.preventDefault();
  const fields = [...form.querySelectorAll('input, textarea')];
  const valid = fields.map(validateField).every(Boolean);
  if (!valid) {
    fields.find(field => field.getAttribute('aria-invalid') === 'true')?.focus();
    if (formStatus) formStatus.textContent = 'Vérifiez les champs indiqués.';
    return;
  }

  if (isPlaceholder(profile.email)) {
    if (formStatus) formStatus.textContent = 'Message validé. Ajoutez votre adresse e-mail dans portfolio-data.js pour activer l’envoi.';
    return;
  }

  const values = Object.fromEntries(new FormData(form));
  const subject = encodeURIComponent(values.subject);
  const body = encodeURIComponent(`Nom : ${values.name}\nEmail : ${values.email}\n\n${values.message}`);
  if (formStatus) formStatus.textContent = 'Votre messagerie va s’ouvrir. Vérifiez puis envoyez l’e-mail depuis celle-ci.';
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
});
