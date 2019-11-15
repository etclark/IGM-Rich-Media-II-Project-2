const handleError = (message) => {
    $("#errorMessage").text(message);
    $("#errorMessage").animate({width:'toggle'},350);
};

const redirect = (response) => {
    $("#errorMessage").animate({width:'hide'},350);
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data, 
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            //console.dir(xhr.responseText);
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};

//Need to get callback working with getToken!!!!! SHOULD BE DOABLE!
const getToken = (callback) => {
    let callbackF = callback;
    sendAjax('GET', '/getToken', null, (result) => {
        callbackF(result.csrfToken);
    });
};