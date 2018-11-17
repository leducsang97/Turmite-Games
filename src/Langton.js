import React from 'react';
import ReactDOM from 'react-dom';
import './box.css';
import { ButtonToolbar, MenuItem, DropdownButton } from 'react-bootstrap';

class Box extends React.Component {
	selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col);
        this.props.setAntPosition(this.props.row, this.props.col);
        
	}

	render() {
		return (
			<div
				className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
			/>
		);
	}
}

class Grid extends React.Component {
	render() {
		const width = (this.props.cols * 14);
		var rowsArr = [];

		var boxClass = "";
		for (var i = 0; i < this.props.rows; i++) {
			for (var j = 0; j < this.props.cols; j++) {
				let boxId = i + "_" + j;
				if (i==this.props.x && j==this.props.y) {
					boxClass = "box current";
				}
				else {
					boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
				}
				rowsArr.push(
					<Box
						boxClass={boxClass}
						key={boxId}
						boxId={boxId}
						row={i}
						col={j}
                        selectBox={this.props.selectBox}
                        setAntPosition={this.props.setAntPosition}
					/>
				);
			}
		}

		return (
			<div className="grid" style={{ width: width }}>
				{rowsArr}
			</div>
		);
	}
}

class Buttons extends React.Component {

	handleSelect = (evt) => {
		this.props.gridSize(evt);
	}

	render() {
		return (
			<div className="center">
				<ButtonToolbar>
					<button className="btn btn-default" onClick={this.props.playButton}>
						Play
					</button>
					<button className="btn btn-default" onClick={this.props.pauseButton}>
						Pause
					</button>
					<button className="btn btn-default" onClick={this.props.clear}>
						Clear
					</button>
					<button className="btn btn-default" onClick={this.props.slow}>
						Slow
					</button>
					<button className="btn btn-default" onClick={this.props.fast}>
						Fast
					</button>
				</ButtonToolbar>
			</div>
		)
	}
}

class Langton extends React.Component {
	constructor() {
		super();
		this.x = 20;
		this.y = 20;
		this.speed = 100;
		this.rows = 50;
		this.cols = 80;
		this.dir = 1;
		this.ANTUP = 0;
		this.ANTDOWN = 2;
		this.ANTRIGHT = 1;
		this.ANTLEFT = 3;

		this.state = {
			generation: 0,
			gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
			langton: false
		}
	}

	selectBox = (row, col) => {
		let gridCopy = arrayClone(this.state.gridFull);
		gridCopy[row][col] = !gridCopy[row][col];
		this.setState({
			gridFull: gridCopy
		});
	}

	seed = () => {
		let gridCopy = arrayClone(this.state.gridFull);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				if (Math.floor(Math.random() * 4) === 1) {
					gridCopy[i][j] = true;
				}
			}
		}
		this.setState({
			gridFull: gridCopy
		});
	}

	playButton = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(this.play, this.speed);
	}

	pauseButton = () => {
		clearInterval(this.intervalId);
	}

	slow = () => {
		this.speed = 50;
		this.playButton();
	}

	fast = () => {
		this.speed = 100;
		this.playButton();
	}

	clear = () => {
		var grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
		this.setState({
			gridFull: grid,
			generation: 0
		});
	}

	gridSize = (size) => {
		switch (size) {
			case "1":
				this.cols = 20;
				this.rows = 10;
				break;
			case "2":
				this.cols = 50;
				this.rows = 30;
				break;
			default:
				this.cols = 70;
				this.rows = 50;
		}
		this.clear();

	}

	ant = (x, y, dir) => {
		return { x: x, y: y, dir: dir };
	}

	turnRight = () => {
		this.dir++;
		if (this.dir > this.ANTLEFT) {
			this.dir = this.ANTUP;
		}
	}

	turnLeft = () => {
		this.dir--;
		if (this.dir < this.ANTUP) {
			this.dir = this.ANTLEFT;
		}
	}
	moveForward = () => {
		if (this.dir == this.ANTUP) {
			this.y--;
		}
		else if (this.dir == this.ANTRIGHT) {
			this.x++;
		}
		else if (this.dir == this.ANTDOWN) {
			this.y++;
		}
		else if (this.dir == this.ANTLEFT) {
			this.x--;
		}

		if (this.x >= this.rows) {
			this.x = 0;
		}
		else if (this.x < 0) {
			this.x = this.rows - 1;
		}
		if (this.y >= this.cols) {
			this.y = 0;
		}
		else if (this.y < 0) {
			this.y = this.cols - 1;
		}
	}

	langtonPlay = (g) => {
		var cur_state = g[this.x][this.y];
		if (cur_state) {
			this.turnRight();
			g[this.x][this.y] = false;
			this.moveForward();
		}
		else if (!cur_state) {
			this.turnLeft();
			g[this.x][this.y] = true;
			this.moveForward();
		}
		
		return g;
	}
	play = () => {
        let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);
        this.langtonPlay(g2);
        
		this.setState({
			gridFull: g2,
			generation: this.state.generation + 1
		});
    }
    
    setAntPosition = (x,y)=>{
        this.x = x;
        this.y = y;
    }

	playAnt = () => {
		let g = this.state.gridFull;
		let g2 = arrayClone(this.state.gridFull);

	}
	componentDidMount() {
		// this.seed();
		// this.playButton();
	}


	render() {
		return (
			<div>

				<Buttons
					playButton={this.playButton}
					pauseButton={this.pauseButton}
					slow={this.slow}
					fast={this.fast}
					clear={this.clear}
					// seed={this.seed}
					gridSize={this.gridSize}
				/>
				<Grid
					gridFull={this.state.gridFull}
					x={this.x}
					y={this.y}
					rows={this.rows}
					cols={this.cols}
                    selectBox={this.selectBox}
                    setAntPosition={this.setAntPosition}
				/>
				<h2>Generations: {this.state.generation}</h2>
			</div>
		);
	}
}

function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}

export default Langton;
