const saveProduct = (e) => {
    e.preventDefault();
    sendAjax('POST', $(`#${e.target.id}`).attr("action"), $(`#${e.target.id}`).serialize(), function() {
        let csrfToken = document.querySelector("#csrfToken").value;
        loadProductsFromServer(csrfToken);
    });
    return false;
};

const ProductList = function(props) {
    if(props.products === undefined){
        props.products = [];
        return (
            <div className="productList">
                <h3 className="emptyProduct">No Products Yet</h3>
            </div>
        );
    }

    const productNodes = props.products.map(function(product) {
        return (
            <div key={product._id} className="product">
                <div className="dataContainer">
                <h3>{product.name} </h3>
                <div class="productImageContainer">
                    <img class="productImage" alt="product image" src={product.imageLink}/>
                </div>
                <h3> Price: ${product.price} </h3>
                <h2> Buy Now!:</h2>
                <h6> ${product.referLink} </h6>
                </div>
                <form
                id={product._id}
                name="saveForm"
                onSubmit = {saveProduct}
                action="/saver"
                method="POST"
                className="saveFavorite"
                >
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="_id" value={product._id} />
                <input className="saveFavoriteSubmit" type="submit" value="Save Favorite"/>
                </form>    
            </div>
        );
    });

    return (
        <div className="productList">
            {productNodes}
        </div>
    );
};

const loadProductsFromServer = (csrf) => {
    sendAjax('GET', '/getProducts', null, (data) => {
        ReactDOM.render(
            <ProductList products={data.products} csrf={csrf} />, document.querySelector("#products")
        );
    });
};

const setupProducts = (csrf) => {
    ReactDOM.render(
        <ProductList products={[]} csrf={csrf} />, document.querySelector("#products")
    );
    loadProductsFromServer(csrf);  
};

const getProductToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
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