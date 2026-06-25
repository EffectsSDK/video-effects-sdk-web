# Self Hosted Assets
To use our SDK in production, we suggest moving all the required assets under your own domain and distribute them from there.

# List of assets
We provide the assets with every SDK update, which will include the ML model files, inference engine wasm files, and the SDK itself.

Example of assets structure:

* assets
  * models
    * model-1.0.1.tsvb
    * model-1.2.1.tsvb
    * model-3.1.1.tsvb
    * model-4.0.1.tsvb
    * model-5.5.0.tsvb
    * m-model-1.0.1.tsvb
    * m-model-3.1.1.tsvb
    * m-model-4.0.1.tsvb
    * m-model-5.5.0.tsvb
    * model-fd-1.1.0.tsvb
  * ort-wasm.wasm
  * ort-wasm-simd.wasm
  * ort-wasm-simd.jsep.wasm
  * tsvb-web.js

# Assets Hosting

 * Put the assets in a subfolder of your site, for example: https://mysite.com/esdk/
 * Load the SDK from https://mysite.com/esdk/tsvb-web.js
 * Configure the SDK to work with the right assets:
 ```
  const sdk = new window.tsvb({{CUSTOMER_ID}});
  sdk.config({sdk_url: 'https://mysite.com/esdk/'});
 ```

 # Recommendations

 * If the application will load the SDK from subdomains (or from other domains), you need to ensure that the files have the right Access-Control settings. For example:
 ```
  add_header 'Access-Control-Allow-Origin' '*';
 ```

 * To get rid of WASM MIME type warning add next line to /etc/nginx/mime.types
 ```
 application/wasm    wasm;
 ``` 

 * To speed up the assets loading, use an appropriate Cache-Control policy. Additionally, we recommend using CDN services like CloudFlare or CloudFront.