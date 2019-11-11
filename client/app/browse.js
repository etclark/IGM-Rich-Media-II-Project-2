const ProductList = function(props) {
    if(props.products.length === 0){
        return (
            <div className="productList">
                <h3 className="emptyProduct">No Products Yet</h3>
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
                </div>    
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

const setup = (csrf) => {
    ReactDOM.render(
        <ProductList products={[]} csrf={csrf} />, document.querySelector("#products")
    );
    
    loadProductsFromServer(csrf);
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});