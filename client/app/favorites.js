const handleFavorite = (e) => {
    sendAjax('POST', $("#productForm").attr("action"), $("#productForm").serialize(), function() {
        let csrfToken = document.querySelector("#csrfToken").value;
        loadFavoritesFromServer(csrfToken);
    });
    return false;
};

const handlePasswordChange = (e) => {
    e.preventDefault();
    $("#errorMessage").animate({width:'hide'},350);
    if($("#currentPass").val() == '' || $("#newPass").val() == ''){
        handleError("All fields are required to proceed");
        return false;
    }

    sendAjax('POST', $("#changePasswordForm").attr("action"), $("#changePasswordForm").serialize(), redirect);
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

const FavoriteList = function(props) {
    if(props.products === undefined){
        props.products = [];
        return (
            <div className="favoriteList">
                <h3 className="emptyProduct">No Favorites Yet</h3>
            </div>
        );
    }

    const productNodes = props.products.map(function(product) {
        return (
            <div key={product._id} className="product">
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

const ChangePasswordWindow = (props) => {
    return (
        <form id="changePasswordForm"
        name="changePasswordForm"
        onSubmit = {handlePasswordChange}
        action="/changePassword"
        method="POST"
        className="mainForm"
        >
        <h3><label htmlFor="currentPass">Current Password: </label></h3>   
        <input id="pass" type="password" name="currentPass" placeholder="Current Password"/> 
        <h3><label htmlFor="newPass">New Password: </label></h3>     
        <input id="pass2" type="password" name="newPass" placeholder="New Password"/> 
        <input type="hidden" name="_csrf" value={props.csrf} />
        <h6><input className="formSubmit" type="submit" value="Change Password"/></h6>
        </form>
    );
};

const createChangePasswordWindow = (csrf) => {
    ReactDOM.render(
        <ChangePasswordWindow csrf={csrf} />,
        document.querySelector("#products")
    );
};

const loadFavoritesFromServer = (csrf) => {
    sendAjax('GET', '/getFavorites', null, (data) => {
        ReactDOM.render(
            <FavoriteList products={data.products} csrf={csrf} />, document.querySelector("#products")
        );
    });
};

const setupFavorites = (csrf) => {
    const changePassLink = document.querySelector("#changePassLink");
   
    changePassLink.addEventListener("click", (e) => {
        e.preventDefault();
        createChangePasswordWindow(csrf);
        return false;
    });

    ReactDOM.render(
        <FavoriteList products={[]} csrf={csrf} />, document.querySelector("#products")
    );   
    loadFavoritesFromServer(csrf);
};

const getFavoriteToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setupFavorites(result.csrfToken);
    });
};

var favoritesButton = document.querySelector("#favoritesLink");
favoritesButton.addEventListener("click", getFavoriteToken);

// $(document).ready(function() {
//     // getFavoriteToken();
    
// });