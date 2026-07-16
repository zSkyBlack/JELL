document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const cursor = document.getElementById('spray-cursor');
    const paintContainer = document.getElementById('paint-container');
    const letters = [...document.querySelectorAll('.reveal-text .word > span')];
    const menuContainer = document.getElementById('menu-container');
    const instruction = document.getElementById('instruction');

    const colors = [
        'rgba(255, 35, 35, 0.78)',
        'rgba(30, 144, 255, 0.78)',
        'rgba(40, 220, 40, 0.78)',
        'rgba(255, 225, 0, 0.78)',
        'rgba(244, 20, 140, 0.78)'
    ];

    let activePointerId = null;
    let activePointerType = 'mouse';
    let isPainting = false;
    let paintInterval = null;
    let pointerX = 0;
    let pointerY = 0;
    let currentActiveColor = colors[0];
    let totalRevealed = 0;
    const wallStateKey = 'portfolio-wall-state-v1';

    function saveWallState() {
        try {
            const state = letters.map((letter) => ({
                revealed: letter.classList.contains('revealed'),
                color: letter.style.color || '',
                textShadow: letter.style.textShadow || '',
                rotation: letter.style.getPropertyValue('--rand-rot') || '0'
            }));

            sessionStorage.setItem(wallStateKey, JSON.stringify(state));
        } catch (_) {
            // La página sigue funcionando aunque el almacenamiento esté bloqueado.
        }
    }

    function restoreWallState() {
        try {
            const savedState = JSON.parse(sessionStorage.getItem(wallStateKey) || 'null');
            if (!Array.isArray(savedState) || savedState.length !== letters.length) return;

            savedState.forEach((savedLetter, index) => {
                if (!savedLetter || !savedLetter.revealed) return;

                const letter = letters[index];
                letter.style.setProperty('--rand-rot', savedLetter.rotation || '0');
                letter.style.color = savedLetter.color || colors[index % colors.length];
                letter.style.textShadow = savedLetter.textShadow || `
                    -3px -3px 0 #000,
                    3px -3px 0 #000,
                    -3px 3px 0 #000,
                    3px 3px 0 #000,
                    5px 5px 0 #000,
                    0 0 15px ${letter.style.color}
                `;
                letter.classList.add('revealed');
                totalRevealed += 1;
            });

            if (totalRevealed >= letters.length) {
                menuContainer.classList.add('show');
                instruction.style.opacity = '0';
            }
        } catch (_) {
            // Ignora estados antiguos o dañados y empieza el muro normalmente.
        }
    }

    function updateInstruction() {
        const touchDevice = window.matchMedia('(pointer: coarse)').matches;
        instruction.textContent = touchDevice
            ? 'Mantén pulsado y arrastra el dedo para revelar el contenido'
            : 'Mantén pulsado y mueve el ratón para revelar el contenido';
    }

    function updatePointerPosition(event) {
        pointerX = event.clientX;
        pointerY = event.clientY;

        if (event.pointerType !== 'touch') {
            cursor.style.left = `${pointerX}px`;
            cursor.style.top = `${pointerY}px`;
        }
    }

    function startPainting(event) {
        if (event.button !== undefined && event.button !== 0) return;
        if (event.target.closest('.menu-btn')) return;

        activePointerId = event.pointerId;
        activePointerType = event.pointerType || 'mouse';
        updatePointerPosition(event);
        isPainting = true;

        if (typeof body.setPointerCapture === 'function') {
            try {
                body.setPointerCapture(event.pointerId);
            } catch (_) {
                // Algunos navegadores no permiten capturar el puntero en este punto.
            }
        }

        if (activePointerType !== 'touch') {
            cursor.classList.add('spraying');
        }

        event.preventDefault();
        startPaintingEffects();
    }

    function movePointer(event) {
        updatePointerPosition(event);

        if (!isPainting || event.pointerId !== activePointerId) return;

        event.preventDefault();
        checkCollision(pointerX, pointerY);
    }

    function stopPainting(event) {
        if (activePointerId === null) return;
        if (event.pointerId !== undefined && event.pointerId !== activePointerId) return;

        isPainting = false;
        cursor.classList.remove('spraying');
        clearInterval(paintInterval);
        paintInterval = null;

        if (typeof body.releasePointerCapture === 'function' && event.pointerId !== undefined) {
            try {
                body.releasePointerCapture(event.pointerId);
            } catch (_) {
                // El puntero puede haberse liberado automáticamente.
            }
        }

        activePointerId = null;
    }

    function startPaintingEffects() {
        clearInterval(paintInterval);
        updateCurrentColor();
        createPaintDrop();
        checkCollision(pointerX, pointerY);

        paintInterval = window.setInterval(() => {
            if (!isPainting) return;
            updateCurrentColor();
            createPaintDrop();
            checkCollision(pointerX, pointerY);
        }, activePointerType === 'touch' ? 85 : 100);
    }

    function updateCurrentColor() {
        currentActiveColor = colors[Math.floor(Math.random() * colors.length)];
    }

    function createPaintDrop() {
        const drop = document.createElement('div');
        drop.className = 'paint-drop';
        drop.style.backgroundColor = currentActiveColor;

        const minSize = activePointerType === 'touch' ? 58 : 50;
        const size = Math.floor(Math.random() * 40) + minSize;

        drop.style.width = `${size}px`;
        drop.style.height = `${size}px`;
        drop.style.left = `${pointerX}px`;
        drop.style.top = `${pointerY}px`;
        paintContainer.appendChild(drop);

        window.setTimeout(() => drop.remove(), 2000);
    }

    function checkCollision(x, y) {
        const sprayRadius = activePointerType === 'touch' ? 56 : 35;

        letters.forEach((letter) => {
            if (letter.classList.contains('revealed')) return;

            const rect = letter.getBoundingClientRect();
            const touchesLetter =
                x >= rect.left - sprayRadius &&
                x <= rect.right + sprayRadius &&
                y >= rect.top - sprayRadius &&
                y <= rect.bottom + sprayRadius;

            if (!touchesLetter) return;

            const randomRotation = Math.floor(Math.random() * 16) - 8;
            letter.style.setProperty('--rand-rot', randomRotation);
            letter.style.color = currentActiveColor;
            letter.style.textShadow = `
                -3px -3px 0 #000,
                3px -3px 0 #000,
                -3px 3px 0 #000,
                3px 3px 0 #000,
                5px 5px 0 #000,
                0 0 15px ${currentActiveColor}
            `;
            letter.classList.add('revealed');
            totalRevealed += 1;
            saveWallState();
        });

        if (totalRevealed >= letters.length) {
            menuContainer.classList.add('show');
            instruction.style.opacity = '0';
        }
    }

    body.addEventListener('pointerdown', startPainting, { passive: false });
    body.addEventListener('pointermove', movePointer, { passive: false });
    body.addEventListener('pointerup', stopPainting);
    body.addEventListener('pointercancel', stopPainting);
    body.addEventListener('lostpointercapture', stopPainting);
    window.addEventListener('blur', () => stopPainting({ pointerId: activePointerId }));
    window.addEventListener('resize', updateInstruction);

    restoreWallState();
    updateInstruction();
});
