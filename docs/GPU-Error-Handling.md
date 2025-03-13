# GPU Error Handling in WebGPU

Google has enabled WebGPU support by default starting from Chrome 121. WebGPU is a cutting-edge web standard that offers low-level access to GPU hardware, enabling high-performance 3D graphics and general-purpose computing through JavaScript APIs.

Currently, WebGPU is available on a limited number of browsers based on the Chromium engine, but it is not yet supported in Firefox and Safari.

While WebGPU provides significant advantages for running machine learning models, it is not entirely stable. Issues may arise due to older GPU drivers or specific implementation quirks.

The Effects SDK, by default, attempts to infer ML models (particularly segmentation) using WebGPU if it is available. However, if a GPU error occurs during processing, the SDK cannot automatically fall back to CPU processing. This fallback must be handled on the application side, taking into account the specific business logic of the application.

The Effects SDK provides mechanisms to track two types of errors:

 - GPU Device was lost
 - GPU uncaptured errors

Here are some suggestions on how to handle these errors:

1. If your application encounters one of these errors, it indicates that running ML models on the GPU is currently broken and will not be automatically recovered.

2. In some cases, this issue may persist, while in others, it might be a one-time occurrence due to external factors. Before proceeding, you may want to count the number of errors that occur during a session.

3. To resolve the issue, you should reload the application page and switch the SDK provider to WebAssembly (WASM) for the affected user. Additionally, it is advisable to store information about the current device/user and always initialize the SDK with the WASM provider for that specific device/user in the future.

By following these steps, you can ensure a more robust and reliable experience for your users when dealing with GPU-related errors in WebGPU.

```
export enum ErrorCode {
  GPU_DEVICE_LOST = 1001,
  GPU_UNCAPTUREDERROR = 1010,
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
  if (error?.code == 1001 || error?.code == 1010) {
      //GPU error -> need to do the wasm fallback
  }
});


sdk.config({
  provider: "webgpu" | "wasm",
});

```

 