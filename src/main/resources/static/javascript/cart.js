
document.addEventListener("DOMContentLoaded", () => {
    // do fetch and call add cartItem()
    // fetch("/frontPageBooks").
    // then((payload) => payload.json()).
    // then((json) => json.forEach(element => {
    //     addBookButton(element);        
    // }));
    getUserCart();

    if(sessionStorage.getItem("loggedIn") === 'true'){
        const btns = document.getElementsByClassName('login-reg-btn');
        Array.from(btns).map((btn) => btn.setAttribute("hidden", 'true'));

        const log_out_btn = document.getElementById("log-out-btn");
        log_out_btn.toggleAttribute("hidden");
        const log_out_text = document.getElementById("log-out-text");
        log_out_text.innerHTML = 'Logout: ' + sessionStorage.getItem("username");
    }
})

function getUserCart(){
    fetch("/getUserCart?userid=" + sessionStorage.getItem("userId"))
        .then((payload) => payload.json())
        .then((json) => {
            const table = document.createElement('table');
            const header = table.createTHead();
            const row = header.insertRow(0);
            const titleHeader = row.insertCell(0);
            const authorHeader = row.insertCell(1);
            const priceHeader = row.insertCell(2);
            const quantityHeader = row.insertCell(3);
            titleHeader.innerHTML = '<b>Title</b>';
            authorHeader.innerHTML = '<b>Author</b>';
            priceHeader.innerHTML = '<b>Price</b>';
            quantityHeader.innerHTML = '<b>Quantity</b>';

            let totalPrice = 0; // initialize total price to zero
            json.forEach((bookArray) => {
                const title = bookArray[0];
                const author = bookArray[1];
                const price = bookArray[2];
                const quantity = bookArray[3];
                const row = table.insertRow(-1);
                const titleCell = row.insertCell(0);
                const authorCell = row.insertCell(1);
                const priceCell = row.insertCell(2);
                const quantityCell = row.insertCell(3);
                const actionCell = row.insertCell(4);
                titleCell.innerHTML = title;
                authorCell.innerHTML = author;
                priceCell.innerHTML = price;
                quantityCell.innerHTML = quantity;
                totalPrice += price * quantity; // add book price to total
                const removeButton = document.createElement('button');
                removeButton.innerHTML = 'Remove';
                removeButton.addEventListener('click', () => {
                    // Handle remove button click event
                    removeFromCart(bookArray[4], bookArray[0]);
                });
                actionCell.appendChild(removeButton);
            });

            // Add row for total price
            const row1 = table.insertRow(-1);
            const totalHeader = row1.insertCell(0);
            const totalCell = row1.insertCell(1);
            totalHeader.innerHTML = '<b>Total Price:</b>';
            totalCell.innerHTML = "$" + totalPrice.toFixed(2); // display total with 2 decimal places

            document.body.appendChild(table);
        });
}

async function deleteFromCart(user_id, book_id){
    return fetch("/deleteFromCart?userid=" + user_id + " &bookId=" + book_id, {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json",
            'Accept': "application/json",
        },
        body: JSON.stringify({
            user_id,
            book_id,
        }),
    })
    .catch((error) => {
        console.log("Error deleting from cart:", error);
        throw error;
    });
}

function removeFromCart(book_id, book_title) {
    let user_id = sessionStorage.getItem("userId")

    deleteFromCart(user_id, book_id)
        .then((resp) => {
            return resp.json();
        })
        .then((obj) => {
            if (obj.success) {
                alert( "Removed " + book_title + " form cart!");
                document.location.href = "/cart";
            } else {
                console.log("Could not remove book from cart (server side)");
                alert("Could not remove book from cart (server side)");
            }
        });
}