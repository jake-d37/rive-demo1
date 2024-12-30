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