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
	uTurn: boolean

	keyPush: ( evt: React.KeyboardEvent<HTMLCanvasElement> ) => void
	reset: () => void
}

export class controller implements IBoardController {

	public readonly boardSize: number = 40;
	public readonly pixelSize: number = 20;

	@observable down = 0;
	@observable right = 0;
	@observable tail = 5;
	@observable trail: ICoordinates[] = [];
	@observable uTurn = false;

	@computed get score(): number {
		return this.tail - 5;
	}

	@action
	public keyPush(evt: React.KeyboardEvent<HTMLCanvasElement> ): void {

		switch(evt.keyCode) {
			case 37:
				this.uTurn = this.right > 0;
				this.right=-1;
				this.down=0;
				break;
			case 38:
				this.uTurn = this.down > 0
				this.right=0;
				this.down=-1;
				break;
			case 39:
				this.uTurn = this.right < 0;
				this.right=1;
				this.down=0;
				break;
			case 40:
				this.uTurn = this.down < 0;
				this.right=0;
				this.down=1;
				break;
		}
	}

	@action reset(): void {
		this.down = 0;
		this.right = 0;
		this.tail = 5;
		this.uTurn = false;
	}
}