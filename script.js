const RAW_ASSET_BASE = 'https://raw.githubusercontent.com/Rc3dMarine/r3d-marine-website/main/assets/';
const asset = (name) => RAW_ASSET_BASE + name.split('/').map(encodeURIComponent).join('/');
const localAsset = (name) => `assets/${name}`;

const models = [
  {
    name: 'Mercury 600', category: 'Engine', status: 'Available',
    description: 'Functional scale RC outboard inspired by the Mercury 600, developed as a detailed printable model with separate body components and an internal drivetrain concept for powered RC applications.',
    images: [asset('mercury-600-1.webp')],
    cults: 'https://cults3d.com/en/3d-model/game/mercury-600-rc-outboard-lagiosg-2'
  },
  {
    name: 'Mercury 400', category: 'Engine', status: 'Under development',
    description: 'Scale RC outboard model inspired by the Mercury 400, currently under development with focus on recognizable exterior proportions and printable multi-part construction for marine model projects.',
    images: [
      localAsset('mercury-400-1.webp'),
      localAsset('mercury-400-2.webp'),
      localAsset('mercury-400-3.webp')
    ],
    cults: ''
  },
  {
    name: 'Mercury 300', category: 'Engine', status: 'Under development',
    description: 'Compact functional-scale outboard project inspired by the Mercury 300, currently under development for 3D printing with an emphasis on the external engine form and RC integration.',
    images: [
      localAsset('mercury-300-1.webp'),
      localAsset('mercury-300-2.webp'),
      localAsset('mercury-300-3.webp'),
      localAsset('mercury-300-4.webp')
    ],
    cults: ''
  },
  {
    name: 'Rafnar 1200 Cross Cabin', category: 'Hull', status: 'Available',
    description: 'Detailed scale interpretation of the Rafnar 1200 Cross Cabin, developed as an RC-ready marine model with the distinctive hull, cabin and twin-outboard arrangement reproduced for 3D printing.',
    images: [asset('rafnar-1200-1.webp')],
    cults: 'https://cults3d.com/en/3d-model/game/rafnar-1200-cross-cabin'
  },
  {
    name: 'Nimbus C11', category: 'Hull', status: 'Available',
    description: 'Detailed 3D scale replica of the Nimbus C11, developed for 3D printing with attention to exterior geometry, deck layout, lighting details and recognizable marine proportions.',
    images: [asset('Nimbus c11 cite 1.png'), asset('Nimbus c11 cite2.png'), asset('Nimbus c11 site3.PNG'), asset('Nimbus c11 site4.png')],
    cults: 'https://cults3d.com/en/3d-model/game/nimbus-c11-model'
  },
  {
    name: 'Axopar 45 XC', category: 'Hull', status: 'Available',
    description: "Scale 3D replica of the Axopar 45 XC, modeled around the boat's characteristic profile, enclosed cabin and triple-outboard layout for printable RC and display builds.",
    images: [asset('Axopar 45 xc site 1.png'), asset('Axopar 45 xc site 2.png'), asset('Axopar 45 xc site 3.png'), asset('Axopar 45 xc site 4.png')],
    cults: 'https://cults3d.com/en/3d-model/game/axopar-45'
  },
  {
    name: 'Universal Trim System', category: 'RC System', status: 'Under development',
    description: 'Universal RC outboard trim mechanism under development, built around a compact pivoting mount for functional scale outboard installations.',
    images: [asset('universal-trim-1.webp')],
    cults: ''
  }
];

const categoryTargets = {
  Engine: document.querySelector('#engines-grid'),
  Hull: document.querySelector('#hulls-grid'),
  'RC System': document.querySelector('#systems-grid')
};

function modelCard(model, index) {
  const card = document.createElement('article');
  card.className = 'model-card';
  card.dataset.index = index;
  card.tabIndex = 0;
  card.innerHTML = `
    <img src="${model.images[0]}" alt="${model.name}" loading="lazy">
    <div class="card-copy">
      <div class="card-meta"><span>${model.category}</span><span class="status-pill">${model.status}</span></div>
      <h3>${model.name}</h3>
      <div class="card-action">VIEW GALLERY <span>↗</span></div>
    </div>`;
  const open = () => openModel(index);
  card.addEventListener('click', open);
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') open(); });
  return card;
}

models.forEach((model, index) => categoryTargets[model.category].appendChild(modelCard(model, index)));

const latest = document.querySelector('#latest-grid');
models.filter(m => m.status === 'Under development').slice(0, 3).forEach((model) => {
  const index = models.indexOf(model);
  const item = document.createElement('div');
  item.className = 'latest-card';
  item.tabIndex = 0;
  item.innerHTML = `<img src="${model.images[0]}" alt="${model.name}" loading="lazy"><span>${model.name}</span>`;
  item.addEventListener('click', () => openModel(index));
  item.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openModel(index); });
  latest.appendChild(item);
});

const modal = document.querySelector('#model-modal');
const modalImage = document.querySelector('#modal-main-image');
const modalTitle = document.querySelector('#modal-title');
const modalCategory = document.querySelector('#modal-category');
const modalDescription = document.querySelector('#modal-description');
const modalThumbs = document.querySelector('#modal-thumbs');
const modalCults = document.querySelector('#modal-cults');
const modalStatus = document.querySelector('#modal-status');

function setModalImage(src, alt, button) {
  modalImage.src = src;
  modalImage.alt = alt;
  modalThumbs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  if (button) button.classList.add('active');
}

function openModel(index) {
  const model = models[index];
  modalTitle.textContent = model.name;
  modalCategory.textContent = `${model.category.toUpperCase()} / ${model.status.toUpperCase()}`;
  modalDescription.textContent = model.description;
  modalThumbs.innerHTML = '';

  model.images.forEach((src, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = `<img src="${src}" alt="${model.name} view ${i + 1}">`;
    btn.addEventListener('click', () => setModalImage(src, model.name, btn));
    modalThumbs.appendChild(btn);
    if (i === 0) setTimeout(() => setModalImage(src, model.name, btn), 0);
  });

  modalThumbs.style.display = model.images.length > 1 ? 'grid' : 'none';

  if (model.cults) {
    modalCults.href = model.cults;
    modalCults.style.display = 'inline-block';
    modalStatus.style.display = 'none';
  } else {
    modalCults.style.display = 'none';
    modalStatus.style.display = 'block';
    modalStatus.textContent = 'Under development — release link will be added when ready.';
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModel() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelector('.modal-close').addEventListener('click', closeModel);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModel(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModel(); });

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const menuClose = document.querySelector('.menu-close');

function openMenu() {
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuButton.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
