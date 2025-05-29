import { tsvb } from 'effects-sdk';
import { EffectsStateManagement , LayoutMode } from './EffectsStateManagement';

const sdk = new tsvb('{{CUSTOMER_ID}}');
const manager = new EffectsStateManagement();
let video = document.getElementById('videoElement') as HTMLVideoElement;
let loader = document.getElementById('loader') as HTMLElement;

let tl_types = ["lowerthird_1", "lowerthird_2", "lowerthird_3", "lowerthird_4", "lowerthird_5"];
let tl_counter = 0;

function uncheck(list: { [key: string]: HTMLInputElement }, except: HTMLElement) {
    for (const [_key, value] of Object.entries(list)) {
        if (except !== value) {
            value.checked = false;
        }
    }
}

let running = document.getElementById('running') as HTMLInputElement;
let metrics = document.getElementById('metrics') as HTMLInputElement; 

let backgroundOptions: { [key: string]: HTMLInputElement } = {
    image: document.getElementById('backgroundImage') as HTMLInputElement,
    video: document.getElementById('backgroundVideo') as HTMLInputElement,
    color: document.getElementById('backgroundColor') as HTMLInputElement,
    blur: document.getElementById('backgroundBlur') as HTMLInputElement,
    screen: document.getElementById('backgroundScreenCapture') as HTMLInputElement,
}

let videoEnhancements: { [key: string]: HTMLInputElement } = {
    beautification: document.getElementById('beautification') as HTMLInputElement,
    colorCorrection: document.getElementById('colorCorrection') as HTMLInputElement,
    colorFilter: document.getElementById('colorFilter') as HTMLInputElement,
    lowLight: document.getElementById('lowLight') as HTMLInputElement,
    sharpness: document.getElementById('sharpness') as HTMLInputElement,
    smartZoom: document.getElementById('smartZoom') as HTMLInputElement,
}

let overlaysEffects: { [key: string]: HTMLInputElement } = {
    lowerThird: document.getElementById('lowerThird') as HTMLInputElement,
    mirroring: document.getElementById('mirroring') as HTMLInputElement,
    overlay: document.getElementById('overlay') as HTMLInputElement,
    logo: document.getElementById('logo') as HTMLInputElement,
    sticker: document.getElementById('sticker') as HTMLInputElement,
    emoji: document.getElementById('emoji') as HTMLInputElement,
    freeze: document.getElementById('freeze') as HTMLInputElement,
}

let layoutPositions: { [key: string]: HTMLInputElement } = {
    left: document.getElementById('left') as HTMLInputElement,
    rught: document.getElementById('right') as HTMLInputElement,
    bottomleft: document.getElementById('bottomleft') as HTMLInputElement,
    bottomright: document.getElementById('bottomright') as HTMLInputElement,
}

running.addEventListener('change', async (e) => {
    let el = e.target as HTMLInputElement;
    await manager.apply(sdk, { running: el.checked ? true : false })
});

metrics.addEventListener('change', async (e) => {
    let el = e.target as HTMLInputElement;
    await manager.apply(sdk, { metrics: el.checked ? true : false })
});


for (const [_key, value] of Object.entries(backgroundOptions)) {
    value.addEventListener('change', async (e) => {
        let el = e.target as HTMLInputElement;
        if (el.checked) {
            uncheck(backgroundOptions, el);
        } else {
            await manager.apply(sdk, { blur: 0, background: { replace: '' }});
            return;
        }

        loader.style.display = 'block';
        switch (el.id) {
            case 'backgroundImage':
                await manager.apply(sdk, { blur: 0, background: { replace: 'https://effectssdk.ai/sdk/100.jpg', mode: 'fill'}});
                break;
            case 'backgroundVideo':
                await manager.apply(sdk, { blur: 0, background: { replace: 'https://effectssdk.ai/assets/videos/default-bg/202.mp4', mode: 'fill'} });
                break;
            case 'backgroundColor':
                await manager.apply(sdk, { blur: 0, color: 0x00ff00});
                break;
            case 'backgroundBlur':
                await manager.apply(sdk, { blur: 0.5, background: { replace: '' }});
                break;
            case 'backgroundScreenCapture':
                let captureStream: MediaStream;
                try {
                    captureStream = await navigator.mediaDevices.getDisplayMedia();
                } catch (e: any) {
                    console.log('display media issue:', e);
                    el.checked = false;
                    break;
                }
                
                await manager.apply(sdk, { blur: 0, background: { replace: captureStream, mode: 'fit' } });
                break;
        
        }
        loader.style.display = 'none';
    });
}

for (const [_key, value] of Object.entries(videoEnhancements)) {
    value.addEventListener('change', async (e) => {
        let el = e.target as HTMLInputElement;

        loader.style.display = 'block';
        switch (el.id) {
            case 'beautification':
                await manager.apply(sdk, { beautification: el.checked ? 1 : 0});
                break;
            case 'colorCorrection':
                await manager.apply(sdk, { ccorrection: el.checked ? 0.5 : 0 });
                break;
            case 'colorFilter':
                await manager.apply(sdk, { cfilter: { power: el.checked ? 1 : 0, lut: "https://effectssdk.ai/assets/filters/cs_5.cube" }});
                break;
            case 'lowLight':
                await manager.apply(sdk, { lowlight: el.checked ? 0.5 : 0 });
                break;
            case 'sharpness':
                await manager.apply(sdk, { sharpness: el.checked ? 0.4 : 0 });
                break;
            case 'smartZoom':
                await manager.apply(sdk, { smartzoom: el.checked ? 0.15 : 0 });
                break;
        
        }
        loader.style.display = 'none';
    });
}

for (const [_key, value] of Object.entries(overlaysEffects)) {
    value.addEventListener('change', async (e) => {
        let el = e.target as HTMLInputElement;

        loader.style.display = 'block';
        switch (el.id) {
            case 'lowerThird':
                
                const item = tl_types[tl_counter] as "lowerthird_1" | "lowerthird_2" | "lowerthird_3" | "lowerthird_4" | "lowerthird_5";
                await manager.apply(sdk, { lowerthird: { show: el.checked ? true : false, type: item, options: { text: { title: 'Max Troshin', subtitle: 'Effects SDK / effectssdk.ai'}}} });
                
                tl_counter++;
                if (tl_counter == tl_types.length) {
                    tl_counter = 0;
                }

                break;
            case 'mirroring':
                await manager.apply(sdk, { mirroring: el.checked ? true : false });
                break;
            case 'overlay':
                await manager.apply(sdk, { overlay: el.checked ? 'https://effectssdk.ai/assets/videos/overlay/esdk.mp4' : '' });
                break;
            case 'logo':
                await manager.apply(sdk, { logo: { url: el.checked ? 'https://effectssdk.ai/images/effects-sdk-logo.png' : '' } });
                break;
            case 'sticker':
                await manager.apply(sdk, { sticker: { url: el.checked ? 'https://i.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.mp4' : ''} });
                break;
            case 'emoji':
                await manager.apply(sdk, { sticker: { 
                    url: el.checked ? 'https://files.webcameffects.app/emoji/Smilies/Beaming%20Face%20with%20Smiling%20Eyes.png' : '',
                    position: { placement: "custom", x: 0.8, y: 0.1 },
                    size: 0.2,
                } });
                break;
            case 'freeze':
                await manager.apply(sdk, { freeze: el.checked ? true : false });
                break;
        
        }
        loader.style.display = 'none';
    });
}

for (const [_key, value] of Object.entries(layoutPositions)) {
    value.addEventListener('change', async (e) => {
        let el = e.target as HTMLInputElement;

        if (el.checked) {
            uncheck(layoutPositions, el);
        } else {
            await manager.apply(sdk, { layout: { type: LayoutMode.CENTER }});
            return;
        }

        loader.style.display = 'block';
        switch (el.id) {
            case 'left':
                await manager.apply(sdk, { layout: { type: LayoutMode.LEFT } });
                break;
            case 'right':
                await manager.apply(sdk, { layout: { type: LayoutMode.RIGHT } });
                break;
            case 'bottomleft':
                await manager.apply(sdk, { layout: { type: LayoutMode.LFTBOTTOM } });
                break;
            case 'bottomright':
                await manager.apply(sdk, { layout: { type: LayoutMode.RIGHTBOTTOM } });
                break;
        }
        loader.style.display = 'none';
    });
}

// Configure SDK settings
// https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#config
sdk.config({
    wasmPaths: { 
        'ort-wasm.wasm': 'https://effectssdk.ai/sdk/web/3.5.3/ort-wasm.wasm',
        'ort-wasm-simd.wasm': 'https://effectssdk.ai/sdk/web/3.5.3/ort-wasm-simd.wasm'
    }
});

// Pass the SDK object to the window (just for easier testing).
// @ts-ignore
window.sdk = sdk;

// Start preloading machine learning assets.
// https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#preload
// https://github.com/EffectsSDK/video-effects-sdk-web/blob/main/docs/Best-Practices.md
sdk.preload();

//Wait until the SDK is ready - all SDK calls should only be made after this callback triggers.
//https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#onReady
sdk.onReady = () => {
    console.log('SDK is ready let\'s run it');
    loader.style.display = 'none';
}

// Listen for messages from the SDK
// https://effectssdk.ai/sdk/web/docs/classes/tsvb.html#onError
// https://github.com/EffectsSDK/video-effects-sdk-web/blob/main/docs/General-Error-Handling.md
sdk.onError((e) => {
    if (e.type == 'error') {
        console.error(e.message);
    } else {
        console.log(e.message);
    }
});

navigator.mediaDevices.getUserMedia({ video: { aspectRatio: {ideal: 1.77777777} } }).then(stream => {
    sdk.useStream(stream);
    video.srcObject = sdk.getStream();
});
