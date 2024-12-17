const loadButton = document.getElementById("load-button");
const loadBg = document.getElementById("load-bg");

const currSrc = "./assets/demo_1.riv";
const currStateMachines = "load";

// Get all the controls
const controls = {
    loadTime: document.getElementById('loadTime'),
    loadTimeValue: document.getElementById('loadTimeValue'),
};

//parameters for customising canvas resolution
const scale = 2;
var canvas;
var riveInstance;

// Create canvasses where the rive assets will be displayed on
canvas = document.createElement('canvas');
document.getElementById('rive-container').appendChild(canvas);
canvas.classList.add("canvas");
canvas.width =  "2000px";
canvas.height = "2000px";

//start the loading sequence
loadButton.onclick = (() => {
    //display background and other loading elements
    loadBg.classList.add("visible");

    // Initialize the Rive instances
    riveInstance = new rive.Rive({
        src: currSrc,
        canvas: canvas,
        autoplay: true,
        stateMachines: currStateMachines,
    });

    //end loading screen after some time
    setTimeout(() => {
        //trigger end animation
        // Get the inputs via the name of the state machine
        const inputs = riveInstance.stateMachineInputs(currStateMachines);
        // Find the input to trigger
        const endTrigger = inputs.find(i => i.name === 'end');
        //trigger event
        endTrigger.fire();
        //cleanup after some time (so animation is finished)
        setTimeout(() => {
            riveInstance.cleanup()
            //make load page invisible
            loadBg.classList.remove("visible");
        },100);

    }, parseInt(controls.loadTime.value));
})

// Debounce function to limit update frequency
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

//update the display number shown on the slider
const updateDisplay = debounce(() => {
    console.log("updating control value display");
    const value = parseInt(controls.loadTime.value);
    // Update display values
    controls.loadTimeValue.textContent = value;
}, 4);

controls.loadTime.addEventListener('input', updateDisplay);


