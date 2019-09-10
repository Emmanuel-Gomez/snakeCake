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

	public snakeHeadPosY: number = 20;
	public snakeHeadPosX: number = 20;
	public cakePosY: number = Math.floor(Math.random() * this.props.controller.boardSize);
	public cakePosX: number = Math.floor(Math.random() * this.props.controller.boardSize);

	private readonly myRef = React.createRef<HTMLCanvasElement>();

	constructor(props: IBoard){
		super(props);
	}

	componentDidMount() {
		this.canvas = this.myRef.current;
		this.context = this.canvas.getContext("2d");

		setInterval(this.game.bind(this),1000/15);
	}

	componentDidUpdate() {
		this.canvas = this.myRef.current;
		this.context = this.canvas.getContext("2d");
	}

	public game(): void {

		const {
			right,
			down,
			trail,
			boardSize,
			pixelSize
		} = this.props.controller;

		const snakeSize = pixelSize-2;

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
		this.context.fillRect(0,0,this.canvas.width,this.canvas.height);

		

		this.context.fillStyle = snakeColor;
		for(var i=0;i < trail.length;i++) {
			this.context.fillRect(trail[i].x * pixelSize, trail[i].y * pixelSize, snakeSize, snakeSize);
			
			//If the snake steps on its own tail
			if(trail[i].x == this.snakeHeadPosX && trail[i].y == this.snakeHeadPosY) {
				this.props.controller.tail = 5;
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


		this.context.fillStyle =  wallColor;
		this.context.fillRect(200, 300, snakeSize, snakeSize);

	}

	render() {

		return(
			<div className="Root">

				<h2>Score:{this.props.controller.score}</h2>
				
				<div className="CanvasWrapper">
					<canvas
						width="400"
						height="400"
						tabIndex={0}
						ref={this.myRef}
						onKeyDown={ evt => this.props.controller.keyPush(evt)}
					/>
					<h3 className="Message">Snakecake</h3>
				</div>
			</div>
		)
	}

}