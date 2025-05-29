# Web Video Effects SDK

# Real-time AI-Powered Video Effects SDK


https://github.com/user-attachments/assets/782ad06d-d0fc-4590-8dc5-18703d41e7e7


**Compatible with All Browsers and Effortlessly Integrates**

Effortlessly integrate the most sought-after video effects into your product. Fully compatible with all browsers. Runs directly on user devices with CPU/GPU-optimized inference, delivering high-quality results. Easily incorporate custom processing or analytics in a single step.

### Perfect for:
- **Video Conferencing Platforms**
- **Live Streaming Solutions**
- **Remote Work and Collaboration Tools**
- **Social Media and Content Creation Apps**
- **E-Learning and Online Education Platforms**
- **Healthcare and Telemedicine Apps**
- **Virtual Events and Webinars**
- **Video Editing and Recording Software**
- **Customer Support and Communication Tools**

## See it in Action
- [AI Webcam Effects - Chrome Extension](https://chromewebstore.google.com/detail/ai-webcam-effects-+-recor/iedbphhbpflhgpihkcceocomcdnemcbj)

## Simple Online Demo
- [Live Demo](https://effectssdk.ai/sdk/dev/demo-latest.html)

## Features

- **Virtual Backgrounds**: Replace your background with any image or video for a polished, professional look.
- **Desktop Capture Background**: Use your desktop screen as a dynamic background for creative presentations.
- **Background Blur**: Keep the focus on you by blurring out distracting surroundings.
- **Beautification & Touch-Up**: Enhance your appearance with real-time skin smoothing and touch-up effects.
- **Auto Framing**: Stay perfectly centered in the frame with smart, automatic cropping.
- **Auto Color Correction**: Achieve balanced, professional-grade colors in any lighting condition.
- **Custom Layouts**: Arrange multiple video streams or elements for a clean, organized look.
- **Professional Lower-Thirds**: Add titles, logos, and captions seamlessly to your videos.
- **Video & Image Overlays**: Layer graphics, logos, or animations for branding and creativity.
- **Color Filters (LUT-Based)**: Apply cinematic color grading with customizable LUT filters.
- **Low-Light Mode**: Brighten and clarify videos in dimly lit environments.
- **Video Clarity & Sharpness**: Enhance details and sharpness for crystal-clear video quality.

## Trial Evaluation

A Customer ID is required for the Effects SDK.

To receive a new trial Customer ID, please fill out the contact form on the [effectssdk.ai](https://effectssdk.ai/request-trial) website.

## NPM

```terminal
npm install effects-sdk
```

Usage of NPM package:

```typescript

import { tsvb } from 'effects-sdk';

const sdk = new tsvb('{CUSTOMER_ID}');

//versions of wasm files should be matched with SDK version
sdk.config({
    preset: 'balanced',
    provider: 'webgpu',
    wasmPaths: { 
            'ort-wasm.wasm': 'https://effectssdk.ai/sdk/web/{VERSION}/ort-wasm.wasm',
            'ort-wasm-simd.wasm': 'https://effectssdk.ai/sdk/web/{VERSION}/ort-wasm-simd.wasm'
        }
});

sdk.preload();
sdk.cache();

```

## Script Tag

```javascript
<script crossorigin="anonymous" src="https://effectssdk.ai/sdk/web/{VERSION}/tsvb-web.js"></script>
```

Usage of script tag instance:
```javascript

const sdk = new window.tsvb('{CUSTOMER_ID}');

sdk.config({
    preset: 'balanced',
    provider: 'webgpu'
});

sdk.preload();
sdk.cache();

```

## Usage with Webcam

```javascript
const sdk = new window.tsvb('{CUSTOMER_ID}');

sdk.config({
    preset: 'balanced',
    provider: 'webgpu'
});

sdk.preload();
sdk.cache();

sdk.onError((e) => {
    switch (e.type) {
        case 'error':
          console.error(e.message);
          break;
        case 'info':
          console.log(e.message);
          break;
    }
});

let video = document.getElementById('videoElement');

sdk.onReady = () => {
    console.log('SDK is ready let\'s run it');
    sdk.run();
    sdk.setBackgroundColor(0x00ff00);
    sdk.setBackground('color'); //😎
};

window.addEventListener('load', function () {
    sdk.clear();
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        //set stream to sdk
        sdk.useStream(stream);
        //draw sdk results to canvas
        //sdk.toCanvas(canvas);
        //draw sdk results to MediaStream
        video.srcObject = sdk.getStream();
    });
});

```


## Documentation
- [API Reference](https://effectssdk.ai/sdk/web/docs/classes/tsvb.html)
- [Feature Usage](docs/Features-Usage-Examples.md)
- [Best Practices](docs/Best-Practices.md)
- [Error Handling](docs/General-Error-Handling.md)
- [Self Hosted Assets](docs/Self-Hosted-Assets.md)
- [License Server for On-Premises Solutions](docs/License-Server-for-On-Premises-Solutions.md)

## Integrations
- [Electron with Native Inference](https://github.com/EffectsSDK/electron-integration-sample)
- [LiveKit Web](https://github.com/EffectsSDK/livekit-js-integration)

## Requirements

- Obtaining Effects SDK Customer ID
- SSL to get MediaStream from browser
- Support of WebGL 2.0
- WebGPU support (optional)
