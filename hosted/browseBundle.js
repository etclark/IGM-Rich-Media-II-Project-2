"use strict";

var saveProduct = function saveProduct(e) {
    e.preventDefault();
    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {
        var csrfToken = document.querySelector("#csrfToken").value;
        loadProductsFromServer(csrfToken);
    });
    return false;
};

var ProductList = function ProductList(props) {
    if (props.products === undefined) {
        props.products = [];
        return React.createElement(
            "div",
            { className: "productList" },
            React.createElement(
                "h3",
                { className: "emptyProduct" },
                "No Products Yet"
            )
        );
    }

    var productNodes = props.products.map(function (product) {
        return React.createElement(
            "div",
            { key: product._id, className: "product" },
            React.createElement(
                "div",
                { className: "dataContainer" },
                React.createElement(
                    "h3",
                    null,
                    product.name,
                    " "
                ),
                React.createElement(
                    "div",
                    { "class": "productImageContainer" },
                    React.createElement("img", { "class": "productImage", alt: "product image", src: product.imageLink })
                ),
                React.createElement(
                    "h3",
                    null,
                    " Price: $",
                    product.price,
                    " "
                ),
                React.createElement(
                    "h2",
                    null,
                    " Buy Now!:"
                ),
                React.createElement(
                    "h6",
                    null,
                    " $",
                    product.referLink,
                    " "
                )
            ),
            React.createElement(
                "form",
                {
                    id: product._id,
                    name: "saveForm",
                    onSubmit: saveProduct,
                    action: "/saver",
                    method: "POST",
                    className: "saveFavorite"
                },
                React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                React.createElement("input", { type: "hidden", name: "_id", value: product._id }),
                React.createElement("input", { className: "saveFavoriteSubmit", type: "submit", value: "Save Favorite" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "productList" },
        productNodes
    );
};

var loadProductsFromServer = function loadProductsFromServer(csrf) {
    sendAjax('GET', '/getProducts', null, function (data) {
        ReactDOM.render(React.createElement(ProductList, { products: data.products, csrf: csrf }), document.querySelector("#products"));
    });
};

var setupProducts = function setupProducts(csrf) {
    ReactDOM.render(React.createElement(ProductList, { products: [], csrf: csrf }), document.querySelector("#products"));
    loadProductsFromServer(csrf);
};

var getProductToken = function getProductToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setupProducts(result.csrfToken);
    });
};

//Create listener on button click instead of using document ready function.

var browseButton = document.querySelector("#browseLink");
browseButton.addEventListener("click", getProductToken);

// $(document).ready(function() {
//     var browseButton = document.querySelector("#browseLink");
//     browseButton.addEventListener("click", getProductToken);
//     //getProductToken();
// });
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#errorMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#errorMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            //console.dir(xhr.responseText);
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

//Need to get callback working with getToken!!!!! SHOULD BE DOABLE!
// const getToken = (callback) => {
//     let callbackF = callback;
//     sendAjax('GET', '/getToken', null, (result) => {
//         callbackF(result.csrfToken);
//     });
// };
