import * as React from "react";
import { observer } from "mobx-react";
import { IBoardController } from "../controllers/controller";

interface IBoard {
	controller: IBoardController
}

const snakeColor: string = "#00FF00";
const cakeColor: string = "#f500ff";
const wallColor: string = "#6700ff";

@observer
export class Board extends React.Component<IBoard> {

	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;
	public start: number = 0;

	public snakeHeadPosY: number = 20;
	public snakeHeadPosX: number = 20;
	public cakePosY: number = Math.floor(Math.random() * this.props.controller.boardSize);
	public cakePosX: number = Math.floor(Math.random() * this.props.controller.boardSize);

	private readonly myRef = React.createRef<HTMLCanvasElement>();

	constructor(props: IBoard){
		super(props);
	}

	public componentDidMount() {
		this.canvas = this.myRef.current;
		this.context = this.canvas.getContext("2d");

		setInterval(this.game.bind(this), 1000/15);
	}

	public componentDidUpdate() {
		this.canvas = this.myRef.current;
		this.context = this.canvas.getContext("2d");
	}

	public reset(): void {
		this.props.controller.reset();
		this.snakeHeadPosX = 20;
		this.snakeHeadPosY = 20;
	}

	public game(): void {

		const {
			right,
			down,
			trail,
			boardSize,
			pixelSize,
			uTurn
		} = this.props.controller;

		const snakeSize = pixelSize - 2;

		this.snakeHeadPosX += right;
		this.snakeHeadPosY += down;
	
		if(this.snakeHeadPosX < 0) {
			this.snakeHeadPosX = boardSize-1;
		}

		if(this.snakeHeadPosX > boardSize-1) {
			this.snakeHeadPosX = 0;
		}

		if(this.snakeHeadPosY < 0) {
			this.snakeHeadPosY = boardSize-1;
		}

		if(this.snakeHeadPosY > boardSize-1) {
			this.snakeHeadPosY = 0;
		}

		this.context.fillStyle = "black";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.fillStyle = snakeColor;
		for(let i=0; i < trail.length; i++) {
			this.context.fillRect(trail[i].x * pixelSize, trail[i].y * pixelSize, snakeSize, snakeSize);
			
			//If the snake steps on its own tail
			if(trail[i].x == this.snakeHeadPosX && trail[i].y == this.snakeHeadPosY && !uTurn) {
				this.reset();
			}
		}

		//Adds the tail position
		trail.push({ x: this.snakeHeadPosX, y: this.snakeHeadPosY });
		while(trail.length > this.props.controller.tail) {
			trail.shift();
		}

		//If the snake get the cake
		//Moves it to a random place inside the board
		if(this.cakePosX == this.snakeHeadPosX && this.cakePosY == this.snakeHeadPosY) {
			this.props.controller.tail++;
			this.cakePosX = Math.floor(Math.random() * boardSize);
			this.cakePosY = Math.floor(Math.random() * boardSize);
		}

		this.context.fillStyle = cakeColor;
		this.context.fillRect(this.cakePosX * pixelSize, this.cakePosY * pixelSize, snakeSize, snakeSize);

		this.obstacles();
	}

	public obstacles(): void {

		const { pixelSize, boardSize } = this.props.controller;

		this.start += 1;

		if(this.start < 0) {
			this.start = boardSize-1;
		}

		if(this.start > boardSize-1) {
			this.start = 0;
		}

		if(this.start < 0) {
			this.start = boardSize-1;
		}

		if(this.start > boardSize-1) {
			this.start = 0;
		}

		const snakeSize = pixelSize-2;

		this.context.fillStyle = wallColor;
		for(let i = this.start; i < 10 + this.start; i++) {
			
			this.context.fillRect(10 * pixelSize, ( 0 + i) * pixelSize, snakeSize, snakeSize);
			this.context.fillRect(30 * pixelSize, (0 + i) * pixelSize, snakeSize, snakeSize);

			if(this.snakeHeadPosX === 10 && this.snakeHeadPosY === 0 + i) {
				this.reset();
			}
			else if(this.snakeHeadPosX === 30 && this.snakeHeadPosY === 0 + i) {
				this.reset();
			}
		}
	}

	render() {

		return(
			<div className="Root">

				<h2>Score:{this.props.controller.score}</h2>
				
				<div className="CanvasWrapper">
					<canvas
						width="400"
						height="400"
						tabIndex={1}
						ref={this.myRef}
						onKeyDown={ evt => this.props.controller.keyPush(evt)}
					/>
					<h3 className="Message">Snakecake</h3>
				</div>
			</div>
		)
	}

}