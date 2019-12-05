"use strict";

var csrfToken = void 0;

var handleFavorite = function handleFavorite(e) {
    sendAjax('POST', $("#productForm").attr("action"), $("#productForm").serialize(), function () {
        var csrfToken = document.querySelector("#csrfToken").value;
        loadFavoritesFromServer(csrfToken);
    });
    return false;
};

var handlePasswordChange = function handlePasswordChange(e) {
    e.preventDefault();
    $("#errorMessage").animate({ width: 'hide' }, 350);
    if ($("#currentPass").val() == '' || $("#newPass").val() == '') {
        handleError("All fields are required to proceed");
        return false;
    }

    sendAjax('POST', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), redirect);
    return false;
};

var deleteProduct = function deleteProduct(e) {
    e.preventDefault();
    //console.dir(e.target.id)
    sendAjax('POST', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {
        loadFavoritesFromServer(csrfToken);
    });
    return false;
};

var FavoriteList = function FavoriteList(props) {
    if (props.products === undefined) {
        props.products = [];
        return React.createElement(
            "div",
            { className: "favoriteList" },
            React.createElement(
                "h3",
                { className: "emptyProduct" },
                "No Favorites Yet"
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
                        name: "deleteForm",
                        onSubmit: deleteProduct,
                        action: "/deleter",
                        method: "POST",
                        className: "deleteFavorite"
                    },
                    React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
                    React.createElement("input", { type: "hidden", name: "_id", value: product._id }),
                    React.createElement("input", { className: "deleteFavoriteSubmit", type: "submit", value: "Delete Favorite" })
                )
            )
        );
    });

    return React.createElement(
        "div",
        { className: "favoriteList" },
        productNodes
    );
};

var ChangePasswordWindow = function ChangePasswordWindow(props) {
    return React.createElement(
        "form",
        { id: "changePasswordForm",
            name: "changePasswordForm",
            onSubmit: handlePasswordChange,
            action: "/changePassword",
            method: "POST",
            className: "mainForm"
        },
        React.createElement(
            "h3",
            null,
            React.createElement(
                "label",
                { htmlFor: "currentPass" },
                "Current Password: "
            )
        ),
        React.createElement("input", { id: "pass", type: "password", name: "currentPass", placeholder: "Current Password" }),
        React.createElement(
            "h3",
            null,
            React.createElement(
                "label",
                { htmlFor: "newPass" },
                "New Password: "
            )
        ),
        React.createElement("input", { id: "pass2", type: "password", name: "newPass", placeholder: "New Password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement(
            "h6",
            null,
            React.createElement("input", { className: "formSubmit", type: "submit", value: "Change Password" })
        )
    );
};

var createChangePasswordWindow = function createChangePasswordWindow(csrf) {
    ReactDOM.render(React.createElement(ChangePasswordWindow, { csrf: csrf }), document.querySelector("#products"));
};

var loadFavoritesFromServer = function loadFavoritesFromServer(csrf) {
    sendAjax('GET', '/getFavorites', null, function (data) {
        ReactDOM.render(React.createElement(FavoriteList, { products: data.products, csrf: csrf }), document.querySelector("#products"));
    });
};

var setupFavorites = function setupFavorites(csrf) {
    ReactDOM.render(React.createElement(FavoriteList, { products: [], csrf: csrf }), document.querySelector("#products"));
    loadFavoritesFromServer(csrf);
};

var getFavoriteToken = function getFavoriteToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        csrfToken = result.csrfToken;
        setupFavorites(result.csrfToken);
    });
};

var favoritesButton = document.querySelector("#favoritesLink");
favoritesButton.addEventListener("click", getFavoriteToken);
