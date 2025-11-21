# Best Practices


## Initialization and Preloading
  
  During the initialization stage, our SDK performs the following steps:

  - Checking the configuration (apply default settingd and provided by sdk.config({}))
  - Determines which effects/features should be added to the pipeline:
  - Determines which inferences are supported and loads the appropriate versions of .wasm files.
  - Determines which ML files are supported and loads the appropriate versions of .tsvb files.
  - Sequentially initializes all models in memory (as required, they cannot be initialized simultaneously).
  - Each ML feature must be authenticated by calling our session server during initialization.

  By default, the initialization of the SDK starts only when you provide the stream to it.
  In some cases, it could take a significant amount of time (up to 15-20 seconds, depending on the network and environment conditions).

  We have introduced 2 methods aimed at improving the initialization speed.

  1. [sdk.config()](https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#config)

  - This method is the central point for SDK configuration.
  - If you're only using certain features and don't need the others, you should disable the unused ones.
  - If a feature is disabled, this means that we will not load assets for these features, and SDK initialization will be faster.
  - You can [dynamically load](https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#loadEffect) other features that were not initialized at the beginning.

  2. [sdk.preload()](https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#preload)

  - This method preloads and initializes all required models in memory and performs necessary authentication.
  - You can call this immediately after the sdk.config() method, so in this case, initialization will not depend on the webcam stream gathering.
  - We recommend doing this on the page where you are working with the camera.

  
## SDK instance usage

We recommend using a single, global SDK instance (singleton):

- Keep in mind that each SDK instance maintains all objects required for the processing pipeline in GPU memory.
- Create the instance once and pass it to any component that needs to handle video processing.
- When you are done with the previous stream, call `sdk.clear()` and then `sdk.useStream(newStream)` with the new stream.
- If you need simultaneous processing (for example, a separate video preview), you can create a second instance and also manage it as a global object.

### Temporarily removing the SDK (same browser session)

If you need to remove the SDK and use it again later in the same browser session:

- Always call `await sdk.destroy()`. This explicitly frees all GPU and CPU resources.
- It does **not** affect the inference engine, so all loaded models remain in memory.
- Re-initializing the SDK after this call will **not** trigger a new request to the session server.

### Completely removing the SDK instance

If you want to completely remove the SDK instance and do **not** plan to use it again in the current browser session:

- Call `await sdk.destroy(true)`. This explicitly frees all GPU and CPU resources, **including** the inference engine and loaded models.


## Performance improvements

  We are continuously improving the performance of our SDK, gradually decreasing CPU usage and finding the balance between CPU and GPU.

  ### Segmentation on WebGPU

   The most processing-intensive function is background segmentation. We have added support for WebGPU segmentation where available.
   If WebGPU is not supported by the browser, the SDK will automatically fall back to the CPU version of segmentation.

   It's enabled by default, to switch back to CPU configure it as follows:

    sdk.config({
        provider: 'wasm'
    });


   ### CPU usage has a directly proportional relationship with the number of segmentations in a given period.

   To free up the CPU and improve the final FPS, you can use the following methods:

   1. [sdk.enableFrameSkipping()](https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#enableFrameSkipping)

   - This means that segmentation will occur every second frame. For frames where segmentation is skipped, we will use the segmentation mask from the previous frame.
   - As a result, you will achieve higher final FPS. However, there may be minor visible delays or fluctuations in the segmentation mask, especially when people in the frame are moving quickly. 

   2. [sdk.setFpsLimit()](https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#setFpsLimit)

   - As less frames needs to be processed in a portion of time -> less segmentation will be done -> less CPU/GPU usage
    
## Disabling the SDK when required
  
   In cases where your customers' hardware/software is insufficient to deliver seamless results with video processing while running your main application logic, you can simply disable our SDK.

   1. [sdk.stop()](https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#stop)

   - This will halt all processing and will bypass the original frames to the output.
   - This scenario negates any performance effects on your application.

   2. [sdk.run()](https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#run)

   - At any time, you can restart the SDK.


