

exports.getFacebookData = (accessToken, apiPath, callback) => {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: `/${apiPath}?access_token=${accessToken}`, //apiPath example: '/me/friends'
        method: 'GET'
    };
    //temporatory
    callback({
        gender: "female"
    });
}