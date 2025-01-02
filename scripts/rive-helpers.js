//returns a new rive instance that cleans up itself when done
export function createRiveInstance(src, canvas, stateMachines, desiredSideLength, riveInputFunc) {
    // Initialize the Rive instance
    const r = new rive.Rive({
        src: src,
        canvas: canvas,
        autoplay: true,
        stateMachines: stateMachines,
        onLoad: () => {
            if (riveInputFunc){
                const inputs = r.stateMachineInputs(stateMachines);
                riveInputFunc(inputs);
            }
        },
    });

    //check when animation over to call the cleanup
    r.on('stop', () => {
        r.cleanup();
        console.log("Animation stopped and cleaned up!");
    });

    // Resize the canvas on window resize
    window.addEventListener('resize', () => resizeCanvas(canvas, r, desiredSideLength));
    //and initially
    resizeCanvas(canvas, r, desiredSideLength);

    return r;
}

//track cursor movement
export function trackCursor(event, boundingBox){
    // Convert global cursor position to canvas-relative coordinates
    const x = event.clientX - boundingBox.left;
    const y = event.clientY - boundingBox.top;

    // Normalize coordinates to a range suitable for your animation (e.g., 0 to 1, or canvas dimensions)
    //MIGHT NEED TO CHANGE THESE
    const normalizedX = Math.max(0, Math.min(x / boundingBox.width, 1));
    const normalizedY = Math.max(0, Math.min(y / boundingBox.height, 1));

    //return as a 2D vector position
    return {x: normalizedX, y: normalizedY};
}

//resizes canvas and rive element to window
export function resizeCanvas(canvas, riveInstance, desiredSideLength){

    //resize canvas itself
    if (canvas){
        const scale = 15; //ensures canvas isn't pixelated
        canvas.width = desiredSideLength * scale;
        canvas.height = desiredSideLength * scale;
    }

    //resize rive instance
    if (riveInstance) {
        riveInstance.resizeToCanvas(); // Ensure the instance adjusts to the new canvas size
    }
}

//track the mouse position and get the rive animation to follow it
document.addEventListener("mousemove", (event) => {
    // Convert global cursor position to canvas-relative coordinates
    const x = event.clientX - boundingBox.left;
    const y = event.clientY - boundingBox.top;

    // Normalize coordinates to a range suitable for your animation (e.g., 0 to 1, or canvas dimensions)
    const normalizedX = Math.max(0, Math.min(x / boundingBox.width, 1));
    const normalizedY = Math.max(0, Math.min(y / boundingBox.height, 1));

    // Set the Rive inputs
    if (cursorXInput) cursorXInput.value = normalizedX;
    if (cursorYInput) cursorYInput.value = normalizedY;
});