let csrfToken;

const saveProduct = (e) => {
    e.preventDefault();
    sendAjax('POST', $(`#${e.target.parentElement.id}`).attr("action"), $(`#${e.target.parentElement.id}`).serialize(), function() {
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
                    <h2 className="productName">{product.name} </h2>
                    <div className="productImageContainer">
                        <img className="productImage" alt="product image" src={product.imageLink}/>
                    </div>
                    <h4 className="productPrice"> Price: ${product.price} </h4>
                    <h2 className="buyBtn buyBtn-2 buyBtn-sep icon-cart"><a href={product.referLink}>Buy Now!</a></h2>
                    <form
                    id={product._id}
                    name="saveForm"
                    onClick = {saveProduct}
                    action="/saver"
                    method="POST"
                    className="saveFavorite">
                    <input type="hidden" name="_csrf" value={props.csrf} />
                    <input type="hidden" name="_id" value={product._id} />
                    <a href="/browse" onclick="return false;" className="favBtn">Favorite</a>
                    {/* <input className="saveFavoriteSubmit" type="submit" value=""/> */}
                    </form>   
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

const loadProductsByTag = (csrf, tag) => {
    //HELP CAN'T PASS TAG TO FUNCTION THAT NEEDS IT!
    const searchTerm = tag;
    sendAjax('GET', '/getProductsByTag', {tag}, (data, searchTerm) => {
        ReactDOM.render(
            <ProductList products={data.products} csrf={csrf} />, document.querySelector("#products")
        );
    });
};

const setupProducts = (csrf) => {
    const changePassLink = document.querySelector("#changePassLink");
   
    changePassLink.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });

    ReactDOM.render(
        <ProductList products={[]} csrf={csrf} />, document.querySelector("#products")
    );
    loadProductsFromServer(csrf);  
};

const getProductToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        csrfToken = result.csrfToken;
        setupProducts(result.csrfToken);
    });
};

var browseButton = document.querySelector("#browseLink");
browseButton.addEventListener("click", getProductToken);

//Sorting Buttons
var pokemonButton = document.querySelector("#pokemonButton");
pokemonButton.addEventListener("click", function(){
    loadProductsByTag(csrfToken, "pokemon");
});

var zeldaButton = document.querySelector("#zeldaButton");
zeldaButton.addEventListener("click", function(){
    loadProductsByTag(csrfToken, "zelda");
});

var marioButton = document.querySelector("#marioButton");
marioButton.addEventListener("click", function(){
    loadProductsByTag(csrfToken, "mario");
});

var borderlandsButton = document.querySelector("#borderlandsButton");
borderlandsButton.addEventListener("click", function(){
    loadProductsByTag(csrfToken, "borderlands");
});

var metroidButton = document.querySelector("#metroidButton");
metroidButton.addEventListener("click", function(){
    loadProductsByTag(csrfToken, "metroid");
});

$(document).ready(function() {
    getProductToken();
});