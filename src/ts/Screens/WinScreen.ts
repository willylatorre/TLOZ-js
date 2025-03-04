import { Game } from "../Game";

import { StateObserver } from "../Libraries/Observers";
import { AudioLoader, SpriteLoader } from "../Libraries/Loaders";

import { AbstractScreen } from "./AbstractScreen";

enum WinScreenState {
  PlayerAnimation,
  HideGame,
  BlackScreen
}

export class WinScreen extends AbstractScreen {
  music: HTMLAudioElement;
  notificationSent: Boolean;
  killedSprites: HTMLImageElement[] = [];

  constructor(game: Game) {
    super(
      game,
      new StateObserver(WinScreenState.PlayerAnimation),
      "#202020",
      "YOU ARE NOT A ROBOT 🤖",
      "redirecting to your destination...",
      150
    );

    this.music = AudioLoader.load("/sounds/music/ending.mp3", true);
    this.notificationSent = false;
    this.killedSprites[1] = SpriteLoader.load("/sprites/png/killed1.png");
    this.killedSprites[2] = SpriteLoader.load("/sprites/png/killed2.png");
  }

  draw(): void {
    switch (this.state.get()) {
      case WinScreenState.PlayerAnimation:
        this.Game.Viewport.draw();
        this.Game.EnemyManager.draw();
        this.Game.Sword.drawWin();
        this.Game.Player.drawWin();
        this.Game.Hud.draw();

        if (this.state.currentFrame > 120)
          this.state.setNextState(WinScreenState.HideGame);
        break;

      case WinScreenState.HideGame:
        if (this.state.isFirstFrame) this.Game.Panes.reset();

        this.Game.Viewport.draw();
        this.Game.EnemyManager.draw();
        this.Game.Sword.drawWin();
        this.Game.Player.drawWin();
        this.Game.Hud.draw();
        this.Game.Panes.drawClose();

        if (this.Game.Panes.isAnimationFinished) {
          this.state.setNextState(WinScreenState.BlackScreen);
        }
        break;

      case WinScreenState.BlackScreen:
        if (this.state.isFirstFrame) this.music.play();

        if (!this.notificationSent) {
          window.parent.postMessage({
            'msg': 'win'
          }, "*");
          this.notificationSent = true
        }

        if (this.Game.EventManager.isEnterPressed) {
          this.music.pause();
          this.Game.restart();
        }

        super.draw();
        break;
    }

    super.updateObservers();
  }
}
