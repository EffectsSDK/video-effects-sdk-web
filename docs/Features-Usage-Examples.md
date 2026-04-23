# Features Usage Examples

## Resource Cleanup

To properly release SDK resources, call the `destroy()` method once the instance is no longer needed (e.g., when the user closes the video call).

```javascript
await sdk.destroy();
```

## General Details

- All SDK calls have to be done only after sdk.onReady callback happens

```javascript
   sdk.onReady = () => {
      console.log('SDK is ready let\'s run it');
      sdk.run();
   }
```

- When you are changing the camera stream you need to do following:

```javascript
   sdk.stop();
   sdk.clear();
   sdk.useStream(stream);

   //after that sdk.onReady callback will happen again
```

- SDK doesn't keep the configuration state inside, you should do it by yourself. So after the camera stream will be changed you need to restore SDK state (by configuring again as needed)

## Frame Processor (Manual Frame Processing)

The Frame Processor allows you to process `VideoFrame` objects manually without a `MediaStream`.

**Note:** This mode is mutually exclusive with `useStream()`. The SDK supports either stream processing or frame-by-frame processing.

```javascript
// 1. Initialize the frame processor
await sdk.initFrameProcessor();

// 2. Process a single frame (the input frame is consumed and closed automatically by SDK)
const processedFrame = await sdk.processFrame(inputFrame);

// 3. Use the processed frame (e.g., draw to canvas) and then close it
ctx.drawImage(processedFrame, 0, 0);
processedFrame.close();
```

## Input Resolution change event

SDK has ability to subscribe to an input resolution change event.

```javascript
sdk.onChangeInputResolution(() => {
   console.log("The input resolution has beed changed...");
   ...
})
```

This method can be usefull in cases where browser changes stream videoTrack resolution on the fly (rotation the screen of mobile devices and ect.)

## ErrorBus

SDK contains an internal notification system - ErrorBus. You can pass onError-callback to subscribe to SDK notifications:

```javascript
sdk.onError((errorObject) => {
   if(errorObject.type === "error") {
      console.error(errorObject.message);
   } else {
      console.log(errorObject.message)
   }
});
```

ErrorObject contains the following fields:

- message: string value, contains message with emitter prefix (if exists);
- type: error type - ErrorType enum (typescript case) or "info" | "warning" | "error" string (javascript);
- data: optional field, can contain additional info;

**Note on GPU Stability:** 
In some browsers (especially Firefox and Safari), the WebGL context can be lost due to system or driver issues. Handling these cases is critical for production stability. For detailed instructions on how to recover the rendering pipeline and handle stream invalidation, please refer to the [WebGL Context Loss and Recovery](./WebGL-Context-Loss-and-Recovery.md) guide.

In typescript projects you can use enum syntax:

```typescript
import { tsvb, ErrorType } from "effects-sdk";

const sdk = new tsvb("{CUSTOMER_ID}");

sdk.onError((errorObject) => {
   if(errorObject.type === ErrorType.ERROR) {
    ...
   }
})
```

## How to use Virtual Backgrounds

Put the color on the background:

```javascript
sdk.setBackgroundColor(0x00ff00);
sdk.setBackground('color');
```

Put the image on the background:

```javascript
sdk.setBackground('image url');
```

Put the video on the background:

```javascript
sdk.setBackground('video url');
```

Put the MediaStream on the background:

```javascript
sdk.setBackground(MediaStream);
```

Change the background fit mode:

```javascript
sdk.setBackgroundFitMode('fit');
```

Clear the background:

```javascript
sdk.clearBackground();
```

Handle the successful loading of the background:

```javascript
sdk.onBackgroundSuccess(() => {
   console.log('Background Successfully Applied')
});
```

## How to use Segmentation presets

You can changa the segmentation preset on the fly:

```javascript
sdk.setSegmentationPreset('quality');
```

Also you can specify which preset would work as default one:

```javascript
// right after the initialisation
sdk.config({
   preset: 'speed'
});
```

## How to use Background Blur

Enable blur (it will apply on the fly, so you can provide the control to users):

```javascript
sdk.setBlur(0.6);
```

Disable blur:

```javascript
sdk.clearBlur();
```

## How to make background transparent

Enable segmentation with solid color background:

```javascript
sdk.setBackgroundColor(0x00ff00);
sdk.setBackground('color');
```

Set layout mode as 'transparent':

```javascript
sdk.setLayoutMode('transparent');
```

## How to use Mirroring

Enable mirroring:

```javascript
sdk.enableMirroring();
```

Disable mirroring:

```javascript
sdk.disableMirroring();
```

## How to use Beautification

Enable beautification:

```javascript
sdk.enableBeautification();

//you can chamnge the power of effects on the fly
sdk.setBeautificationLevel(0.6);
```

Disable beautification:

```javascript
sdk.disableBeautification();
```

## How to change segmentation layout

Use the setLayout function to set one of default presets: "center", "left-bottom", "right-bottom"

```javascript
sdk.setLayout("left-bottom");
```

In case you need to customize layout params, use setCustomLayout() function:

```typescript
interface CustomLayoutOptions {
   xOffset?: number, // Horizontal offset relative to the left edge. The value is usually a number from 0 to 1, but it can be moved outside the edge if required.
   yOffset?: number, // Vertical offset relative to the top edge. The value is usually a number from 0 to 1, but it can be moved outside the edge if required.
   size?: number,    // Mask size as a percentage of the stream width. The value can be a number from 0 to 1.
}

sdk.setCustomLayout(options: CustomLayoutOptions)
```

## How to use Auto-Framing

Enable auto-framing (smart zoom):

```javascript
sdk.enableSmartZoom();

//set the level of zooming
sdk.setFaceArea(0.2);
```

Disable auto-framing (smart zoom):

```javascript
sdk.disableSmartZoom();
```

## How to use Color Correction

Enable color correction:

```javascript
sdk.enableColorCorrector();
```

Disable color correction:

```javascript
sdk.disableColorCorrector();
```

You can fine-tune the effect using `setColorCorrectorConfig`. The behavior of the parameters depends on the `autoMode` setting:

- **Automatic Mode (`autoMode: true`)**: The SDK automatically manages **White Balance**, **Exposure**, and **Contrast**. 
    - The `power` parameter controls the strength of this automatic correction.
    - Manual values for White Balance, Exposure, and Contrast are **ignored** in this mode.
- **Manual Mode (`autoMode: false`)**: You have full control over **White Balance**, **Exposure**, and **Contrast**.
    - The `power` parameter is **ignored** in this mode.
- **Independent Parameters**: `vibrance`, `tint`, and `temperature` are always active and can be adjusted regardless of whether `autoMode` is true or false.

**Example: Manual Configuration**

```javascript
sdk.setColorCorrectorConfig({
   autoMode: false,       // Switch to manual mode
   whiteBalance: 0.5,     // Applied in manual mode
   exposure: 0.2,         // Applied in manual mode
   contrast: -0.1,        // Applied in manual mode
   vibrance: 0.3,         // Applied in BOTH modes
   temperature: 0.1       // Applied in BOTH modes
});
```

## How to use Portrait Lighting

Enable portrait lighting to highlight the person. This effect brightens the subject (person) and darkens the background to create a professional studio look:

```javascript
sdk.enablePortraitLighting();
```

Disable portrait lighting:

```javascript
sdk.disablePortraitLighting();
```

You can customize the intensity of the light and background darkening:

```javascript
sdk.setPortraitLightingOptions({
   LightStrength: 0.8,
   BgDarkStrength: 0.4
});
```

## How to use Noise Suppression

Enable noise suppression to improve overall video quality:

```javascript
sdk.enableNoiseSuppression();
```

Disable noise suppression:

```javascript
sdk.disableNoiseSuppression();
```

**Note:** This effect is designed to suppress noise flickering (stabilizing/freezing the noise) rather than completely removing the grain from the image.

## How to use LowLight Correction

Enable LowLight correction:

```javascript
sdk.enableLowLightEffect();

//change the power of effect (value from 0 to 1)
sdk.setLowLightEffectPower(0.5);
```

Disable LowLight correction:

```javascript
sdk.disableLowLightEffect();
```

The LowLight correction takes some time to activate. Use following method to pass callback that will be executed every time the effect is ready for use:

```javascript
sdk.onLowLightSuccess(() => console.log("Effect is successfully applied"));
```

## How to use ColorFilter Effect

Enable ColorFilter effect:

```javascript
sdk.enableColorFilter();
```

ColorFilter state management:

```typescript
sdk.setColorFilterConfig(config: Partial<ColorFilterConfig>);
```

ColorFilterConfig has folowing properties (all optional):

- part: number from 0 to 1 - allow to aply the effect to part of the frame (dev feature, default value is 1)
- power: number from 0 to 1 - set effect power
- lut: url or CUBE file - lut source, should contain valid CUBE file or url of valid CUBE file
- capacity: number of loaded luts the effect caches (default value is 1)
- promise: object containing one function(resolve), that can be used after lut success applying

You can also pass common onSuccess callback, using following method:

```typescript
sdk.onColorFilterSuccess(f: () => void);
```

Disable ColorFilter effect:

```javascript
sdk.disableColorFilter();
```

Lut applying example:

```javascript
sdk.onColorFilterSuccess(() => {
   console.log('Lut successfully applied!');
});

sdk.setColorFilterConfig({
   lut: 'https://lut_storage.com/my_lut.cube'
});
```

Set ColorFilter power:

```javascript
sdk.setColorFilterConfig({
   power: 0.5
});
```

## How to use Sharpness Effect

Enable sharpness effect:

```javascript
sdk.enableSharpnessEffect();

//change the power of effect (from 0 to 1)
sdk.setSharpnessEffectConfig({ power: 0.5 });
```

Disable sharpness effect:

```javascript
sdk.disableSharpnessEffect();
```

## How to use Chroma Key

Enable the classic chroma key algorithm to remove a specific color from the background (e.g., a green screen):

```javascript
sdk.enableChromaKey();
```

Disable chroma key:

```javascript
sdk.disableChromaKey();
```

You can fine-tune the keying process using `setChromaKeySettings`. This allows you to specify the target color and adjust how the edges are handled:

```javascript
sdk.setChromaKeySettings({
   keyColor: 0x00ff00, // The color to be removed (e.g., pure green)
   threshold: 0.1,     // Sensitivity: how close a color must be to the keyColor to be removed
   softness: 0.05,     // Edge softness: controls the blur/transition at the edges
   detint: 0.1         // Color spill removal: removes the green tint from the subject's edges
});
```

## Components system

Imagine an artist drawing a animation. He draws individual elements on transparent sheets, overlaying them layer by layer, to get the finished frame. We have implemented a similar concept with Components system. Component - is the frame layer, that contain the specialized element.

You can create the component you need:

```javascript
const newComponent_1 = sdk.createComponent({
   component: "stickers",
   options: { capacity: 16, duration: 3500 },
});
```

Available components: <i>"overlay_screen", "stickers", "lowerthird_1", "lowerthird_2", "lowerthird_3", "lowerthird_4", "lowerthird_5"</i>.
Add the created component to the frame in the order you want with unique ID that is needed to access the component. In this case <i>newComponent_2</i> will be dysplayed on top of the <i>newComponent_1</i>.

```javascript
sdk.addComponent(newComponent_2, "component_id_2");
sdk.addComponent(newComponent_1, "component_id_1");
...
newComponent_1.show();

// equivalent records
sdk.components.component_id_1.show();
sdk.components["component_id_2"].show();
```

Each component has an options and methods for getting/setting them (<i>setOptions(), getOptions()</i>), <i> show()/hide()</i> methods
and lifecycle hooks: <i>onBeforeShow, onAfterShow, onBeforeHide, onAfterHide</i>:

```javascript
component.onBeforeShow(() => {
   console.log("I will be called before showing the component");
});
```

Below we will analyze in more detail the different types of components.

### How to use Overlays

To use Overlays, you need to create new component by selecting the "overlay_screen" type and add it to the list of components. Note that is this case may be useful component lifecycle hooks: for example, we can stop effects pipeline after <i>overlay</i> is shown, and run pipeline before the component is hidden:

```javascript
const overlayScreen = sdk.createComponent({
  component: "overlay_screen",
  options: {
    url: "some_image_or_video_url",

    // optional
    promise: {
      resolve: () => console.log("resolved"),
      reject: (e) => console.log("rejected: ", e),
    },
  },
});
sdk.addComponent(overlayScreen, "overlay");

sdk.components.overlay.onAfterShow(() => sdk.enablePipelineSkipping());
sdk.components.overlay.onBeforeHide(() => sdk.disablePipelineSkipping());

...

sdk.components.overlay.show();
```

You can pass to Overlay Component following options:

- url - string, contains the URL of image or video. Default Overlay Component view is white screen
- promise - an optional object, contains two fields: "resolve" (function, called after successfull texture uploading) and "reject" (function, will be called with the "error" object as the first argument if the texture loading failed)

### How to use Stickers

To use Stikers, you need to create new component by selecting the "stickers" type and pass necessary options. Then add it to the list of components:

```javascript
const stickers = sdk.createComponent({
component: "stickers",
   options: {
      capacity: 16,
      duration: 3500
   },
});

sdk.addComponent(stickers, "my_stickers_component");
```

The Sticker-component has a StickerStore, the capacity of which is set by options. It allows you to store a certain number of loaded textures that can be rendered without delay. The StickerStore is a queue, each texture that has been preempted is destroyed. You can add a texture to the StickerStore by the <i>setOptions()</i> method. Loading texture is async process. There are two ways to handle texture loading promise (for example for the loading indication): add special object <i>promise</i> to the options argument:

```javascript
sdk.components.my_stickers_component.setOptions({
sticker: {
   url: 'https://my.stickers.url/sticker.mp4',
      promise: {
         resolve: () => console.log('success'),
         reject: () => console.log('badluck')
      }
   }
});
```

or use Stickers-component hooks <i>onLoadSucccess/onLoadError</i>:

```javascript
sdk.components.my_stickers_component.onLoadSucccess(() => {
   console.log('success');
});
```

After that you can add loaded sticker to the frame by the setting option <i>id</i> (Note that sticker unique <i>id</i> is the <i>url</i>, taht was used for the texture loading):

```javascript
sdk.components.my_stickers_component.setOptions({
   id: 'https://my.stickers.url/sticker.mp4'
});
```

### How to use Lower-Thirds(LT)

First of all, you need to create a LT component by selecting the LT type and setting the required options. After that, you need to add the created LT to the list of components:

```javascript
const lt = sdk.createComponent({
   // available values: "lowerthird_1", "lowerthird_2", "lowerthird_3", "lowerthird_4", "lowerthird_5"
   component: "lowerthird_1",

   options: {
      color: {
         primary: 0xff5500,
         secondary: 0x5100ff,
      },

      // vertical and horizontal offset (values between 0 and 0.25)
      offset: {
         x: 0.1,
         y: 0.1,
      },

      text: {
         title: "LowerThird Title",
         subtitle: "LowerThird Subtitle",
      },
   },
});

sdk.addComponent(lt, "lowerthird");
```

In addition to the component methods, the LT has special <i>showLowerThird()</i> and <i>hideLowerThird()</i> methods that allow you to show/hide the component with an animation effect:

```javascript
sdk.components.lowerthird.showLowerThird();
sdk.components.lowerthird.hideLowerThird();
```

## How to resize stream on the fly

```typescript
sdk.setOutputResolution({
   width?: number,
   height?: number
});
```

## Show metrics

Control the visibility of metrics:

```javascript
sdk.showFps();
sdk.hideFps();
```

Function for setting fps limit:

```typescript
sdk.setFpsLimit(limit: number);
```

## How automatically switch presets

```typescript
sdk.setSegmentationPreset(preset: "quality" | "balanced" | "speed" | "lightning");
```