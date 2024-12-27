//returns a new rive instance that cleans up itself when done
export function createRiveInstance(src, canvas, stateMachines, canvasContainer) {
    // Initialize the Rive instance
    const r = new rive.Rive({
        src: src,
        canvas: canvas,
        autoplay: true,
        stateMachines: stateMachines,
    });

    //check when animation over to call the cleanup
    r.on('stop', () => {
        r.cleanup();
        console.log("Animation stopped and cleaned up!");
    });

    // Resize the canvas on page load and window resize
    window.addEventListener('resize', () => resizeCanvas(canvas, canvasContainer, r));

    return r;
}

//resizes canvas and rive element to window
export function resizeCanvas(canvas, container, riveInstance){
    //resize parent
    console.log("resizing canvas parent");
    if (container) {
        //THIS WILL DO THE ENTIRE SCREEN
        container.width = window.innerWidth;
        container.height = window.innerHeight;
    }

    //resize canvas itself
    console.log("resizing canvas");
    if (canvas){
        const scale = 5; //ensures canvas isn't pixelated
        canvas.width = container.offsetWidth * scale;
        canvas.height = container.offsetHeight * scale;
    }

    //resize rive instance
    if (riveInstance){
        riveInstance.resizeToCanvas();
    }
}