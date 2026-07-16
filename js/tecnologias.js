document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix-canvas');
    const context = canvas.getContext('2d');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    const fontSize = 16;
    let rainDrops = [];

    function resizeCanvas() {
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(window.innerWidth * pixelRatio);
        canvas.height = Math.floor(window.innerHeight * pixelRatio);
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const columns = Math.ceil(window.innerWidth / fontSize);
        rainDrops = Array.from({ length: columns }, () => Math.floor(Math.random() * 20));
    }

    function draw() {
        context.fillStyle = 'rgba(0, 0, 0, 0.05)';
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
        context.fillStyle = '#0F0';
        context.font = `${fontSize}px monospace`;

        for (let index = 0; index < rainDrops.length; index += 1) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            context.fillText(text, index * fontSize, rainDrops[index] * fontSize);

            if (rainDrops[index] * fontSize > window.innerHeight && Math.random() > 0.975) {
                rainDrops[index] = 0;
            }
            rainDrops[index] += 1;
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.setInterval(draw, 30);

    const textTarget = document.getElementById('terminal-text');
    const text = `C:\\Users\\Joan> get-skills\n[+] CARGANDO FULL STACK KERNEL...\n---------------------------------\n> HTML 5\n> CSS 3\n> JavaScript\n> Java\n> PHP\n> Laravel 12\n> Bootstrap\n---------------------------------\nC:\\Users\\Joan> _`;

    let characterIndex = 0;
    function type() {
        if (characterIndex >= text.length) return;

        textTarget.append(document.createTextNode(text.charAt(characterIndex)));
        characterIndex += 1;
        window.setTimeout(type, 15);
    }

    window.setTimeout(type, 400);
});
