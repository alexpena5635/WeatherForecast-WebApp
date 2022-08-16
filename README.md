<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/alexpena5635/WeatherForecast-WebApp">
  </a>

  <h3 align="center">WeatherForecast-WebApp</h3>

  <p align="center">
    7-Day weather forecast website designed and developed for the interview process of Animal Farm Family.
    <br />
  </p>
</div>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key at [https://developer.foreca.com/](https://developer.foreca.com/)
2. Clone the repo
   ```sh
   git clone https://github.com/alexpena5635/WeatherForecast-WebApp.git
   ```
3. Install NPM packages in the `/backend/` directory.
   ```sh
   npm install
   ```
4. Save your api key to a file, and read it into in `/backend/weatherapi.js`
   ```js
    const authFilePath = "/auth.txt"; 
    const tokenFile = __dirname + authFilePath;
   ```
5. Start the server
   ```sh
   node app.js
   ```
6. Navigate to `http://localhost:8080` to run the WebApp

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: http://www.linkedin.com/in/alex-pe%C3%B1a-944095241