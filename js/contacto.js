document.addEventListener('DOMContentLoaded', () => {
    const owlScene = document.getElementById('owl-scene');
    const owlButton = document.getElementById('owl-button');
    const hintLayer = document.getElementById('hint-layer');

    let isOpen = false;
    let hintInterval = null;
    let firstHintTimeout = null;

    const hintPositions = [
        { left: '8%', top: '18%' },
        { left: '65%', top: '14%' },
        { left: '12%', top: '42%' },
        { left: '72%', top: '38%' },
        { left: '15%', top: '68%' },
        { left: '62%', top: '72%' },
        { left: '40%', top: '8%' }
    ];

    function createHint() {
        if (isOpen) return;

        const hint = document.createElement('span');
        hint.classList.add('floating-hint');
        hint.textContent = 'Abre el sobre';

        const position = hintPositions[Math.floor(Math.random() * hintPositions.length)];
        const rotation = Math.floor(Math.random() * 18) - 9;

        hint.style.left = position.left;
        hint.style.top = position.top;
        hint.style.setProperty('--hint-rot', `${rotation}deg`);

        hintLayer.appendChild(hint);

        hint.addEventListener('animationend', () => {
            hint.remove();
        });
    }

    function startHints() {
        firstHintTimeout = setTimeout(() => {
            createHint();

            hintInterval = setInterval(() => {
                createHint();
            }, 1400);
        }, 1800);
    }

    function stopHints() {
        clearTimeout(firstHintTimeout);
        clearInterval(hintInterval);
        hintLayer.innerHTML = '';
    }

    function openEnvelope() {
        if (isOpen) return;

        isOpen = true;
        stopHints();

        owlScene.classList.add('opening');

        setTimeout(() => {
            owlScene.classList.remove('opening');
            owlScene.classList.add('open');
            document.body.classList.add('contact-open');
        }, 1350);
    }

    owlButton.addEventListener('click', openEnvelope);

    startHints();
});
