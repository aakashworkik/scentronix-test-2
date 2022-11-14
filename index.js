var https = require("https");
var http = require('http')

function httpRequest(server, timeout) {
    return new Promise(function(resolve, reject) {
        // setting 5 second timeout on each request
        const timeoutObj = setTimeout(() => {
            reject('TIMEOUT')
        }, timeout);

        if(server.includes("https://")){
            var req = https.get(server, (res) => {
                // reject on bad status
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    clearTimeout(timeoutObj);
                    return reject('Server is offline');
                }else{
                    clearTimeout(timeoutObj);
                    return resolve('')
                }
            });
        }else{
            var req = http.get(server, (res) => {
                // reject on bad status
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    clearTimeout(timeoutObj);
                    return reject('Server is offline');
                }else{
                    clearTimeout(timeoutObj);
                    return resolve('')
                }
            });
        }
        
        // reject on request error
        req.on('error', () => {
            clearTimeout(timeoutObj);
            // This is not a "Second reject", just a different sort of failure
            reject('Server is offline from err');
        });
        // IMPORTANT
        req.end();
    });
}
   
exports.findServer = function(servers){
    return new Promise((resolve, reject) => {
        if (servers && servers.length > 0){
            // Creating parallel request
            Promise.allSettled(servers.map((server) => httpRequest(server.url, 5000))).then(results => {
                let onlineServers = []
                // checking online servers using status
                for(let i=0; i<results.length; i++){
                    if(results[i].status === "fulfilled"){
                        onlineServers.push(servers[i]);
                    }
                }
                // if online server then sorting according to priority
                if(onlineServers.length > 0){
                    let sortedServers = onlineServers.sort((a,b) => a.priority - b.priority);
                    // return url of first sorted server
                    resolve(sortedServers[0].url)
                }else{
                    reject("Servers are offline")
                }
            })
            .catch(() => reject("Servers are offline"))
        }else{
            reject("Servers not found")
        }
    })
  }