document.addEventListener("DOMContentLoaded", () => {
    // Ініціалізація кошика з Local Storage або створення нового кошика
    let cart = loadCartFromLocalStorage();

    const cartElement = document.querySelector('.cart');
    const cartItemsElement = document.querySelector('.cart-items');
    const totalAmountElement = document.querySelector('#total-amount');
    const toggleCartButton = document.querySelector('#toggle-cart');
    const clearCartButton = document.querySelector('#clear-cart');

    // Збереження кошика в Local Storage
    function saveCartToLocalStorage(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Завантаження кошика з Local Storage
    function loadCartFromLocalStorage() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    function updateCart() {
        cartItemsElement.innerHTML = '';
        let totalAmount = 0;
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('order-item');
            cartItemElement.dataset.id = item.id;
            cartItemElement.dataset.size = item.size;

            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="order-details">
                    <h3>${item.name}</h3>
                    <div class="order-size-weight">
                        <div class="size">${item.size}</div>
                        <div class="weight">${item.weight}</div>
                    </div>
                    <div class="order-price-controls">
                        <div class="price">${item.price} грн</div>
                        <div class="order-controls">
                            <button class="decrease-quantity">-</button>
                            <span>${item.quantity}</span>
                            <button class="increase-quantity">+</button>
                            <button class="remove-from-cart">Видалити</button>
                        </div>
                    </div>
                </div>
            `;
            cartItemsElement.appendChild(cartItemElement);
            totalAmount += item.price * item.quantity;
        });
        totalAmountElement.textContent = totalAmount;
        saveCartToLocalStorage(cart); // Зберегти кошик в Local Storage після оновлення
    }

    document.querySelector('.pizza-items').addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const pizzaItem = e.target.closest('.pizza-item');
            const id = pizzaItem.dataset.id;
            const name = pizzaItem.querySelector('h3').textContent;
            const image = pizzaItem.querySelector('img').src;
            const sizeWeightElement = e.target.closest('.size-weight');
            const size = sizeWeightElement.querySelector('.size').textContent;
            const weight = sizeWeightElement.querySelector('.weight').textContent;
            const price = parseInt(sizeWeightElement.querySelector('.price').textContent);

            const existingItem = cart.find(item => item.id === id && item.size === size);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, name, image, size, weight, price, quantity: 1 });
            }
            updateCart();
        }
    });

    cartItemsElement.addEventListener('click', (e) => {
        const cartItemElement = e.target.closest('.order-item');
        const id = cartItemElement.dataset.id;
        const size = cartItemElement.dataset.size;
        const cartItem = cart.find(item => item.id === id && item.size === size);

        if (e.target.classList.contains('increase-quantity')) {
            cartItem.quantity++;
            updateCart();
        }

        if (e.target.classList.contains('decrease-quantity')) {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
            } else {
                cart.splice(cart.indexOf(cartItem), 1);
            }
            updateCart();
        }

        if (e.target.classList.contains('remove-from-cart')) {
            cart.splice(cart.indexOf(cartItem), 1);
            updateCart();
        }
    });

    toggleCartButton.addEventListener('click', () => {
        cartElement.classList.toggle('hidden');
    });

    clearCartButton.addEventListener('click', () => {
        cart.length = 0;
        updateCart();
    });

    updateCart(); // Оновлення кошика при завантаженні сторінки
});

document.addEventListener('DOMContentLoaded', function () {
    const pizzaItems = document.querySelectorAll('.pizza-item');

    // Функція для фільтрації піц за категорією
    function filterPizza(category) {
        pizzaItems.forEach(item => {
            const itemCategory = item.dataset.category;

            if (category === 'Усі' || itemCategory === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Отримання кнопок категорій та додавання обробників подій
    const categoryButtons = document.querySelectorAll('.pizza-categories button');

    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            const category = this.textContent.trim(); // Отримати текст кнопки без пробілів

            // Викликати функцію фільтрації піц
            filterPizza(category);
        });
    });

    // Показати всі піци спочатку
    filterPizza('Усі');
});
