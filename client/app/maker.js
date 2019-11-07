const handleDomo = (e) => {
    e.preventDefault();
    $("#domoMessage").animate({width:'hide'},350);
    if($("#domoName").val() == '' || $("#domoAge").val() == '') {
        handleError("RAWR! All fields are required");
        return false;
    }
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    return false;
};

const deleteDomo = (e) => {
    e.preventDefault();
    sendAjax('POST', $("#deleteForm").attr("action"), $("#deleteForm").serialize(), function() {
        console.log("Deletion Complete maybe?");
    });
    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
        name="domoForm"
        onSubmit = {handleDomo}
        action="/maker"
        method="POST"
        className="domoForm"
        >
        <label htmlFor="username">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>     
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/> 
        <label htmlFor="price">Price: </label>     
        <input id="domoPrice" type="text" name="price" placeholder="Example: 1.00"/> 
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0){
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <div className="dataContainer">
                <h3> Name: {domo.name} </h3>
                <h3> Age: {domo.age} </h3>
                <h3> Price: ${domo.price} </h3>
                <form
                id="deleteForm"
                name="deleteForm"
                onSubmit = {deleteDomo}
                action="/deleter"
                method="POST"
                className="deleteDomo"
                >
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="_id" value={domo._id} />
                <input className="deleteDomoSubmit" type="submit" value="Delete Domo"/>
                </form>
                </div>    
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = (csrf) => {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});