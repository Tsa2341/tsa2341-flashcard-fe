import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FlashCardPage from './FlashCardPage';
import HomePage from './HomePage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import '../styles/App.css';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
	palette: {
		secondary: {
			main: '#54ff68',
			dark: '#00ca36',
			light: '#91ff9a',
		},
		primary: {
			main: '#5b35dd',
			light: '#9463ff',
			dark: '#0700aa',
		},
	},
	typography: {
		fontSize: 12,
		fontFamily: 'Roboto sans-serif',
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Routes>
				<Route path='' element={<HomePage />}></Route>
				<Route path='sign-in' element={<SignIn />}></Route>
				<Route path='sign-up' element={<SignUp />}></Route>
				<Route path='flashcard' element={<FlashCardPage />}></Route>
			</Routes>
		</ThemeProvider>
	);
}

export default App;
