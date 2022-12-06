import React from "react";
import ReactDOM from "react-dom";
import { App } from './App'
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css'; //Me tira un warning pero en verdad si se usa!
import { Auth0Provider } from '@auth0/auth0-react';


ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-yx6fbhaw.us.auth0.com"
            clientId="ot6x2cqg72kdNuLILheiOnfg5O4JqDFU"
            redirectUri={window.location.origin}
            audience='http://localhost:3000'> 
            {/* audicente es el nombre en auth0  */}
            <App />
        </Auth0Provider>,
    </React.StrictMode>,
    document.getElementById('root')
)