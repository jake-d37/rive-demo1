// Get all the controls
export const controls = {
    loadTime: document.getElementById('loadTime'),
    loadTimeValue: document.getElementById('loadTimeValue'),
};

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
export const updateDisplay = debounce(() => {
    console.log("updating control value display");
    const value = parseInt(controls.loadTime.value);
    // Update display values
    controls.loadTimeValue.textContent = value;
}, 4);