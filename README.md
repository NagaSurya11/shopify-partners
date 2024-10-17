Do npm install on the repository to install required dependencies

if nx command not working try installing nx globally 
(Optional)
npm i nx -g

If you are using nx extension in vs code it will be easy to start applicatons using gui


To run server app

1. nx run server:serve:development

backend server will run on port 3333 and graphql will expose on api http://localhost:3333/api/graphql

2. nx run client:serve

front end react app will run on port 4200 http://localhost:4200

3. i have added authentication for that you need to run keycloak on your local machine using docker or using open jdk

https://www.keycloak.org/guides

kindly refer the url to install keycloak

once you started keycloak create a realm dev and create a client with id "shopify-partners-client"

and create one user

once done you can start launching the fe application

once you logged in i have consoled the access token on console copy and use it on Authorization headers on graphql to make use of graphql apis

As for now i have done BE and from today i will start FE works for creating bundles and analyzing bundles via dashboard