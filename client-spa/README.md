# React SPA + .NET Core API + Azure AD Login Sample

What the sample does:
 * You can Login / Logout
 * Acquire Token to access your API
 * Access MS Graph on behalf of the logged in user.

The solution contains a

* React SPA bootstrapped with create-react-app
  * `yarn start` starts the development experience
  * the API is accessed via proxy definition (see `package.json`)
* .NET Core web application that exposes an authorized API (`ProfileController`)
  * this sample has been developed for development. it is not meant to be deployed somewhere

## Disclaimer:

The original sample states that you shouldn't stick your access token somewhere visible and it is only for dev purposes.
So I'll say the same here.

## Setup of the Code

### Client

* Rename `.env.sample` to `.env.local` and replace the values defined therein with the proper ones as they pop out of your azure set-up
* Run `yarn build:cordova` to initially populate the `www` folder inside `../mobile-app`

### Server

* Rename `appsettings.sample.json` to `appsettings.json` and fill in the necessary parameters from your Azure configuration

## Setup in Azure:

* Application for the API
  * Define the permissions that the API has
  * Define what you expose via API
  * Has to define a secret to be able to use resources like MS Graph
* Application for the Client
  * Authentication / Platform Config -> Single Page App w/ correct redirect URI
  * Define proper API Permission:
    * Login and the Exposed API from the first Application
    
 
## Relevant links

* Derived from this MS sample: https://github.com/Azure-Samples/ms-identity-javascript-react-spa-dotnetcore-webapi-obo
* Instead of acquiring the token after login you may also get the API token directly upon login: 
  https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-implicit-grant-flow