//Documentation: https://stackoverflow.com/questions/28449363/why-is-this-http-request-not-working-on-aws-lambda
const http = require('https')
exports.handler = async (event) => {
    let planta = event.plant.replace(" ","%20")
    return httprequest(`/api/v1/plants/search?q=${planta}&token=RoW3Wd_z1BrD8iwOZKNXcLsO9Jn3APngqBzDeVuC8yI`).then((data) => {
        return httprequest(`/api/v1/plants/${data.data[0].id}?token=RoW3Wd_z1BrD8iwOZKNXcLsO9Jn3APngqBzDeVuC8yI`).then((data2) => {
            const response = {
                statusCode: 200,
                body: data2,
            };
        return response;
        });
    });
};

function httprequest(pat) {
     return new Promise((resolve, reject) => {
        const options = {
            host: 'trefle.io',
            path: pat,
            //port: 443,
            method: 'GET'
        };
        const req = http.request(options, (res) => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        req.on('error', (e) => {
          reject(e.message);
        });
        // send the request
       req.end();
    });
}