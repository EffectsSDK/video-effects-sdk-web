# WebGL Context Loss and Recovery

## Overview

In some environments, the WebGL context used by the SDK for rendering effects can be lost. This typically happens due to GPU driver crashes, operating system power management, or browser-specific resource handling.

**Browser Specifics:**
This issue primarily affects **Firefox** and **Safari**. Google Chrome utilizes a different internal approach to context management, and as a result, these specific recovery scenarios are rarely encountered in Chromium-based browsers.

## Recovery Logic

The SDK implements a multi-stage recovery mechanism to ensure that the video processing pipeline is restored with minimal interruption to the user.

### 1. Automatic Restoration
When a context loss is detected, the SDK first waits for the browser to trigger the native `webglcontextrestored` event. The SDK monitors this for a predefined timeout period. If the browser restores the context automatically, the pipeline resumes immediately.

### 2. Manual Canvas Rebuild
If the automatic restoration does not occur within the timeout, the SDK attempts to force a new context by destroying the current internal canvas and creating a new one. 

- **Retry Limit:** The SDK will attempt to rebuild the canvas up to **3 times** with a pause between attempts.
- **Final State:** If all three attempts fail, the SDK stops trying to rebuild the canvas and reverts to waiting for the browser's automatic `webglcontextrestored` event.

## Event Flow and Error Codes

You can track the recovery process by subscribing to the `sdk.onError` callback. The following error codes are emitted during the recovery lifecycle:

| Error Code | Meaning | Description |
| :--- | :--- | :--- |
| `RENDER_CONTEXT_LOST` | **Context Lost** | The WebGL context was lost. The recovery process has started. |
| `RENDER_CONTEXT_RESTORED` | **Auto-Restored** | The browser automatically restored the WebGL context. |
| `RENDER_CONTEXT_REBUILT` | **Manually Rebuilt** | The SDK successfully created a new canvas and a new WebGL context. |
| `RENDER_CONTEXT_REBUILD_FAILED` | **Rebuild Failed** | All 3 attempts to rebuild the canvas failed. SDK is now waiting for auto-restoration. |
| `OUTPUT_STREAM_INVALIDATED` | **Stream Invalid** | The output `MediaStream` is no longer valid and must be replaced. |

## Critical: Handling Output Stream Invalidation

One of the most important aspects of the recovery process is the **`OUTPUT_STREAM_INVALIDATED`** event.

**Why does this happen?**
The SDK generates the output `MediaStream` (via `getStream()`) by capturing the stream from an internal HTML canvas. Because the `MediaStream` is logically bound to that specific canvas element, if the SDK is forced to destroy and rebuild the canvas to recover the WebGL context, the previous `MediaStream` becomes invalid.

**What you need to do:**
When your application receives the `OUTPUT_STREAM_INVALIDATED` error, you **must** call `sdk.getStream()` again to obtain a new, valid stream and update your video element or peer connection.

### Implementation Example

```javascript
sdk.onError((error) => {
  switch (error.code) {
    case ErrorCode.RENDER_CONTEXT_LOST:
      console.warn("WebGL context lost. Attempting recovery...");
      break;
      
    case ErrorCode.RENDER_CONTEXT_REBUILT:
    case ErrorCode.RENDER_CONTEXT_RESTORED:
      console.log("WebGL context restored successfully.");
      break;

    case ErrorCode.OUTPUT_STREAM_INVALIDATED:
      console.error("Output stream is no longer valid. Updating stream...");
      const newStream = sdk.getStream();
      updateVideoElement(newStream); // Your function to update the UI/PeerConnection
      break;

    case ErrorCode.RENDER_CONTEXT_REBUILD_FAILED:
      console.error("Manual rebuild failed. Waiting for browser auto-recovery.");
      break;
  }
});
```