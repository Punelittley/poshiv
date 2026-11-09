const menuButton = document.querySelector('.menu-button')
const navigation = document.querySelector('.nav')

function toggleMenu(forceState) {
  const isOpen = typeof forceState === 'boolean'
    ? forceState
    : !document.body.classList.contains('menu-open')

  document.body.classList.toggle('menu-open', isOpen)
  menuButton?.setAttribute('aria-expanded', String(isOpen))
  if (isOpen) {
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = ''
  }
}

menuButton?.addEventListener('click', () => toggleMenu())

// Mobile menu backdrop overlay
let menuBackdrop = document.querySelector('.menu-backdrop')
if (!menuBackdrop) {
  menuBackdrop = document.createElement('div')
  menuBackdrop.className = 'menu-backdrop'
  menuBackdrop.setAttribute('aria-hidden', 'true')
  document.body.appendChild(menuBackdrop)
}
menuBackdrop.addEventListener('click', () => toggleMenu(false))

// Close menu when clicking outside navigation
document.addEventListener('click', (event) => {
  if (!document.body.classList.contains('menu-open')) return
  if (event.target.closest('.nav') || event.target.closest('.menu-button')) return
  toggleMenu(false)
})

// Close menu when clicking on nav links
document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => toggleMenu(false))
})

// Header scroll state for sticky header shadow
const headerEl = document.querySelector('.header')
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    headerEl?.classList.add('is-scrolled')
  } else {
    headerEl?.classList.remove('is-scrolled')
  }
}, { passive: true })

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }
  }),
  { threshold: 0.12 },
)

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element))

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault()
  event.currentTarget.classList.add('is-sent')
})

document.querySelectorAll('details').forEach((details) => {
  details.addEventListener('toggle', () => {
    if (!details.open) return
    document.querySelectorAll('details[open]').forEach((item) => {
      if (item !== details) item.removeAttribute('open')
    })
  })
})

const VK_LINK = 'https://vk.ru/shtorymoscovact'

// VK Modal Dialog
const vkModalOverlay = document.createElement('div')
vkModalOverlay.className = 'vk-modal-overlay'
vkModalOverlay.id = 'vkModal'
vkModalOverlay.setAttribute('aria-hidden', 'true')
vkModalOverlay.setAttribute('role', 'dialog')
vkModalOverlay.setAttribute('aria-modal', 'true')
vkModalOverlay.innerHTML = `
  <div class="vk-modal-container">
    <button class="vk-modal-close" type="button" aria-label="Закрыть">×</button>
    <div class="vk-modal-badge">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C2.992 0 0 2.992 0 8.316v7.368C0 21.008 2.992 24 8.316 24h7.368C21.008 24 24 21.008 24 15.684V8.316C24 2.992 21.008 0 15.684 0zm3.602 17.158h-1.872c-.708 0-.924-.564-2.196-1.836-1.108-1.072-1.6-1.212-1.872-1.212-.384 0-.492.108-.492.624v1.656c0 .444-.144.768-1.296.768-1.908 0-4.032-1.156-5.52-3.324-2.256-3.192-2.88-5.604-2.88-6.096 0-.276.108-.528.624-.528h1.872c.468 0 .648.216.828.708 1.008 2.892 2.688 5.436 3.384 5.436.264 0 .384-.12.384-.78V10.87c-.084-1.392-.816-1.512-.816-2.004 0-.24.192-.468.516-.468h2.952c.42 0 .576.228.576.732v3.96c0 .42.192.576.312.576.264 0 .48-.156.972-.648 1.5-1.68 2.58-4.236 2.58-4.236.144-.312.384-.528.852-.528h1.872c.564 0 .684.288.564.732-.24 1.092-2.508 4.308-2.616 4.488-.228.36-.312.528 0 .948.228.312.984 1.008 1.488 1.62 1.044 1.2 1.848 2.208 2.064 2.892.12.384-.12.576-.564.576z"/></svg>
      <span>Официальный диалог ВКонтакте</span>
    </div>
    <h3 class="vk-modal-title">Обсудить заказ с дизайнером</h3>
    <p class="vk-modal-lead">Подготовим предварительный расчёт, покажем образцы тканей и согласуем выезд на замер прямо в личных сообщениях группы ВКонтакте.</p>
    
    <div class="vk-modal-product">
      <img class="vk-modal-img" src="./images/product-visualization.jpg" alt="Выбранная услуга">
      <div class="vk-modal-product-text">
        <span class="vk-modal-category">Услуга студии</span>
        <h4 class="vk-modal-name">Шторы на заказ под ключ</h4>
        <div class="vk-modal-price">Индивидуальный расчёт</div>
      </div>
    </div>

    <div class="vk-modal-features">
      <div><i>✓</i><span>Быстрый ответ дизайнера в личных сообщениях</span></div>
      <div><i>✓</i><span>Предварительный расчёт по размерам ваших окон</span></div>
      <div><i>✓</i><span>Согласование даты бесплатного выезда с образцами</span></div>
    </div>

    <div class="vk-modal-actions">
      <a class="vk-modal-btn" href="${VK_LINK}" target="_blank" rel="noopener noreferrer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.684 0H8.316C2.992 0 0 2.992 0 8.316v7.368C0 21.008 2.992 24 8.316 24h7.368C21.008 24 24 21.008 24 15.684V8.316C24 2.992 21.008 0 15.684 0zm3.602 17.158h-1.872c-.708 0-.924-.564-2.196-1.836-1.108-1.072-1.6-1.212-1.872-1.212-.384 0-.492.108-.492.624v1.656c0 .444-.144.768-1.296.768-1.908 0-4.032-1.156-5.52-3.324-2.256-3.192-2.88-5.604-2.88-6.096 0-.276.108-.528.624-.528h1.872c.468 0 .648.216.828.708 1.008 2.892 2.688 5.436 3.384 5.436.264 0 .384-.12.384-.78V10.87c-.084-1.392-.816-1.512-.816-2.004 0-.24.192-.468.516-.468h2.952c.42 0 .576.228.576.732v3.96c0 .42.192.576.312.576.264 0 .48-.156.972-.648 1.5-1.68 2.58-4.236 2.58-4.236.144-.312.384-.528.852-.528h1.872c.564 0 .684.288.564.732-.24 1.092-2.508 4.308-2.616 4.488-.228.36-.312.528 0 .948.228.312.984 1.008 1.488 1.62 1.044 1.2 1.848 2.208 2.064 2.892.12.384-.12.576-.564.576z"/></svg>
        <span>Перейти в диалог ВКонтакте</span>
      </a>
      <button type="button" class="vk-modal-cancel">Остаться на сайте</button>
    </div>
  </div>`
document.body.append(vkModalOverlay)

const modalImg = vkModalOverlay.querySelector('.vk-modal-img')
const modalName = vkModalOverlay.querySelector('.vk-modal-name')
const modalPrice = vkModalOverlay.querySelector('.vk-modal-price')
const modalCategory = vkModalOverlay.querySelector('.vk-modal-category')

function openVkModal(data = {}) {
  if (data.name) modalName.textContent = data.name
  if (data.price) modalPrice.textContent = data.price
  if (data.image) modalImg.src = data.image
  if (data.badge) modalCategory.textContent = data.badge
  document.body.classList.add('vk-modal-open')
  vkModalOverlay.setAttribute('aria-hidden', 'false')
}

function closeVkModal() {
  document.body.classList.remove('vk-modal-open')
  vkModalOverlay.setAttribute('aria-hidden', 'true')
}

vkModalOverlay.addEventListener('click', (event) => {
  if (event.target === vkModalOverlay || event.target.closest('.vk-modal-close, .vk-modal-cancel')) {
    closeVkModal()
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeVkModal()
})

const getCardData = (card) => {
  const name = card.dataset.name || card.querySelector('h2, h3')?.textContent.trim() || 'Услуга Татьяны Вересовой'
  const price = card.querySelector('.price strong, strong')?.textContent.trim() || card.dataset.price || ''
  const image = card.dataset.image || card.querySelector('img')?.getAttribute('src') || './images/product-visualization.jpg'
  const badge = card.querySelector('.product-image span, small')?.textContent.trim() || 'Услуга студии'
  return { name, price, image, badge }
}

// Convert all product cards and actions
document.querySelectorAll('.product-card').forEach((card) => {
  const info = card.querySelector('.product-info')
  if (!info) return

  let btn = info.querySelector('.store-add, .vk-order-btn')
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'vk-order-btn'
    btn.innerHTML = 'Заказать в VK'
    info.append(btn)
  } else {
    btn.className = 'vk-order-btn'
    btn.innerHTML = 'Обсудить в VK'
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    openVkModal(getCardData(card))
  })
})

// Hero product button
document.querySelectorAll('.hero-shop-product').forEach((hero) => {
  let btn = hero.querySelector('.store-add, .vk-order-btn')
  if (!btn) {
    btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'vk-order-btn'
    hero.querySelector('.hero-shop-info > div:last-child')?.append(btn)
  }
  btn.className = 'vk-order-btn'
  btn.innerHTML = 'Обсудить в VK'
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    openVkModal({
      name: hero.querySelector('h2, h3')?.textContent.trim() || 'Шторы на заказ под ключ',
      price: hero.querySelector('strong')?.textContent.trim() || 'Индивидуальный расчёт',
      image: hero.querySelector('img')?.getAttribute('src') || './images/product-visualization.jpg',
      badge: 'Авторский проект'
    })
  })
})

// Any link leading to contacts or order within product cards
document.querySelectorAll('.product-info a, [data-vk-modal]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const card = link.closest('.product-card')
    const caseEl = link.closest('.project-case')
    if (card) {
      e.preventDefault()
      openVkModal(getCardData(card))
    } else if (caseEl) {
      e.preventDefault()
      openVkModal({
        name: caseEl.querySelector('h2')?.textContent.trim() || 'Проект Татьяны Вересовой',
        price: caseEl.querySelector('.project-case-price')?.textContent.trim() || '',
        image: caseEl.querySelector('img')?.getAttribute('src') || './images/product-visualization.jpg',
        badge: caseEl.querySelector('.project-case-badge')?.textContent.trim() || 'Реализованный проект'
      })
    }
  })
})

// Mobile Navigation Contacts Drawer Block
if (navigation && !navigation.querySelector('.nav-mobile-contacts')) {
  const mobContacts = document.createElement('div')
  mobContacts.className = 'nav-mobile-contacts'
  mobContacts.innerHTML = `
    <span class="nav-mob-badge">Прямой контакт</span>
    <a class="nav-mob-phone" href="tel:+79814218537">+7 (981) 421-85-37</a>
    <a class="nav-mob-vk" href="${VK_LINK}" target="_blank" rel="noopener noreferrer">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right:8px;"><path d="M15.684 0H8.316C2.992 0 0 2.992 0 8.316v7.368C0 21.008 2.992 24 8.316 24h7.368C21.008 24 24 21.008 24 15.684V8.316C24 2.992 21.008 0 15.684 0zm3.602 17.158h-1.872c-.708 0-.924-.564-2.196-1.836-1.108-1.072-1.6-1.212-1.872-1.212-.384 0-.492.108-.492.624v1.656c0 .444-.144.768-1.296.768-1.908 0-4.032-1.156-5.52-3.324-2.256-3.192-2.88-5.604-2.88-6.096 0-.276.108-.528.624-.528h1.872c.468 0 .648.216.828.708 1.008 2.892 2.688 5.436 3.384 5.436.264 0 .384-.12.384-.78V10.87c-.084-1.392-.816-1.512-.816-2.004 0-.24.192-.468.516-.468h2.952c.42 0 .576.228.576.732v3.96c0 .42.192.576.312.576.264 0 .48-.156.972-.648 1.5-1.68 2.58-4.236 2.58-4.236.144-.312.384-.528.852-.528h1.872c.564 0 .684.288.564.732-.24 1.092-2.508 4.308-2.616 4.488-.228.36-.312.528 0 .948.228.312.984 1.008 1.488 1.62 1.044 1.2 1.848 2.208 2.064 2.892.12.384-.12.576-.564.576z"/></svg>
      Написать в VK
    </a>
    <span class="nav-mob-hours">Москва и МО · Пн—Вс 10:00–19:00</span>
  `
  navigation.appendChild(mobContacts)
}

// 152-FZ Cookie Consent Banner
if (!localStorage.getItem('cookie_consent_accepted')) {
  const cookieBanner = document.createElement('div')
  cookieBanner.className = 'cookie-banner'
  cookieBanner.innerHTML = `
    <div class="cookie-banner-inner">
      <p>Мы используем файлы cookie для удобства работы сайта и сбора аналитики в соответствии с <a href="./privacy.html">152-ФЗ РФ и Политикой конфиденциальности</a>.</p>
      <button type="button" class="cookie-banner-btn">Принять</button>
    </div>
  `
  document.body.appendChild(cookieBanner)
  setTimeout(() => cookieBanner.classList.add('is-visible'), 400)

  cookieBanner.querySelector('.cookie-banner-btn')?.addEventListener('click', () => {
    localStorage.setItem('cookie_consent_accepted', 'true')
    cookieBanner.classList.remove('is-visible')
    setTimeout(() => cookieBanner.remove(), 400)
  })
}

// =========================================================
// TATIANA VERESOVA: ALBUM FILTERING, CALLBACK & SERVICE MODALS
// =========================================================

// 1. Portfolio Album Filtering
const filterBtns = document.querySelectorAll('.album-filter-btn')
const albumCards = document.querySelectorAll('.album-card')

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('is-active'))
    btn.classList.add('is-active')
    const filter = btn.dataset.filter

    albumCards.forEach((card) => {
      const categories = (card.dataset.category || '').split(' ')
      if (filter === 'all' || categories.includes(filter)) {
        card.classList.remove('is-hidden')
      } else {
        card.classList.add('is-hidden')
      }
    })
  })
})

// 2. Callback Modal Handling
const callbackOverlay = document.querySelector('.callback-modal-overlay')
const openCallbackBtns = document.querySelectorAll('[data-callback-modal]')
const closeCallbackBtn = document.querySelector('.callback-modal-close')
const callbackForm = document.querySelector('.callback-form')

openCallbackBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    document.body.classList.add('callback-modal-open')
  })
})

closeCallbackBtn?.addEventListener('click', () => {
  document.body.classList.remove('callback-modal-open')
})

callbackOverlay?.addEventListener('click', (e) => {
  if (e.target === callbackOverlay) {
    document.body.classList.remove('callback-modal-open')
  }
})

callbackForm?.addEventListener('submit', (e) => {
  e.preventDefault()
  const card = callbackForm.closest('.callback-modal-card')
  card?.classList.add('is-sent')
  setTimeout(() => {
    document.body.classList.remove('callback-modal-open')
    setTimeout(() => {
      card?.classList.remove('is-sent')
      callbackForm.reset()
    }, 400)
  }, 2500)
})

// 3. Service Card Click Handling (opens detail dialog)
document.querySelectorAll('.service-card-v3').forEach((card) => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.vk-order-btn')) return
    const name = card.querySelector('h3')?.textContent.trim() || 'Услуга Татьяны Вересовой'
    const image = card.querySelector('img')?.getAttribute('src') || './images/product-visualization.jpg'
    const badge = card.querySelector('.service-card-v3-num')?.textContent.trim() || 'Услуга студии'
    openVkModal({
      name,
      price: 'Индивидуальный расчёт',
      image,
      badge
    })
  })
})
