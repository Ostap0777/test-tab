
import './App.css';
import { BrowserRouter, Route, Routes,} from 'react-router-dom';


import HomePage from './Components/HomeApp/HomePage';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TabId from './Components/TabId/TabId';

function App() {
  return (
	<DndProvider backend={HTML5Backend}>
	<BrowserRouter>
	<Routes>
		 <Route path='/' element={<HomePage/>} />
		 <Route path='tab/:id' element={<TabId/>}/>
	</Routes>
	</BrowserRouter>
	</DndProvider>
  );
}

export default App;
