// Redirect to order page when button is clicked
document.addEventListener("DOMContentLoaded", function () {
    const orderButton = document.getElementById("orderButton");
    if (orderButton) {
        orderButton.addEventListener("click", function () {
            window.location.href = "order1001.html";
        });
    }
});
