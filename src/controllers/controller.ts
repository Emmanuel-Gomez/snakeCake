import { action, observable, computed } from "mobx";

interface ICoordinates {
	y: number
	x: number
}

export interface IBoardController {
	down: number
	right: number
	tail: number
	boardSize: number;
	pixelSize: number;
	trail: ICoordinates[]
	score: number;

	keyPush: ( evt: React.KeyboardEvent<HTMLCanvasElement> ) => void
}

export class controller implements IBoardController {

	public readonly boardSize: number = 40;
	public readonly pixelSize: number = 10;

	@observable down = 0;
	@observable right = 0;
	@observable tail = 5;
	@observable trail: ICoordinates[] = [];

	@computed get score(): number {
		return this.tail - 5;
	}

	@action
	public keyPush(evt: React.KeyboardEvent<HTMLCanvasElement> ): void {

		switch(evt.keyCode) {
			case 37:
				//Left
				this.right=-1;
				this.down=0;
				break;
			case 38:
				//Up
				this.right=0;
				this.down=-1;
				break;
			case 39:
				//Right
				this.right=1;
				this.down=0;
				break;
			case 40:
				//Down
				this.right=0;
				this.down=1;
				break;
		}
	}
}