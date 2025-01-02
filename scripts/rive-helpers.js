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
    const x = event.clientX - boundingBox.left - boundingBox.width / 2;;
    const y = event.clientY - boundingBox.top;

    // Normalize coordinates to a range of -100 to 100 
    // (because that's what the state machine requires with how I set it up)
    const normalizedX = Math.max(-100, Math.min(((x / boundingBox.width) * 200) - 100, 100));
    const normalizedY = -Math.max(-100, Math.min(((y / boundingBox.height) * 200) - 100, 100));

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