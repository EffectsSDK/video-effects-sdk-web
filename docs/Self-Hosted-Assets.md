# Self Hosted Assets
To use our SDK in production, we suggest moving all the required assets under your own domain and distribute them from there.

# List of assets
We provide the assets with every SDK update, which will include the ML model files, the inference engine wasm file, and the SDK itself.

Example of assets structure:

* assets
  * models
    * model-1.6.0.tsvb
    * model-3.1.2.tsvb
    * model-4.0.2.tsvb
    * model-5.6.0.tsvb
    * m-model-1.6.0.tsvb
    * m-model-3.1.2.tsvb
    * m-model-4.0.2.tsvb
    * m-model-5.6.0.tsvb
    * model-fd-1.1.2.tsvb
  * ort-wasm-simd-threaded.asyncify.wasm
  * tsvb-web.js

An SDK update can bring new model files, which normally come under new names, so host the set you were provided rather than the one listed above.

The inference engine is a single WASM file - `ort-wasm-simd-threaded.asyncify.wasm`. By default the SDK loads it from the same directory where the SDK script is placed, so with the structure above no extra configuration is needed. To host it at a different location, pass its URL explicitly:

```
sdk.config({
  wasmPaths: {
    wasm: 'https://mysite.com/esdk/ort-wasm-simd-threaded.asyncify.wasm'
  }
});
```

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
