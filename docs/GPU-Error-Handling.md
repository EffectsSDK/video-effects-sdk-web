# GPU Error Handling in WebGPU

Google has enabled WebGPU support by default starting from Chrome 121. WebGPU is a cutting-edge web standard that offers low-level access to GPU hardware, enabling high-performance 3D graphics and general-purpose computing through JavaScript APIs.

Currently, WebGPU is available on a limited number of browsers based on the Chromium engine, but it is not yet supported in Firefox and Safari.

While WebGPU provides significant advantages for running machine learning models, it is not entirely stable. Issues may arise due to older GPU drivers or specific implementation quirks.

The Effects SDK, by default, attempts to infer ML models (particularly segmentation) using WebGPU if it is available.

## Automatic fallback to WASM

If a GPU error occurs **mid-session** while the segmentation pipeline is running on WebGPU, the SDK **automatically falls back to the WebAssembly (WASM) CPU backend**. On such an error the SDK releases the GPU inference session and re-initializes the running segmentation pipeline on WASM — **no application action is required to recover**.

The auto-fallback is triggered by any of the following:

 - GPU Device was lost (`ErrorCode.GPU_DEVICE_LOST`)
 - GPU uncaptured errors (`ErrorCode.GPU_UNCAPTUREDERROR`)
 - Detected GPU inference inconsistency (`ErrorCode.GPU_INFERENCE_INCONSISTENCY`)

When the SDK performs the fallback, it emits an informational event with the code `ErrorCode.CPU_FALLBACK`.

> The automatic WASM fallback is currently implemented for the Background Blur/Replacement (segmentation) effect. The Avatars effect uses a separate ML stack (MediaPipe) that selects a CPU delegate at initialization when the GPU delegate is unavailable, surfaced as a warning event. Other effects do not use WebGPU.

## Recommended application handling (optional)

Recovery is automatic, so no handling is strictly required. The suggestions below are optional, for diagnostics and for optimizing the experience on consistently problematic devices:

1. **Monitor the events.** An `ErrorCode.GPU_DEVICE_LOST`/`ErrorCode.GPU_UNCAPTUREDERROR` followed by an `ErrorCode.CPU_FALLBACK` confirms that the SDK detected a GPU problem and switched to WASM. Repeated occurrences in a session indicate the GPU path is unreliable on that device.

2. **Avoid the GPU path on known-bad devices.** The fallback re-initialization causes a brief, one-time processing hiccup while the WASM session is created. If a specific device/user repeatedly hits GPU errors, you may store that information and initialize the SDK with the WASM provider for that device/user in the future, avoiding the GPU attempt (and the hiccup) entirely:

```js
sdk.config({
  provider: "wasm", // "webgpu" | "wasm" | "auto"
});
```

Using `provider: "auto"` lets the SDK pick WebGPU when available and fall back to WASM when it is not.

## Reference

```ts
export enum ErrorCode {
  GPU_DEVICE_LOST = 1001,        // ErrorType.ERROR
  GPU_UNCAPTUREDERROR = 1010,    // ErrorType.ERROR
  CPU_FALLBACK = 3001,           // ErrorType.INFO — emitted when the SDK falls back to WASM
}

export interface ErrorObject {
  message: string;
  type: ErrorType;
  code?: ErrorCode;
  emitter?: ErrorEmitter;
  cause?: Error;
  data?: any;
}


sdk.onError((error) => {
  if (error?.code === ErrorCode.GPU_DEVICE_LOST || error?.code === ErrorCode.GPU_UNCAPTUREDERROR) {
    // GPU error detected. The SDK is automatically switching the
    // segmentation pipeline to the WASM backend — no action required.
  }

  if (error?.code === ErrorCode.CPU_FALLBACK) {
    // Fallback to WASM has been performed (INFO-level event).
  }
});


sdk.config({
  provider: "webgpu" | "wasm" | "auto",
});
```
