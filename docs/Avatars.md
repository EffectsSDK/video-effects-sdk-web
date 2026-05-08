# Avatars effect

The Avatars effect renders a 3D avatar model on top of the user's face. Using ML algorithms, facial expressions, head rotation, and head position are transferred to the virtual avatar. The effect tracks one face at a time.

The effect uses MediaPipe's GPU delegate (WebGL2) when available, with automatic fallback to a WASM CPU delegate. The fallback emits a non-critical warning via `sdk.onError` but does not prevent the effect from running.

MediaPipe's `FaceLandmarker` runs inside a Web Worker that the SDK spawns. The worker dynamically imports MediaPipe, its WASM, and the model from the URLs you supply, so none of these assets ship in the SDK bundle.

[Avatar Demo](https://effectssdk.ai/sdk/dev/avatars.html)

## 3D Avatar

A 3D mesh with Apple ARKit Blendshapes support. The SDK accepts a file in GLB format as input.

## How to use

Before using the Avatars effect, the SDK must be ready - see [Features Usage Examples](./Features-Usage-Examples.md#general-details).

To activate the Avatars effect, use `sdk.loadAvatars()` and `sdk.enableAvatars()`.
The URL of the GLB file is passed to `sdk.loadAvatars()`; you can also pass URLs to a self-hosted or alternative host for Three.js and the MediaPipe face landmarker.

Example
```javascript
await sdk.loadAvatars('https://example.com/avatar.glb');
sdk.enableAvatars();
```

For a self-hosted setup you can pass custom URLs for the dependencies - Three.js and the MediaPipe face landmarker.

`sdk.loadAvatars()` can also be used to switch the avatar later - pass a new URL string or a config with a new `modelUrl`. Configuration fields like `threeJs`, `faceLandmarker`, and `faceScaleFactor` are merged over previously stored values, so once supplied they do not need to be repeated.

`sdk.loadAvatars()` can also be called with no argument (or with a config that omits `modelUrl`) - this downloads and initializes MediaPipe and Three.js without loading any avatar model. Useful for warming up dependencies before the user enables the effect; the model URL can be supplied in a later call.

To release resources, use `sdk.unloadAvatars()`. This method releases GPU and CPU resources, including textures, meshes, models, and loaded modules.
Note: `sdk.disableAvatars()` does not release resources - it only turns off applying the effect.

Example
```javascript
const mediapipe = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/+esm';
const wasm = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm';
const model = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

const THREE = 'https://cdn.jsdelivr.net/npm/three@0.183.2/+esm';
const GLTFLoader = 'https://cdn.jsdelivr.net/npm/three@0.183.2/examples/jsm/loaders/GLTFLoader.js/+esm';

await sdk.loadAvatars({ 
    modelUrl: 'https://example.com/avatar.glb',
    threeJs: { THREE, GLTFLoader },
    faceLandmarker: { mediapipe, wasm, model },
    faceScaleFactor: 2.0  // optional, default 1.75
});
```

`faceLandmarker.mediapipe` accepts a URL string only — the worker loads the MediaPipe ESM module via dynamic `import()`. Pre-loaded module objects are not supported because Web Workers cannot receive non-serializable objects.

If your project already uses Three.js, you can pass it directly to the SDK.

Example
```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

await sdk.loadAvatars({ 
    modelUrl: 'https://example.com/avatar.glb',
    threeJs: { THREE, GLTFLoader }
});
```

### Runtime options

`sdk.setAvatarsOptions()` updates options that do not require reloading resources. The same fields can also be passed inside the `sdk.loadAvatars()` config object.

| Option | Type | Default | Description |
|:---|:---|:---|:---|
| `faceScaleFactor` | `number` | `1.75` | How large the avatar appears relative to the detected face. |

```javascript
sdk.setAvatarsOptions({ faceScaleFactor: 2.0 });
```

### Error handling

`sdk.loadAvatars()` returns a promise that resolves when loading/initialization succeeds and rejects on a loading/initialization error or when loading is aborted.

When `sdk.loadAvatars()` is used, critical initialization/loading errors are not delivered to the `sdk.onError` handler; if the `sdk.loadAvatars()` promise rejects, the effect was not initialized or the model failed to load. `sdk.onError` is still used for non-critical errors, warnings, and informational messages, as well as for runtime errors during pipeline operation.

If `sdk.loadAvatars()` has already completed successfully and the effect is initialized, a subsequent `sdk.loadAvatars()` call loads a new avatar and switches to it once loading completes. If this subsequent call rejects with a non-abort error, the new avatar failed to load; the effect continues running with the previously loaded avatar.

If loading/initialization is aborted, an **AbortError** is returned.

Calling `sdk.unloadAvatars()` before `sdk.loadAvatars()` completes results in **AbortError**.
Calling `sdk.loadAvatars()` again before the previous `sdk.loadAvatars()` completes causes the previous call to throw **AbortError**.
Calling `sdk.destroy()` before `sdk.loadAvatars()` completes results in **AbortError**.

Example
```javascript
const firstLoadPromise = sdk.loadAvatars('https://example.com/avatar.glb');
sdk.unloadAvatars();

try {
    await firstLoadPromise;
}
catch (e) {
    if (e.name === "AbortError") {
        console.log("AbortError");
    }
    else {
        // Handle an error.
    }
}
```

## Content-Security-Policy

If you use Content-Security-Policy, the following entries must be added to the relevant directives in the header:

| Directive | Sources |
|:---:|:---:|
| script-src | 'wasm-unsafe-eval' |
| worker-src | blob: |
| img-src | blob: |
| media-src | blob: |

`worker-src blob:` is required because the SDK spawns the FaceLandmarker worker from an inline Blob URL. If your CSP omits `worker-src`, browsers fall back to `child-src`, then `script-src` — make sure whichever applies allows `blob:`.

To load modules from the CDN and Google Storage, add the following sources on top of the entries from the previous table - they are combined per directive in a single header (see example below):

| Directive | Sources | Purpose |
|:---:|:---:|:---:|
| script-src | https://cdn.jsdelivr.net | Loading Three.js and MediaPipe code |
| connect-src | https://cdn.jsdelivr.net https://storage.googleapis.com | wasm and models |

If you pass custom URLs to `sdk.loadAvatars()` for any of the dependencies (Three.js, GLTFLoader, MediaPipe vision module, MediaPipe wasm, MediaPipe model), replace the listed CDN sources with the actual origins of those URLs - or with `'self'` when the assets are served from the same origin as your application.

Example header

```
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'wasm-unsafe-eval' https://cdn.jsdelivr.net; worker-src 'self' blob:; connect-src 'self' blob: https://cdn.jsdelivr.net https://storage.googleapis.com; style-src 'self'; img-src 'self'  blob:; media-src 'self' blob:;"
```
