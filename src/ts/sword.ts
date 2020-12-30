class Sword extends SimpleBox {
    Game: Game;

    swordWidth: number;
    swordHeight: number;

    swordHandleWidth: number;

    sprites: HTMLImageElement[] = [];

    slashSound: HTMLAudioElement;
    flyingSound: HTMLAudioElement;

    isFlying: boolean;

    direction: Direction;

    constructor(game: Game) {
        super();
        this.Game = game;

        this.swordWidth = 64;
        this.swordHeight = 28;
        this.swordHandleWidth = 16;

        this.sprites[Direction.Up] = SpriteLoader.load("./sprites/png/sword-up.png");
        this.sprites[Direction.Right] = SpriteLoader.load("./sprites/png/sword-right.png");
        this.sprites[Direction.Down] = SpriteLoader.load("./sprites/png/sword-down.png");
        this.sprites[Direction.Left] = SpriteLoader.load("./sprites/png/sword-left.png");

        this.slashSound = AudioLoader.load("./sounds/effect/Sword_Slash.wav");
        this.flyingSound = AudioLoader.load("./sounds/effect/Sword_Shoot.wav");

        this.isFlying = false;
    }

    draw(): void {
        if (this.Game.Player.isAttack) {
            this.Game.Viewport.drawImage(
                this.sprites[this.direction],
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }

    collisions(): void {
        if (this.Game.Player.isAttack) {
            this.Game.Enemies.loopEnemies((enemy) => {
                if (simpleMovingBoxCollision(enemy, this)) {
                    this.Game.Enemies.killEnemy(enemy);
                }
            });
        }
    }

    listenEvents(): void {
        if (this.Game.Player.isAttack) {
            this.direction = this.Game.Player.direction;

            if (this.direction === Direction.Up) {
               this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
               this.y = this.Game.Player.y - this.swordWidth + this.swordHandleWidth;
               this.width = this.swordHeight;
               this.height = this.swordWidth;
           } else if (this.direction === Direction.Down) {
               this.x = this.Game.Player.x + (this.Game.Player.width - this.swordHeight) / 2;
               this.y = this.Game.Player.y + this.Game.Player.width - this.swordHandleWidth;
               this.width = this.swordHeight;
               this.height = this.swordWidth;
           } else if (this.direction === Direction.Left) {
                this.x = this.Game.Player.x - this.swordWidth + this.swordHandleWidth;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            } else if (this.direction === Direction.Right) {
                this.x = this.Game.Player.x + this.Game.Player.width - this.swordHandleWidth;
                this.y = this.Game.Player.y + (this.Game.Player.height - this.swordHeight) / 2;
                this.width = this.swordWidth;
                this.height = this.swordHeight;
            }

            this.slashSound.play();
        }

        if (
            !this.isFlying
            && this.Game.Player.isAttackLastFrame
            && !this.Game.Player.isAttack
            && this.Game.Player.isFullLife
        ) {
            this.flyingSound.play();

            this.isFlying = true;

            this.Game.Projectiles.addProjectile(new Projectile(
                this.x,
                this.y,
                this.width,
                this.height,
                this.Game.Player.speed * 2,
                this.direction,
                this.sprites[this.direction],
                false, // Disable collision on Player
                true, // Enable collisions on Ennemies
                () => this.isFlying = false
            ));
        }
    }

    reset(): void {

    }
}
