window.addEventListener('scroll', () => {
    const landing = document.getElementById('landing');
    const shop = document.getElementById('shop');

    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Adjust fade threshold to trigger after scrolling past the landing + navbar
    const fadeThreshold = windowHeight / 2 + navbarHeight;

    if (scrollY > fadeThreshold) {
        landing.style.opacity = '0';
        shop.style.opacity = '1';
    } else {
        landing.style.opacity = '1';
        shop.style.opacity = '0';
    }
});


// shop code
document.addEventListener('DOMContentLoaded', () => {
    const cart = [];
    let allProducts = {};
    let currentPage = 1;
    // const itemsPerPage = 5;

    let itemsPerPage = window.innerWidth <= 600 ? 4 : 5;

    window.addEventListener('resize', () => {
        const newItemsPerPage = window.innerWidth <= 600 ? 4 : 5;
        if (newItemsPerPage !== itemsPerPage) {
            itemsPerPage = newItemsPerPage;
            currentPage = 1;
            renderProducts(searchBox.value, sortMenu.value);
        }
    });


    const cartButton = document.getElementById('cart-button');
    const closeCartButton = document.getElementById('close-cart');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items');
    const productHolder = document.querySelector('.product-holder');
    const searchBox = document.getElementById('search-box');
    const sortMenu = document.getElementById('sort-menu');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    // Show cart modal
    cartButton.addEventListener('click', () => {
        cartModal.classList.remove('hidden');
        renderCart();
    });

    // Hide cart modal
    closeCartButton.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });

    // Render cart items
    function renderCart() {
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
            return;
        }

        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - $${item.price}`;

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.style.marginLeft = '10px';
            removeBtn.addEventListener('click', () => {
                cart.splice(index, 1);
                const productCards = document.querySelectorAll('.product');
                productCards.forEach(card => {
                    const title = card.querySelector('h2').textContent;
                    if (title === item.name) {
                        const addBtn = card.querySelector('.add-to-cart');
                        addBtn.textContent = 'Add to Cart';
                        addBtn.disabled = false;
                    }
                });
                renderCart();
            });

            li.appendChild(removeBtn);
            cartItemsList.appendChild(li);
        });
    }

    // Render products with pagination, filter, and sort
    function renderProducts(filter = '', sortOption = '') {
        productHolder.innerHTML = '';

        let filtered = Object.entries(allProducts).filter(([name]) =>
            name.toLowerCase().includes(filter.toLowerCase())
        );

        // Apply sorting
        if (sortOption === 'price-asc') {
            filtered.sort((a, b) => a[1].price - b[1].price);
        } else if (sortOption === 'price-desc') {
            filtered.sort((a, b) => b[1].price - a[1].price);
        } else if (sortOption === 'name-asc') {
            filtered.sort((a, b) => a[0].localeCompare(b[0]));
        }

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        currentPage = Math.min(currentPage, totalPages);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

        paginated.forEach(([name, product]) => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';

            productDiv.innerHTML = `
                <h2>${name}</h2>
                <img src="${product.image}" alt="${name}" width="150">
                <p><strong>ID:</strong> ${product.id}</p>
                <p><strong>Price:</strong> $${product.price}</p>
                <p class="description"><strong>Description:</strong> ${product.description}</p>
                <button class="add-to-cart">Add to Cart</button>
            `;

            const button = productDiv.querySelector('.add-to-cart');
            button.addEventListener('click', () => {
                button.textContent = 'Added to Cart';
                button.disabled = true;
                cart.push({ name, price: product.price });
            });

            productHolder.appendChild(productDiv);
        });

        // Update pagination controls
        pageIndicator.textContent = `Page ${currentPage}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Load products
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            renderProducts();
        })
        .catch(error => console.error('Error loading products:', error));

    // Event listeners
    searchBox.addEventListener('input', () => {
        currentPage = 1;
        renderProducts(searchBox.value, sortMenu.value);
    });

    sortMenu.addEventListener('change', () => {
        currentPage = 1;
        renderProducts(searchBox.value, sortMenu.value);
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts(searchBox.value, sortMenu.value);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        renderProducts(searchBox.value, sortMenu.value);
    });
});