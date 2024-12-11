const picture = document.getElementById("student-picture");
const fields = document.querySelectorAll(".mark-field");
const dialog = document.getElementById("dialog");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const canvas = document.getElementById("animation-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

fields.forEach(field => {
    field.addEventListener("mouseenter", () => {
        const mark = field.dataset.mark;


        switch (mark) {
            case "60":
                picture.src = "images/mark60.png";
                break;
            case "70":
                picture.src = "images/mark70.png";
                break;
            case "80":
                picture.src = "images/mark80.png";
                break;
            case "90":
                picture.src = "images/mark90.png";
                break;
            case "100":
                picture.src = "images/mark100.png";
                break;
            default:
                picture.src = "images/default.png"; 
        }
    });
    field.addEventListener("click", () => {
        dialog.style.display = "block";
    });
});


yesBtn.addEventListener("click", () => {
    dialog.style.display = "none";
    showFireworks();
});

noBtn.addEventListener("click", () => {
    dialog.style.display = "none";
    showRain();
});

function showFireworks() {
    canvas.style.display = "block";

    const fireworksDuration = 4000; // 4 seconds
    const fireworksInterval = 300; // Time between each firework launch
    const sound = new Audio('music/fireworks-29629.mp3'); 
    sound.volume = 0.3; 

    function createFirework(x, y) {
        const particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push({
                x,
                y,
                vx: Math.random() * 4 - 2,
                vy: Math.random() * 4 - 2,
                size: Math.random() * 3 + 2,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                life: 100,
            });
        }
        return particles;
    }

    let fireworks = [];
    let fireworkAnimation;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fireworks.forEach((firework, index) => {
            firework.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.size *= 0.98;
                p.life -= 1;

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
            fireworks[index] = firework.filter(p => p.life > 0);
        });
        fireworks = fireworks.filter(f => f.length > 0);

        if (fireworks.length > 0 || Date.now() - startTime < fireworksDuration) {
            fireworkAnimation = requestAnimationFrame(animate);
        } else {
            canvas.style.display = "none";
            sound.pause();
            sound.currentTime = 0;
        }
    }

    const startTime = Date.now();
    animate();

    const fireworkInterval = setInterval(() => {
        if (Date.now() - startTime >= fireworksDuration) {
            clearInterval(fireworkInterval);
            return;
        }
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        fireworks.push(createFirework(x, y));
        sound.play();
    }, fireworksInterval);
}


function showRain() {
    canvas.style.display = "block";
    const drops = Array.from({ length: 120}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: Math.random() * 5 + 2,
        length: Math.random() * 15 + 10,
    }));

    let rainAnimation;
    let opacity = 1;


    const audio = new Audio('music/ashes-of-hiroshima-272353.mp3');
    audio.loop = true; 
    audio.play();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = opacity;

        drops.forEach(d => {
            d.y += d.vy;
            if (d.y > canvas.height) d.y = 0;
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x, d.y - d.length);
            ctx.stroke();
        });

        rainAnimation = requestAnimationFrame(animate);
    }

    animate();

    const fadeInterval = setInterval(() => {
        opacity -= 0.05; 
        if (opacity <= 0) {
            clearInterval(fadeInterval);
            cancelAnimationFrame(rainAnimation);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
            audio.pause(); 
            audio.currentTime = 0;
        }
    }, 150); // Decrease opacity every 150ms (approx. 20 steps over 3 seconds)
}


