
'use strict';

const Hapi=require('hapi');
const vision= require('vision');
const https= require('https');
const url = "https://data.cityofnewyork.us/resource/swhp-yxa4.json";//"http://nflarrest.com/api/v1/crime";

//Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

//Add the index.html route
server.route({
    method:'GET',
    path:'/',
    handler:function(request,h){
        return '<h1> You have reached the homepage</h1>';
    }
});
//Add the content.html route
https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
        body += data;
    });

    var data = res.on("end", () => {
        body = JSON.parse(body);
        //body.forEach(x=>console.log(x.job_category));

        server.route({
            method:'GET',
            path:'/content.html',
            handler: function(req,h){
                return h.view('content', {dataOutput : body});
            }
        });
    });
});

//Start a server
async function start(){
    await server.register(vision);
    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo:__dirname
    });
    try{
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();