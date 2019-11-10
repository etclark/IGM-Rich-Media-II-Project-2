const handleFavorite = (e) => {
    // e.preventDefault();
    // $("#errorMessage").animate({width:'hide'},350);
    // if($("#errorName").val() == '' || $("#errorAge").val() == '') {
    //     handleError("RAWR! All fields are required");
    //     return false;
    // }
    sendAjax('POST', $("#productForm").attr("action"), $("#productForm").serialize(), function() {
        let csrfToken = document.querySelector("#csrfToken").value;
        loadFavoritesFromServer(csrfToken);
    });
    return false;
};

const deleteProduct = (e) => {
    e.preventDefault();
    //console.dir(e.target.id)
    sendAjax('POST', $(`#${e.target.id}`).attr("action"), $(`#${e.target.id}`).serialize(), function() {
        let csrfToken = document.querySelector("#csrfToken").value;
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

const FavoriteList = function(props) {
    if(props.products.length === 0){
        return (
            <div className="favoriteList">
                <h3 className="emptyProduct">No Favorites Yet</h3>
            </div>
        );
    }

    const productNodes = props.products.map(function(product) {
        return (
            <div key={product._id} className="product">
                <img src="/assets/img/errorface.jpeg" alt="error face" className="errorFace" />
                <div className="dataContainer">
                <h3> Name: {product.name} </h3>
                <img alt="product image" src={product.imageLink} />
                <h3> Price: ${product.price} </h3>
                <h2> Buy Now!: ${product.referLink} </h2>
                <form
                id={product._id}
                name="deleteForm"
                onSubmit = {deleteProduct}
                action="/deleter"
                method="POST"
                className="deleteFavorite"
                >
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="_id" value={product._id} />
                <input className="deleteFavoriteSubmit" type="submit" value="Delete Favorite"/>
                </form>
                </div>    
            </div>
        );
    });

    return (
        <div className="favoriteList">
            {productNodes}
        </div>
    );
};

const loadFavoritesFromServer = (csrf) => {
    sendAjax('GET', '/getFavorites', null, (data) => {
        ReactDOM.render(
            <FavoriteList products={data.products} csrf={csrf} />, document.querySelector("#products")
        );
    });
};

const setup = (csrf) => {
    // ReactDOM.render(
    //     <ProductForm csrf={csrf} />, document.querySelector("#makeProduct")
    // );

    ReactDOM.render(
        <FavoriteList products={[]} csrf={csrf} />, document.querySelector("#products")
    );
    
    loadFavoritesFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});