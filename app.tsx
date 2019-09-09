import "./src/styles/app.css";

import * as React from "react";
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { Board } from './src/components/Board';
import { controller } from "./src/controllers/controller";

const boardController = new controller();

ReactDOM.render(
	<Provider>
		<Board controller={boardController}/>
	</Provider>,
document.getElementById('root'));
