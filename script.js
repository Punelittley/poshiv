const menuButton = document.querySelector('.menu-button')
const navigation = document.querySelector('.nav')

menuButton?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('menu-open')
  menuButton.setAttribute('aria-expanded', String(isOpen))
})

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('menu-open')
    menuButton?.setAttribute('aria-expanded', 'false')
  })
})

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

const CART_KEY = 'veresa-cart'
let cart = []

try {
  cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]')
} catch {
  cart = []
}

const getProductData = (card, index = 0) => {
  const name = card.dataset.name || card.querySelector('h2, h3')?.textContent.trim() || 'Изделие VERÉSA'
  const priceText = card.querySelector('.price strong, .product-info > strong')?.textContent || card.dataset.price || '0'
  const price = Number(card.dataset.price || priceText.replace(/\s/g, '').match(/\d+/)?.[0] || 0)
  const image = card.dataset.image || card.querySelector('img')?.getAttribute('src') || ''
  const id = card.dataset.id || `${name.toLowerCase().replace(/[^a-zа-я0-9]+/gi, '-')}-${index}`
  return { id, name, price, image }
}

document.querySelectorAll('.product-card').forEach((card, index) => {
  card.dataset.storeProduct = ''
  const info = card.querySelector('.product-info')
  if (!info || info.querySelector('.store-add')) return
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'store-add'
  button.textContent = 'В корзину'
  button.dataset.cartBound = 'true'
  info.append(button)
  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    addToCart(getProductData(card, index))
  })
})

const cartButton = document.createElement('button')
cartButton.type = 'button'
cartButton.className = 'cart-button'
cartButton.setAttribute('aria-label', 'Открыть корзину')
cartButton.innerHTML = 'Корзина <span>0</span>'
document.querySelector('.header')?.insertBefore(cartButton, menuButton)

const cartOverlay = document.createElement('div')
cartOverlay.className = 'cart-overlay'
cartOverlay.innerHTML = `
  <aside class="cart-drawer" aria-label="Корзина">
    <div class="cart-head"><h2>Корзина</h2><button type="button" aria-label="Закрыть корзину">×</button></div>
    <div class="cart-items"></div>
    <div class="cart-total"><span>Предварительная сумма</span><strong>0 ₽</strong></div>
    <a class="button button-primary cart-checkout" href="/contacts.html">Оформить запрос <span>→</span></a>
    <p>Точная стоимость рассчитывается после выбора ткани и замера.</p>
  </aside>`
document.body.append(cartOverlay)

const cartItems = cartOverlay.querySelector('.cart-items')
const cartTotal = cartOverlay.querySelector('.cart-total strong')

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  renderCart()
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id)
  if (existing) existing.quantity += 1
  else cart.push({ ...product, quantity: 1 })
  saveCart()
  document.body.classList.add('cart-open')
}

function renderCart() {
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  cartButton.querySelector('span').textContent = quantity
  cartTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`
  cartItems.innerHTML = cart.length
    ? cart.map((item) => `
      <article class="cart-item">
        <img src="${item.image}" alt="">
        <div><h3>${item.name}</h3><span>${item.price.toLocaleString('ru-RU')} ₽ × ${item.quantity}</span>
        <button type="button" data-remove="${item.id}">Удалить</button></div>
      </article>`).join('')
    : '<p class="cart-empty">Пока ничего не выбрано.<br>Добавьте изделие из каталога.</p>'
}

cartButton.addEventListener('click', () => document.body.classList.add('cart-open'))
cartOverlay.addEventListener('click', (event) => {
  if (event.target === cartOverlay || event.target.closest('.cart-head button')) {
    document.body.classList.remove('cart-open')
  }
  const removeButton = event.target.closest('[data-remove]')
  if (removeButton) {
    cart = cart.filter((item) => item.id !== removeButton.dataset.remove)
    saveCart()
  }
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') document.body.classList.remove('cart-open')
})

document.querySelectorAll('[data-store-product] .store-add').forEach((button, index) => {
  if (button.dataset.cartBound) return
  button.dataset.cartBound = 'true'
  button.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()
    addToCart(getProductData(button.closest('[data-store-product]'), index))
  })
})

renderCart()
