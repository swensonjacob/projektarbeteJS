$(document).ready(function () {

    //Variables
            let allShoes = getShoes();
            let shoeCart = [];

    //constructor
    function CartItem(shoeObject, qty) {
            this.shoe = shoeObject;
            this.qty = qty;
            this.totalPrice = function () {
                return this.shoe.price * this.qty
            }
            }

    //Setting up product view
        allShoes.forEach(s => {
            //display products
            addProduct(s);
            //add eventlisteners for cart-buttons
            $('#button-' + s.id).click(function () {
                let quantity = parseInt($('#quantity-' + s.id).val());
                if(quantity > s.stock || quantity <= 0) {
                    alert('Felaktigt antal produkter');
                } else {
                    addToCart(s,quantity);
                }
            })
        });

    //Adding to cart
        function addToCart(shoeObject, qty) {
            // if the shoe not exists in cartarray, pushed witch quantity and method for total price
            if (!existsInArray(shoeCart,shoeObject)) {
                shoeCart.push(new CartItem(shoeObject,qty));

                //Clear list before appending
                clearCartList();

                shoeCart.forEach(s => {
                    //adding to list
                    addToCartList(s);
                    //add eventlisteners for number-input and removebutton
                    $('#cartQuantity-' + s.shoe.id).bind('keyup mouseup', function (){
                        let quantity = $('#cartQuantity-' + s.shoe.id).val();
                        if (quantity > s.shoe.stock || quantity <= 0) {
                            alert('Felaktigt antal produkter');
                        } else {
                            s.qty = quantity
                            $('#totalPrice-' + s.shoe.id).text('Totalt: ' + s.totalPrice() + ' kr');
                            displTotOrderPrice(getTotPriceOfCart());
                        }
                    });
                    //add eventlistener removebutton
                    $('#removeShoe-' + s.shoe.id).click(function () {
                        $(this).closest('tr').remove();
                        shoeCart = shoeCart.filter(n => n.shoe.id !== s.shoe.id);
                        if (shoeCart.length === 0) {
                            clearCartList();
                        } else {
                            displTotOrderPrice(getTotPriceOfCart());
                        }
                    })
                })

            }
            else {

                //if shoe exist in cart
                shoeCart.forEach(s => {
                    //finding shoObject in cart-Array
                    if (s.shoe === shoeObject) {
                        s.qty += qty;
                        let $currentQty = $('#cartQuantity-' + shoeObject.id);
                        $currentQty.val(s.qty);
                        updateTotProductPrice(s);
                    }
                });
            }
            //display total order price
            displTotOrderPrice(getTotPriceOfCart());
        }

        //eventlistener order button
        $('#order-btn').click(function () {
            storeOrder(shoeCart)
        });

        //display orderconfirmation on load of page
        $('.order').ready(function () {
            let order = getStoredOrders();
            let orderTotal = 0;
            order.forEach(s => {
                let totalPrice = s.shoe.price * s.qty;
                orderTotal += totalPrice;
               displayOrderConf(s);
            });
            $('#totalPrice').text('Totalt: ' + orderTotal + ' kr')
        });

//eventlistener clear cart button
    $('#clear-cart').click(function () {
        shoeCart = [];
        clearCartList();
    });
// return total price in cart
    function getTotPriceOfCart() {
        let tot=0;
        shoeCart.forEach(s => tot += s.totalPrice());
        return tot;
    }
    //checks if object exists in array
        function existsInArray(array, object) {
            for (let i = 0; i < array.length; i++) {
                if (array[i].shoe === object) {
                    return true;
                }
            }
            return false;
        }


    // model
        //return shoes from json file
        function getShoes() {
            let shoeArr = [];
            $.ajax({
                url: "shoes.json",
                dataType: 'json',
                async: false,
                success: function(data) {
                    data.forEach(s=> shoeArr.push(s));
                }
            });
            return shoeArr;
        }
        //store order in local storage
        function storeOrder(orders) {
            localStorage.setItem('order',JSON.stringify(orders));
        }
        //return order from local storage
        function getStoredOrders() {
        return JSON.parse(localStorage.getItem('order'));
        }

    //view
        //add shoe in html
        function addProduct(shoe) {
                $('.box').append(`<div class="card" id="${shoe.id}">
            <img class="card-img-top" src="${shoe.imgUrl}" alt="Card image cap"/>
            <div class="card-body">
            <h5 class="card-title">${shoe.brand + " " + shoe.model}</h5>
        <p class="card-text">
            Price: ${shoe.price} kr
        </p>
        <input type="number" id="quantity-${shoe.id}" name="quantity" value="1" min="1" max="5">
        <button type="button" class="btn btn-primary" id="button-${shoe.id}">Lägg till</button>
            </div>
            </div>`);
        }
        //add product to cartlist html
        function addToCartList(shoeObject) {
                $('.cart-table').append(`<tr>
            <td>${shoeObject.shoe.brand + " " + shoeObject.shoe.model}</td>
        <td>Antal:<input type="number" id="cartQuantity-${shoeObject.shoe.id}" name="quantity" value="${shoeObject.qty}" min="1" max="5"></td>
            <td>a:Pris: ${shoeObject.shoe.price} kr</td>
        <td id="totalPrice-${shoeObject.shoe.id}">Totalt: ${shoeObject.totalPrice()} kr</td>
        <td><button id="removeShoe-${shoeObject.shoe.id}"><i class="far fa-trash-alt removeShoe " ></i></button></td>
        </tr>`);
        }
    //append shoeorder on order confirmation page
        function displayOrderConf(shoe) {
            $('.order').append(`<tr>
                <td><img class="card-img-top order-pic"src="${shoe.shoe.imgUrl}" alt="Card image cap"/></td>
                <td>${shoe.shoe.brand + " " + shoe.shoe.model}</td>
                <td>Antal: ${shoe.qty}</td>
                 <td>a:Pris: ${shoe.shoe.price} kr</td>
                <td>Totalt: ${shoe.shoe.price * shoe.qty } kr</td>
                </tr>`);
        }
        //clear cart
        function clearCartList() {
            $('.cart-table').empty();
            $('#totalCartPrice').text('');
        }
        //display total price of order html
        function displTotOrderPrice(orderTotal) {
            $('#totalCartPrice').text('Totalt: ' + orderTotal + ' kr')
        }
        //update total price for product
        function updateTotProductPrice(shoe) {
            $('#totalPrice-' + shoe.shoe.id).html(`<td id="totalPrice-${shoe.shoe.id}">Totalt: ${shoe.totalPrice()} kr</i></button></td>`);
        }


});








