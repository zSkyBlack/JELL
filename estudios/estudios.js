document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('book-container');
    const leftLayer = document.getElementById('layer-left');
    const feather = document.getElementById('feather');

    // Estado inicial: todo oculto
    let currentVisibleClip = "inset(0 0 100% 0)"; 

    const blocks = [
        // Primer párrafo: 3 líneas que acumulan revelado
        { startX: 31.5, endX: 46.5, y: 29.5, finalState: "inset(0 0 64% 0)" }, // Revela línea 1
        { startX: 31.5, endX: 46.5, y: 32.0, finalState: "inset(0 0 59.5% 0)" }, // Revela línea 2
        { startX: 31.5, endX: 46.5, y: 35.5, finalState: "inset(0 0 56% 0)" }, // Revela línea 3
        
        // Segundo bloque
        { startX: 31.5, endX: 46.5, y: 45.0, finalState: "inset(0 0 46% 0)" }, // Revela todo al final
        { startX: 31.5, endX: 46.5, y: 48.0, finalState: "none" } // Revela todo al final
    ];

    let currentBlockIndex = 0;
    let startTime = null;
    const durationPerBlock = 800;

    feather.classList.add('writing');
    feather.style.display = 'block';
    feather.style.left = `${blocks[0].startX}%`;
    feather.style.top = `${blocks[0].y}%`;

    function spawnBurntSpark(xPercentage, yPercentage) {
        const particle = document.createElement('span');
        particle.classList.add('fire-particle');
        const rect = container.getBoundingClientRect();
        particle.style.left = `${(xPercentage / 100) * rect.width + (Math.random() - 0.5) * 15}px`;
        particle.style.top = `${(yPercentage / 100) * rect.height + (Math.random() - 0.5) * 25}px`;
        particle.style.setProperty('--mx', `${(Math.random() - 0.5) * 20}px`);
        particle.style.setProperty('--my', `${-(Math.random() * 35 + 10)}px`);
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 600);
    }

    function animateBurntGrimoire(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / durationPerBlock, 1);
        const currentBlock = blocks[currentBlockIndex];

        leftLayer.classList.add('burning');
        
        // Mantiene visible lo que se escribió en pasos anteriores
        leftLayer.style.clipPath = currentVisibleClip;

        const currentX = currentBlock.startX + progress * (currentBlock.endX - currentBlock.startX);
        feather.style.left = `${currentX}%`;
        feather.style.top = `${currentBlock.y}%`;

        spawnBurntSpark(currentX, currentBlock.y);

        if (progress < 1) {
            requestAnimationFrame(animateBurntGrimoire);
        } else {
            // Actualiza el estado para que lo escrito se mantenga fijo
            currentVisibleClip = currentBlock.finalState;
            
            currentBlockIndex++;
            if (currentBlockIndex < blocks.length) {
                startTime = null;
                feather.style.left = `${blocks[currentBlockIndex].startX}%`;
                feather.style.top = `${blocks[currentBlockIndex].y}%`;
                setTimeout(() => requestAnimationFrame(animateBurntGrimoire), 120);
            } else {
                leftLayer.classList.remove('burning');
                leftLayer.style.clipPath = 'none';
                feather.classList.remove('writing');
                feather.style.display = 'none';
            }
        }
    }

    setTimeout(() => requestAnimationFrame(animateBurntGrimoire), 600);
});