// Check if the document is still loading
if (document.readyState == 'loading') {
    // Add an event listener to run the `ready` function when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', ready);
} else {
    // If the document is already loaded, run the `ready` function immediately
    ready();
}

// Function to run once the DOM is fully loaded
function ready() {
    // Get all elements with the class 'btn-danger' (remove buttons)
    var removeCartItemsBtn = document.getElementsByClassName('btn-danger');
    console.log(removeCartItemsBtn);
    // Add click event listeners to each remove button
    for (var i = 0; i < removeCartItemsBtn.length; i++) {
        var button = removeCartItemsBtn[i];
        button.addEventListener('click', removeCartItem);
    }

    // Get all elements with the class 'cart-quantity-input' (quantity input fields)
    var quantityInputs = document.getElementsByClassName('cart-quantity-input');
    // Add change event listeners to each quantity input field
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }

    // Get all elements with the class 'shop-item-button' (add to cart buttons)
    var addToCartBtn = document.getElementsByClassName('shop-item-button');
    // Add click event listeners to each add to cart button
    for (var i = 0; i < addToCartBtn.length; i++) {
        var button = addToCartBtn[i];
        button.addEventListener('click', addToCartClicked);
    }

    // Add click event listener to the purchase button
    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
}

// Function to handle the purchase button click
function purchaseClicked() {
    alert('Thank you for your purchase');
    
    // Get the cart items container
    var cartItem = document.getElementsByClassName('cart-items')[0];
    
    // Remove all child nodes from the cart items container
    while (cartItem.hasChildNodes()) {
        cartItem.removeChild(cartItem.firstChild);
    }
    
    // Update the cart total after clearing items
    updateCartTotal();
}

// Function to handle adding an item to the cart
function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement; // Navigate to the shop item
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imgSrc = shopItem.getElementsByClassName('item-img')[0].src;
    
    console.log(title, price, imgSrc);
    
    // Add the item to the cart and update the total
    addItemToCart(title, price, imgSrc);
    updateCartTotal();
}

// Function to create a new cart row and add it to the cart
function addItemToCart(title, price, imgSrc) {
    var cartRow = document.createElement('div'); // Create a new div for the cart item
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');

    // Check if the item is already in the cart
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText.trim() === title) {
            alert('This item is already added to the cart');
            return;
        }
    }

    // Define the HTML for the new cart row
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imgSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>
    `;
    cartRow.innerHTML = cartRowContents; // Set the inner HTML of the cart row
    cartItems.append(cartRow); // Add the new row to the cart items container
    
    // Add event listeners to the remove button and quantity input
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

// Function to handle removing an item from the cart
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove(); // Remove the cart row
    updateCartTotal(); // Update the cart total after removal
}

// Function to handle changes in the quantity input fields
function quantityChanged(event) {
    var input = event.target;
    
    // Ensure the quantity is a positive number, default to 1 if invalid
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    
    // Update the cart total after changing the quantity
    updateCartTotal();
}

// Function to update the total price of the cart
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;

    // Iterate over each cart row to calculate the total price
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];

        // Extract price and quantity
        var price = parseFloat(priceElement.innerText.replace('Price :', '').replace('$', '').trim());
        var quantity = quantityElement.value;

        // Accumulate the total price
        total += price * quantity;
    }

    // Round the total to 2 decimal places
    total = Math.round(total * 100) / 100;
    
    // Update the total price displayed on the page
    document.getElementsByClassName('cart-total-price')[0].innerText = total + "$";
}
