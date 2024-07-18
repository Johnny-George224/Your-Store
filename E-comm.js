document.addEventListener('DOMContentLoaded', () => {
    const products = document.getElementById('products');
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category-select');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyFiltersButton = document.getElementById('apply-filters');
    const cartItems = document.getElementById('cart-items');
    const totalQuantity = document.getElementById('total-quantity');
    const totalPrice = document.getElementById('total-price');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageNumbers = document.getElementById('page-numbers');
    let allProducts = [];
    let currentPage = 1;
    const itemsPerPage = 4;

    fetchData()

    async function fetchData(){
        try{
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok){
            throw new Error("Could not fetch data");
        }
        
        const data = await response.json();
        console.log(data)

        // displayData(data)
        allProducts = data;
        displayData(data);
        categorize(data);
        updatePagination();


        }

        catch(error){
            console.error(error);
        }
        
    }

    console.log('test')

    // function displayData(data) {
    //     products.innerHTML = '';
    //     data.forEach(product => {
    //         products.innerHTML += `
    //             <div class="product-card">
    //                 <img src="${product.image}">
    //                 <h3>${product.title}</h3>
    //                 <p>$${product.price}</p>
    //                 <button>View Details</button>
    //                 <button>Add to Cart</button>
    //             </div>`;
    //     })}

    function displayData(data) {
        products.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = data.slice(start, end);

        paginatedData.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$${product.price}</p>
                <button class="view-details">View Details</button>
                <button class="add-to-cart">Add to Cart</button>
            `;
            products.appendChild(productCard);

            productCard.querySelector('.add-to-cart').addEventListener('click', () => {
                addToCart(product);
            });
        });
    }

    function categorize(products) {
        const categories = new Set(products.map(product => product.category));
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    applyFiltersButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;
        const minPrice = parseFloat(minPriceInput.value);
        const maxPrice = parseFloat(maxPriceInput.value);

        const filteredProducts = allProducts.filter(product => {
            const matchesSearchTerm = product.title.toLowerCase().includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            const matchesMinPrice = isNaN(minPrice) || product.price >= minPrice;
            const matchesMaxPrice = isNaN(maxPrice) || product.price <= maxPrice;

            return matchesSearchTerm && matchesCategory && matchesMinPrice && matchesMaxPrice;
        });

        displayData(filteredProducts);
        updatePagination(filteredProducts);

        // console.log(allproducts);
        // console.log(filteredProducts);
        
    });





    function addToCart(product) {
        const cartItem = document.createElement('li');
        cartItem.textContent = `${product.title} - $${product.price}`;
        cartItem.innerHTML += ` <button class="remove-from-cart">Remove</button>`;
        cartItems.appendChild(cartItem);

        cartItem.querySelector('.remove-from-cart').addEventListener('click', () => {
            cartItems.removeChild(cartItem);
            updateCart();
        });

        updateCart();
    }

    function updateCart() {
        const items = cartItems.querySelectorAll('li');
        const quantity = items.length;
        const price = Array.from(items).reduce((total, item) => {
            const priceText = item.textContent.match(/\$([\d.]+)/);
            return total + (priceText ? parseFloat(priceText[1]) : 0);
        }, 0);

        totalQuantity.textContent = quantity;
        totalPrice.textContent = price.toFixed(2);
    }



    function updatePagination(filteredProducts = allProducts) {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        console.log(totalPages);
        pageNumbers.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.textContent = i;
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                displayData(filteredProducts);
                updatePagination(filteredProducts);
            });
            if (i === currentPage) {
                pageNumber.classList.add('active');
            }
            pageNumbers.appendChild(pageNumber);
        }

        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === totalPages;
    }

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayData(allProducts);
            updatePagination();
        }
    });

    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(allProducts.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayData(allProducts);
            updatePagination();
        }
    });






})

