"use strict";

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
        var csrfToken = document.querySelector("#csrfToken").value;
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
                    "h3",
                    null,
                    " Name: ",
                    product.name,
                    " "
                ),
                React.createElement("img", { alt: "product image", src: product.imageLink }),
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
                    " Buy Now!: $",
                    product.referLink,
                    " "
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
    var changePassLink = document.querySelector("#changePassLink");

    changePassLink.addEventListener("click", function (e) {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });

    ReactDOM.render(React.createElement(FavoriteList, { products: [], csrf: csrf }), document.querySelector("#products"));
    loadFavoritesFromServer(csrf);
};

var getFavoriteToken = function getFavoriteToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setupFavorites(result.csrfToken);
    });
};

$(document).ready(function () {
    getFavoriteToken();
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

//Need to get callback working with getToken!!!!! SHOULD BE DOABLE!
// const getToken = (callback) => {
//     let callbackF = callback;
//     sendAjax('GET', '/getToken', null, (result) => {
//         callbackF(result.csrfToken);
//     });
// };
