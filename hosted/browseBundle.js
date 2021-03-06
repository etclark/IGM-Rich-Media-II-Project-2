"use strict";

var csrfToken = void 0;

var saveProduct = function saveProduct(e) {
    e.preventDefault();
    sendAjax('POST', $("#" + e.target.parentElement.id).attr("action"), $("#" + e.target.parentElement.id).serialize(), function () {
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
                    "h2",
                    { className: "productName" },
                    product.name,
                    " "
                ),
                React.createElement(
                    "div",
                    { className: "productImageContainer" },
                    React.createElement("img", { className: "productImage", alt: "product image", src: product.imageLink })
                ),
                React.createElement(
                    "h4",
                    { className: "productPrice" },
                    " Price: $",
                    product.price,
                    " "
                ),
                React.createElement(
                    "h2",
                    { className: "buyBtn buyBtn-2 buyBtn-sep icon-cart" },
                    React.createElement(
                        "a",
                        { href: product.referLink },
                        "Buy Now!"
                    )
                ),
                React.createElement(
                    "form",
                    {
                        id: product._id,
                        name: "saveForm",
                        onClick: saveProduct,
                        action: "/saver",
                        method: "POST",
                        className: "saveFavorite" },
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { type: "hidden", name: "_id", value: product._id }),
                    React.createElement(
                        "a",
                        { href: "/browse", onclick: "return false;", className: "favBtn" },
                        "Favorite"
                    )
                )
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

var loadProductsByTag = function loadProductsByTag(csrf, tag) {
    sendAjax('GET', '/getProductsByTag', { tag: tag }, function (data) {
        ReactDOM.render(React.createElement(ProductList, { products: data.products, csrf: csrf }), document.querySelector("#products"));
    });
};

var setupProducts = function setupProducts(csrf) {
    var changePassLink = document.querySelector("#changePassLink");
    var sortNav = document.querySelector("#sortNav");
    sortNav.style.display = "block";

    changePassLink.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });

    ReactDOM.render(React.createElement(ProductList, { products: [], csrf: csrf }), document.querySelector("#products"));
    loadProductsFromServer(csrf);
};

var getProductToken = function getProductToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        csrfToken = result.csrfToken;
        setupProducts(result.csrfToken);
    });
};

var browseButton = document.querySelector("#browseLink");
browseButton.addEventListener("click", getProductToken);

//Sorting Buttons
var allButton = document.querySelector("#allButton");
allButton.addEventListener("click", function () {
    loadProductsFromServer(csrfToken);
});

var pokemonButton = document.querySelector("#pokemonButton");
pokemonButton.addEventListener("click", function () {
    loadProductsByTag(csrfToken, "pokemon");
});

var zeldaButton = document.querySelector("#zeldaButton");
zeldaButton.addEventListener("click", function () {
    loadProductsByTag(csrfToken, "zelda");
});

var marioButton = document.querySelector("#marioButton");
marioButton.addEventListener("click", function () {
    loadProductsByTag(csrfToken, "mario");
});

var borderlandsButton = document.querySelector("#borderlandsButton");
borderlandsButton.addEventListener("click", function () {
    loadProductsByTag(csrfToken, "borderlands");
});

var metroidButton = document.querySelector("#metroidButton");
metroidButton.addEventListener("click", function () {
    loadProductsByTag(csrfToken, "metroid");
});

$(document).ready(function () {
    getProductToken();
});
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
