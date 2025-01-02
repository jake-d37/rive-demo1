import * as riveHelpers from './rive-helpers.js';
import * as loadControls from './controls.js';

//rive parameters, centralised
const currSrc = "./assets/demo_1.riv";
const currStateMachines = "load";
const progressBarSrc = "./assets/progress_bar.riv";
const progressBarStateMachines = "progress";

//global parameters 
const scale = 2;
let loaderCanvas;
let loaderContainer;
let progressBarCanvas;
let progressBarContainer;

//interactive elements
const loadButton = document.getElementById("load-button");
const loadBg = document.getElementById("load-bg");
const blur = document.getElementById("blur");

// Wait for the Rive library to load before executing
document.addEventListener('DOMContentLoaded', () => {    
    // Create canvas where the rive asset will be displayed on
    let container = document.getElementById('rive-container');
    let canvas = createCanvas(container);
    //keep access to these elements
    loaderContainer = container;
    loaderCanvas = canvas;

    // Create canvas where the rive asset will be displayed on, again
    container = document.getElementById('progress-bar-container');
    canvas = createCanvas(container);
    progressBarContainer = container;
    progressBarCanvas = canvas;
    //NOTE: GOING TO NEED TO MAKE THE "DESIRED SIZE" BOTH VARIABLE AND TWO DIFFERENT PARAMETERS (W & H)
});

function createCanvas(container){
    let canvas = document.createElement('canvas');
    canvas.classList.add("canvas");
    container.appendChild(canvas);

    return canvas;
}

//start the loading sequence
loadButton.onclick = (() => {
    //display background and other loading elements
    loadBg.classList.add("visible");
    blur.classList.add("visible");

    let loaderInstance = riveHelpers.createRiveInstance(
        currSrc, 
        loaderCanvas, 
        currStateMachines, 
        400
    );

    //set up cursor tracking on the loader
    const boundingBox = loaderCanvas.getBoundingClientRect();
    const cursorXInput = loaderInstance.stateMachineInputs.find(input => input.name === "LtoR");
    const cursorYInput = loaderInstance.stateMachineInputs.find(input => input.name === "UtoD");
    //update whenever the mouse moves
    document.addEventListener("mousemove", (event) => {
        //get the position of the cursor relative to the canvas
        normalisedPosition = riveHelpers.trackCursor(event, boundingBox);
        //apply values to the inputs in rive object so animation follows
        if (normalisedPosition){
            if (cursorXInput) {
                cursorXInput = normalisedPosition.x;
            } else {
                console.warning("No left to right input found in rive object");
            }
            if (cursorYInput) {
                cursorYInput = normalisedPosition.y;
            } else {
                console.warning("No up to down input found in rive object");
            }
        } else {
            console.warning("No cursor position found");
        }
    });

    //not referenced again but named for readability
    let progressBarInstance = riveHelpers.createRiveInstance(
        progressBarSrc, 
        progressBarCanvas, 
        progressBarStateMachines,
        400,
        setProgressBarMilestones //on load function (optional)
    );

    //end loading screen after some time
    const endTimeout = setTimeout(() => {
        //trigger end animation
        // Get the inputs via the name of the state machine
        const inputs = loaderInstance.stateMachineInputs(currStateMachines);
        // Find the input to trigger
        const endTrigger = inputs.find(i => i.name === 'end');
        //trigger event
        endTrigger.fire();
        //hide loadscreen after above animation is over
        setTimeout(() => {
            loadBg.classList.remove("visible");
            blur.classList.remove("visible")
        }, 100);
    }, loadControls.controls.loadTime.value);

    //set up cancel button
    const cancelButton = document.getElementById("cancel");
    cancelButton.addEventListener("click", ()=> {
        //cancel other timeout
        clearTimeout(endTimeout);
        //trigger end animation
        // Get the inputs via the name of the state machine
        const inputs = loaderInstance.stateMachineInputs(currStateMachines);
        // Find the input to trigger
        const endTrigger = inputs.find(i => i.name === 'end');
        //trigger event
        endTrigger.fire();
        //hide loadscreen after above animation is over
        setTimeout(() => {
            loadBg.classList.remove("visible");
            blur.classList.remove("visible")
        }, 100);
    });
})

loadControls.controls.loadTime.addEventListener('input', loadControls.updateDisplay);

function setProgressBarMilestones(inputs){
    // Find the specific milestone input
    const milestoneInput = inputs.find(input => input.name === 'milestone');
    if (!milestoneInput) {
        console.error("Input 'milestone' not found.");
        return;
    }
    milestoneInput.value = 0;

    //set times for progress milestones to be called
    const waitTime = parseInt(loadControls.controls.loadTime.value);
    const MILESTONES = 3;
    for (let i = MILESTONES; i > 0; i--){
        setTimeout(() => {
            milestoneInput.value++;
        }, (waitTime/i)-300);
    }
}
