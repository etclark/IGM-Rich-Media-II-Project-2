"use strict";

var ProductList = function ProductList(props) {
    if (props.products.length === 0) {
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
            React.createElement("img", { src: "/assets/img/errorface.jpeg", alt: "error face", className: "errorFace" }),
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

var setup = function setup(csrf) {
    // ReactDOM.render(
    //     <ProductForm csrf={csrf} />, document.querySelector("#makeProduct")
    // );

    ReactDOM.render(React.createElement(ProductList, { products: [], csrf: csrf }), document.querySelector("#products"));

    loadProductsFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleFavorite = function handleFavorite(e) {
    // e.preventDefault();
    // $("#errorMessage").animate({width:'hide'},350);
    // if($("#errorName").val() == '' || $("#errorAge").val() == '') {
    //     handleError("RAWR! All fields are required");
    //     return false;
    // }
    sendAjax('POST', $("#productForm").attr("action"), $("#productForm").serialize(), function () {
        var csrfToken = document.querySelector("#csrfToken").value;
        loadFavoritesFromServer(csrfToken);
    });
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

// const ProductForm = (props) => {
//     return (
//         <form id="productForm"
//         name="productForm"
//         onSubmit = {handleProduct}
//         action="/maker"
//         method="POST"
//         className="productForm"
//         >
//         <label htmlFor="username">Name: </label>
//         <input id="productName" type="text" name="name" placeholder="Product Name"/>
//         <label htmlFor="age">Age: </label>     
//         <input id="productAge" type="text" name="age" placeholder="product Age"/> 
//         <label htmlFor="price">Price: </label>     
//         <input id="productPrice" type="text" name="price" placeholder="Example: 1.00"/> 
//         <input id="csrfToken" type="hidden" name="_csrf" value={props.csrf} />
//         <input className="makeProductSubmit" type="submit" value="Make product"/>
//         </form>
//     );
// };

var FavoriteList = function FavoriteList(props) {
    if (props.products.length === 0) {
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
            React.createElement("img", { src: "/assets/img/errorface.jpeg", alt: "error face", className: "errorFace" }),
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

var loadFavoritesFromServer = function loadFavoritesFromServer(csrf) {
    sendAjax('GET', '/getFavorites', null, function (data) {
        ReactDOM.render(React.createElement(FavoriteList, { products: data.products, csrf: csrf }), document.querySelector("#products"));
    });
};

var setup = function setup(csrf) {
    // ReactDOM.render(
    //     <ProductForm csrf={csrf} />, document.querySelector("#makeProduct")
    // );

    ReactDOM.render(React.createElement(FavoriteList, { products: [], csrf: csrf }), document.querySelector("#products"));

    loadFavoritesFromServer(csrf);
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
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
