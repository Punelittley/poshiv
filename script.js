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

// VK Bot notification config (sending leads to Nikolai)
const VK_BOT_TOKEN = 'vk1.a.h7F167PNCVflw2zH2abKIvThWOx0QHjULqNgz7hDHxZ_dBBPOWzepPrOzU8gu88vdh7F1isM5_S4zdVRWORWGiN-h2QzHZqQ48riKCPVptCSxLusbFnwCpVFYUJiRWKBCGyqKOKz6CReA-AOkJrqQi3DleMvu_ksp8NamUW7m_z4xY5ibEJc2JoNjtmtjWpH_l3-Xe2eGyGsycapzI4M9w'
const VK_ADMIN_USER_ID = '550394386' // Николай (vk.ru/younger_name)

function sendVkNotification(text) {
  return new Promise((resolve) => {
    const callbackName = 'vkLeadCb_' + Math.random().toString(36).substring(2, 9)
    const script = document.createElement('script')
    let resolved = false

    const timeout = setTimeout(() => {
      cleanup()
      if (!resolved) {
        resolved = true
        resolve({ error: 'timeout' })
      }
    }, 8000)

    function cleanup() {
      clearTimeout(timeout)
      try { delete window[callbackName] } catch {}
      script.remove()
    }

    window[callbackName] = function(res) {
      cleanup()
      if (!resolved) {
        resolved = true
        resolve(res)
      }
    }

    script.onerror = function() {
      cleanup()
      if (!resolved) {
        resolved = true
        resolve({ error: 'script_error' })
      }
    }

    const randomId = Math.floor(Math.random() * 1000000000)
    const url = new URL('https://api.vk.com/method/messages.send')
    url.searchParams.set('user_id', VK_ADMIN_USER_ID)
    url.searchParams.set('random_id', String(randomId))
    url.searchParams.set('message', text)
    url.searchParams.set('v', '5.199')
    url.searchParams.set('access_token', VK_BOT_TOKEN)
    url.searchParams.set('callback', callbackName)

    script.src = url.toString()
    document.body.appendChild(script)
  })
}

// Universal Lead Modal Dialog with interactive form
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.78 17.5c.38 0 .58-.25.58-.69v-1.55c0-.39.21-.49.43-.49.24 0 .47.12.9.55.65.65 1.1 1.16 1.6 1.36.27.1.53.22 1.18.22h2.09c.61 0 .87-.3.69-.9-.17-.6-.81-1.44-1.47-2.1-.37-.39-.56-.62-.56-.88 0-.27.18-.49.56-1.01 1-1.4 1.6-2.45 1.74-3 .16-.6-.1-.88-.69-.88h-2.09c-.4 0-.58.21-.69.48 0 0-.72 1.74-1.72 2.86-.34.37-.48.49-.65.49-.1 0-.23-.12-.23-.46V8.41c0-.43-.12-.61-.48-.61h-2.19c-.28 0-.45.2-.45.4 0 .37.57.46.62 1.53v2.3c0 .51-.09.6-.3.6-.52 0-1.81-1.9-2.58-4.07-.15-.43-.29-.56-.69-.56H4.5c-.62 0-.74.28-.74.56 0 .51.67 3.1 3.1 6.51 2.38 3.37 4.4 3.37 4.7 3.37h1.22z"/></svg>
      <span>Заявка дизайнеру</span>
    </div>
    <h3 class="vk-modal-title">Обсудить проект</h3>
    <p class="vk-modal-lead">Оставьте ваши контакты — мастер Татьяна свяжется с вами, ответит на вопросы и сделает предварительный расчет.</p>
    
    <div class="vk-modal-product">
      <img class="vk-modal-img" src="./images/product-visualization.jpg" alt="Выбранная услуга">
      <div class="vk-modal-product-text">
        <span class="vk-modal-category">Услуга студии</span>
        <h4 class="vk-modal-name">Шторы на заказ под ключ</h4>
        <div class="vk-modal-note">Индивидуальный расчет</div>
      </div>
    </div>

    <form class="vk-lead-form">
      <input type="hidden" name="service" class="vk-modal-service-input" value="Шторы на заказ под ключ" />
      <div class="callback-form-group">
        <label for="lead-name">Ваше имя</label>
        <input type="text" id="lead-name" name="name" placeholder="Например, Анна" required />
      </div>
      <div class="callback-form-group">
        <label for="lead-phone">Телефон</label>
        <input type="tel" id="lead-phone" name="phone" placeholder="+7 (___) ___-__-__" required />
      </div>
      <div class="callback-form-group">
        <label for="lead-comment">Пожелания или удобное время звонка</label>
        <input type="text" id="lead-comment" name="comment" placeholder="Например: удобен звонок после 14:00" />
      </div>
      <button class="button button-primary vk-modal-submit" type="submit" style="width:100%; min-height:50px; margin-top:8px;">
        Отправить заявку
      </button>
      <small style="display:block; margin-top:10px; font-size:10.5px; color:#728785; line-height:1.4;">
        Нажимая кнопку, вы даёте согласие на обработку персональных данных в соответствии с <a href="./privacy.html" target="_blank" style="color:var(--teal); text-decoration:underline;">152-ФЗ РФ</a>.
      </small>
    </form>

    <div class="vk-lead-success" style="display:none; text-align:center; padding:15px 0;">
      <div style="width:48px; height:48px; border-radius:50%; background:rgba(7,83,84,0.1); color:var(--teal); font-size:24px; display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">✓</div>
      <h3 style="font-family:var(--serif); font-size:24px; color:var(--ink); margin-bottom:8px;">Заявка успешно отправлена!</h3>
      <p style="color:#556c68; font-size:13px; line-height:1.5; margin-bottom:20px;">Спасибо! Татьяна уже получила вашу заявку и свяжется с вами в ближайшее время.</p>
      <a class="vk-modal-btn" href="${VK_LINK}" target="_blank" rel="noopener noreferrer">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.78 17.5c.38 0 .58-.25.58-.69v-1.55c0-.39.21-.49.43-.49.24 0 .47.12.9.55.65.65 1.1 1.16 1.6 1.36.27.1.53.22 1.18.22h2.09c.61 0 .87-.3.69-.9-.17-.6-.81-1.44-1.47-2.1-.37-.39-.56-.62-.56-.88 0-.27.18-.49.56-1.01 1-1.4 1.6-2.45 1.74-3 .16-.6-.1-.88-.69-.88h-2.09c-.4 0-.58.21-.69.48 0 0-.72 1.74-1.72 2.86-.34.37-.48.49-.65.49-.1 0-.23-.12-.23-.46V8.41c0-.43-.12-.61-.48-.61h-2.19c-.28 0-.45.2-.45.4 0 .37.57.46.62 1.53v2.3c0 .51-.09.6-.3.6-.52 0-1.81-1.9-2.58-4.07-.15-.43-.29-.56-.69-.56H4.5c-.62 0-.74.28-.74.56 0 .51.67 3.1 3.1 6.51 2.38 3.37 4.4 3.37 4.7 3.37h1.22z"/></svg>
        <span>Открыть диалог ВКонтакте</span>
      </a>
    </div>

    <div class="vk-modal-footer-vk" style="margin-top:16px; padding-top:12px; border-top:1px solid var(--line); text-align:center;">
      <a href="${VK_LINK}" target="_blank" rel="noopener noreferrer" style="font-size:11.5px; color:var(--teal); font-weight:600; text-decoration:none;">
        Или сразу написать в сообщения сообщества ВКонтакте →
      </a>
    </div>
  </div>`
document.body.append(vkModalOverlay)

const modalImg = vkModalOverlay.querySelector('.vk-modal-img')
const modalName = vkModalOverlay.querySelector('.vk-modal-name')
const modalCategory = vkModalOverlay.querySelector('.vk-modal-category')
const modalTitle = vkModalOverlay.querySelector('.vk-modal-title')
const modalServiceInput = vkModalOverlay.querySelector('.vk-modal-service-input')
const leadForm = vkModalOverlay.querySelector('.vk-lead-form')
const leadSuccess = vkModalOverlay.querySelector('.vk-lead-success')

function openVkModal(data = {}) {
  const serviceName = data.name || 'Обсуждение проекта'
  if (modalName) modalName.textContent = serviceName
  if (modalServiceInput) modalServiceInput.value = serviceName
  if (data.image && modalImg) modalImg.src = data.image
  if (data.badge && modalCategory) modalCategory.textContent = data.badge
  if (data.title && modalTitle) modalTitle.textContent = data.title

  // Reset form state on each open
  if (leadForm) {
    leadForm.classList.remove('is-sent')
    leadForm.reset()
  }
  if (leadSuccess) leadSuccess.style.display = 'none'

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

leadForm?.addEventListener('submit', async (e) => {
  e.preventDefault()
  const submitBtn = leadForm.querySelector('button[type="submit"]')
  const originalBtnText = submitBtn ? submitBtn.textContent : ''
  if (submitBtn) {
    submitBtn.disabled = true
    submitBtn.textContent = 'Отправка...'
  }

  const data = new FormData(leadForm)
  const name = String(data.get('name') || '').trim()
  const phone = String(data.get('phone') || '').trim()
  const comment = String(data.get('comment') || '').trim()
  const service = String(data.get('service') || modalName?.textContent || 'Общая заявка').trim()
  const dateStr = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

  const text = [
    '🔔 Новая заявка с сайта штор!',
    `📌 Услуга / Проект: ${service}`,
    `👤 Имя: ${name}`,
    `📞 Телефон: ${phone}`,
    comment ? `💬 Пожелания: ${comment}` : '',
    `📅 Дата: ${dateStr} (МСК)`,
    `🌐 Страница: ${window.location.pathname || 'Главная'}`
  ].filter(Boolean).join('\n')

  try {
    await sendVkNotification(text)
  } catch (err) {
    console.warn('VK notification error:', err)
  }

  leadForm.classList.add('is-sent')
  if (leadSuccess) leadSuccess.style.display = 'block'
  if (submitBtn) {
    submitBtn.disabled = false
    submitBtn.textContent = originalBtnText
  }
})

const getCardData = (card) => {
  const name = card.dataset.name || card.querySelector('h2, h3')?.textContent.trim() || 'Услуга Татьяны Вересовой'
  const image = card.dataset.image || card.querySelector('img')?.getAttribute('src') || './images/product-visualization.jpg'
  const badge = card.querySelector('.product-image span, .offering-badge, .album-card-tag, .project-case-badge, small')?.textContent.trim() || 'Услуга студии'
  return { name, image, badge }
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

// 2. Open Universal Lead Modal on Callbacks & CTA
document.querySelectorAll('[data-callback-modal]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    openVkModal({
      name: 'Обратный звонок',
      title: 'Заказать обратный звонок',
      badge: 'Прямая связь',
      image: './images/designer-tatiana.jpg'
    })
  })
})

document.querySelectorAll('.cta a.button').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    openVkModal({
      name: 'Консультация дизайнера',
      title: 'Обсудить проект с дизайнером',
      badge: 'Авторский проект',
      image: './images/designer-tatiana.jpg'
    })
  })
})

// Support for existing static callback forms if present
document.querySelectorAll('.callback-form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const submitBtn = form.querySelector('button[type="submit"]')
    const originalBtnText = submitBtn ? submitBtn.textContent : ''
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = 'Отправка...'
    }

    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const phone = String(data.get('phone') || '').trim()
    const time = String(data.get('time') || '').trim()
    const dateStr = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })

    const text = [
      '🔔 Новая заявка с сайта штор!',
      '📌 Услуга / Проект: Обратный звонок',
      `👤 Имя: ${name}`,
      `📞 Телефон: ${phone}`,
      time ? `⏰ Удобное время: ${time}` : '',
      `📅 Дата: ${dateStr} (МСК)`,
      `🌐 Страница: ${window.location.pathname || 'Главная'}`
    ].filter(Boolean).join('\n')

    try {
      await sendVkNotification(text)
    } catch (err) {
      console.warn('VK notification error:', err)
    }

    const card = form.closest('.callback-modal-card')
    card?.classList.add('is-sent')
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = originalBtnText
    }
  })
})

// 3. Service cards lead to the matching detailed service section.
document.querySelectorAll('.service-card-v3').forEach((card) => {
  const openService = () => {
    if (card.dataset.serviceUrl) window.location.href = card.dataset.serviceUrl
  }
  card.addEventListener('click', openService)
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openService()
    }
  })
})
