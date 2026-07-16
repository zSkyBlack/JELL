document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('book-stage');
    const leftLayer = document.getElementById('layer-left');
    const feather = document.getElementById('feather');

    let currentVisibleClip = 'inset(0 0 100% 0)';

    const blocks = [
        { startX: 31.5, endX: 46.5, y: 29.5, finalState: 'inset(0 0 64% 0)' },
        { startX: 31.5, endX: 46.5, y: 32.0, finalState: 'inset(0 0 59.5% 0)' },
        { startX: 31.5, endX: 46.5, y: 35.5, finalState: 'inset(0 0 56% 0)' },
        { startX: 31.5, endX: 46.5, y: 45.0, finalState: 'inset(0 0 46% 0)' },
        { startX: 31.5, endX: 46.5, y: 48.0, finalState: 'none' }
    ];

    let currentBlockIndex = 0;
    let startTime = null;
    const durationPerBlock = window.matchMedia('(max-width: 700px)').matches ? 680 : 800;

    feather.classList.add('writing');
    feather.style.display = 'block';
    feather.style.left = `${blocks[0].startX}%`;
    feather.style.top = `${blocks[0].y}%`;

    function spawnBurntSpark(xPercentage, yPercentage) {
        const particle = document.createElement('span');
        particle.classList.add('fire-particle');

        const rect = stage.getBoundingClientRect();
        particle.style.left = `${(xPercentage / 100) * rect.width + (Math.random() - 0.5) * 15}px`;
        particle.style.top = `${(yPercentage / 100) * rect.height + (Math.random() - 0.5) * 25}px`;
        particle.style.setProperty('--mx', `${(Math.random() - 0.5) * 20}px`);
        particle.style.setProperty('--my', `${-(Math.random() * 35 + 10)}px`);
        stage.appendChild(particle);
        window.setTimeout(() => particle.remove(), 600);
    }

    function animateBurntGrimoire(timestamp) {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / durationPerBlock, 1);
        const currentBlock = blocks[currentBlockIndex];

        leftLayer.classList.add('burning');
        leftLayer.style.clipPath = currentVisibleClip;

        const currentX = currentBlock.startX + progress * (currentBlock.endX - currentBlock.startX);
        feather.style.left = `${currentX}%`;
        feather.style.top = `${currentBlock.y}%`;

        spawnBurntSpark(currentX, currentBlock.y);

        if (progress < 1) {
            window.requestAnimationFrame(animateBurntGrimoire);
            return;
        }

        currentVisibleClip = currentBlock.finalState;
        currentBlockIndex += 1;

        if (currentBlockIndex < blocks.length) {
            startTime = null;
            feather.style.left = `${blocks[currentBlockIndex].startX}%`;
            feather.style.top = `${blocks[currentBlockIndex].y}%`;
            window.setTimeout(() => window.requestAnimationFrame(animateBurntGrimoire), 120);
            return;
        }

        leftLayer.classList.remove('burning');
        leftLayer.style.clipPath = 'none';
        feather.classList.remove('writing');
        feather.style.display = 'none';
    }

    window.setTimeout(() => window.requestAnimationFrame(animateBurntGrimoire), 600);
});
