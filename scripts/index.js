import * as riveHelpers from './rive-helpers.js';
import * as loadControls from './controls.js';

//rive parameters, centralised
const currSrc = "./assets/demo_1.riv";
const currStateMachines = "load";

//global parameters 
const scale = 2;
let loaderCanvas;
let loaderContainer;

//interactive elements
const loadButton = document.getElementById("load-button");
const loadBg = document.getElementById("load-bg");

// Wait for the Rive library to load before executing
document.addEventListener('DOMContentLoaded', () => {    
    // Create canvasses where the rive assets will be displayed on
    let container = document.getElementById('rive-container');
    let canvas = document.createElement('canvas');
    canvas.classList.add("canvas");
    container.appendChild(canvas);
    
    riveHelpers.resizeCanvas(canvas, container, false);

    //keep access to these elements
    loaderCanvas = canvas;
    loaderContainer = container;
});

//start the loading sequence
loadButton.onclick = (() => {
    //display background and other loading elements
    loadBg.classList.add("visible");

    let loaderInstance = riveHelpers.createRiveInstance(currSrc, loaderCanvas, currStateMachines, loaderContainer);

    //end loading screen after some time
    setTimeout(() => {
        //trigger end animation
        // Get the inputs via the name of the state machine
        const inputs = loaderInstance.stateMachineInputs(currStateMachines);
        // Find the input to trigger
        const endTrigger = inputs.find(i => i.name === 'end');
        //trigger event
        endTrigger.fire();
        //hide loadscreen after above animation is over
        setTimeout(() => loadBg.classList.remove("visible"), 100);
    }, parseInt(loadControls.controls.loadTime.value));
})

loadControls.controls.loadTime.addEventListener('input', loadControls.updateDisplay);
