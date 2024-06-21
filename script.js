document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('movable-element');
    const zombie = document.getElementById('zombie-element');
    const healthBar = document.getElementById('health');
    let playerTop = 0;
    let playerLeft = 0;
    let zombieTop = Math.random() * (window.innerHeight - 50);
    let zombieLeft = Math.random() * (window.innerWidth - 50);
    let health = 100;

    const updatePosition = (element, top, left) => {
        element.style.top = `${top}px`;
        element.style.left = `${left}px`;
    };

    updatePosition(zombie, zombieTop, zombieLeft);

    const moveElement = (event) => {
        const step = 10; // Number of pixels to move

        switch (event.key) {
            case 'ArrowUp':
                playerTop = Math.max(playerTop - step, 0);
                break;
            case 'ArrowDown':
                playerTop = Math.min(playerTop + step, window.innerHeight - player.clientHeight);
                break;
            case 'ArrowLeft':
                playerLeft = Math.max(playerLeft - step, 0);
                break;
            case 'ArrowRight':
                playerLeft = Math.min(playerLeft + step, window.innerWidth - player.clientWidth);
                break;
            case ' ':
                shootProjectile(playerLeft + 20, playerTop + 20);
                break;
            default:
                return; // Ignore other keys
        }

        updatePosition(player, playerTop, playerLeft);

        if (checkCollision(player, zombie)) {
            health -= 10;
            healthBar.style.width = `${health}%`;
            if (health <= 0) {
                alert('Game Over');
                resetGame();
            }
        }
    };

    const moveZombie = () => {
        const step = 2; // Number of pixels to move
        const chaseStep = 5; // Number of pixels to move when chasing
        const distance = Math.hypot(playerTop - zombieTop, playerLeft - zombieLeft);

        if (distance < 200) {
            // Chase player
            if (playerTop > zombieTop) {
                zombieTop += chaseStep;
            } else {
                zombieTop -= chaseStep;
            }
            if (playerLeft > zombieLeft) {
                zombieLeft += chaseStep;
            } else {
                zombieLeft -= chaseStep;
            }
        } else {
            // Random movement
            const directions = ['up', 'down', 'left', 'right'];
            const direction = directions[Math.floor(Math.random() * directions.length)];

            switch (direction) {
                case 'up':
                    zombieTop = Math.max(zombieTop - step, 0);
                    break;
                case 'down':
                    zombieTop = Math.min(zombieTop + step, window.innerHeight - zombie.clientHeight);
                    break;
                case 'left':
                    zombieLeft = Math.max(zombieLeft - step, 0);
                    break;
                case 'right':
                    zombieLeft = Math.min(zombieLeft + step, window.innerWidth - zombie.clientWidth);
                    break;
            }
        }

        updatePosition(zombie, zombieTop, zombieLeft);

        if (checkCollision(player, zombie)) {
            health -= 10;
            healthBar.style.width = `${health}%`;
            if (health <= 0) {
                alert('Game Over');
                resetGame();
            }
        }
    };

    const checkCollision = (element1, element2) => {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right ||
            rect1.right < rect2.left
        );
    };

    const shootProjectile = (startLeft, startTop) => {
        const projectile = document.createElement('div');
        projectile.classList.add('projectile');
        document.body.appendChild(projectile);

        let projectileLeft = startLeft;
        let projectileTop = startTop;

        const moveProjectile = () => {
            projectileLeft += 10; // Move right by 10 pixels

            if (projectileLeft > window.innerWidth) {
                projectile.remove();
                return;
            }

            projectile.style.left = `${projectileLeft}px`;
            projectile.style.top = `${projectileTop}px`;

            if (checkCollision(projectile, zombie)) {
                zombieTop = Math.random() * (window.innerHeight - 50);
                zombieLeft = Math.random() * (window.innerWidth - 50);
                updatePosition(zombie, zombieTop, zombieLeft);
                projectile.remove();
            } else {
                requestAnimationFrame(moveProjectile);
            }
        };

        projectile.style.left = `${projectileLeft}px`;
        projectile.style.top = `${projectileTop}px`;

        requestAnimationFrame(moveProjectile);
    };

    const resetGame = () => {
        playerTop = 0;
        playerLeft = 0;
        zombieTop = Math.random() * (window.innerHeight - 50);
        zombieLeft = Math.random() * (window.innerWidth - 50);
        health = 100;
        healthBar.style.width = `${health}%`;
        updatePosition(player, playerTop, playerLeft);
        updatePosition(zombie, zombieTop, zombieLeft);
    };

    window.addEventListener('keydown', moveElement);
    setInterval(moveZombie, 100); // Move zombie every 100 milliseconds
});
