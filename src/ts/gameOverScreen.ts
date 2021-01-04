enum GameOverScreenState {PlayerAnimation, HideGame, BlackScreen}

class GameOverScreen {
    Game: Game;

    music: HTMLAudioElement;

    state: StateObserver;

    hideGamePaneSpeed: number;
    hideGamePanePosition: number;

    constructor(game: Game) {
        this.Game = game;

        this.music = AudioLoader.load("./sounds/music/game_over.mp3", true);

        this.state = new StateObserver(GameOverScreenState.PlayerAnimation);

        this.hideGamePaneSpeed = 8;
        this.hideGamePanePosition = 0;
    }

    draw(): void {
        switch (this.state.get()) {
            case GameOverScreenState.PlayerAnimation:
                this.Game.Viewport.draw();
                this.Game.Enemies.draw();
                this.Game.Hud.draw();
                this.Game.Player.drawGameOver();

                if (this.Game.Player.isDiedObserver.currentFrame > 145) this.state.set(GameOverScreenState.HideGame);
                break;

            case GameOverScreenState.HideGame:
                this.Game.Viewport.draw();
                this.Game.Hud.draw();

                this.Game.fillRect(
                    -(this.Game.Canvas.width / 2) + this.hideGamePanePosition,
                    0,
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height,
                    "#000"
                );

                this.Game.fillRect(
                    this.Game.Canvas.width - this.hideGamePanePosition,
                    0,
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height,
                    "#000"
                );

                this.hideGamePanePosition += this.hideGamePaneSpeed;

                if (this.hideGamePanePosition > this.Game.Canvas.width / 2) {
                    this.state.set(GameOverScreenState.BlackScreen);
                }
                break;

            case GameOverScreenState.BlackScreen:
                if (this.state.isFirstFrame) this.music.play();

                if (this.Game.EventManager.isEnterPressed) location.reload();

                this.Game.fillRect(
                    0,
                    0,
                    this.Game.Canvas.width,
                    this.Game.Canvas.height,
                    "#000"
                );

                this.Game.fillText(
                    "GAME OVER",
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height / 3,
                    '#fff',
                    '24px',
                    'center',
                    'middle'
                );

                this.Game.fillText(
                    "press enter to retry",
                    this.Game.Canvas.width / 2,
                    this.Game.Canvas.height / 3 * 2,
                    '#fff',
                    '16px',
                    'center',
                    'middle'
                );
                break;
        }
        this.state.update();
    }
}
