import React from 'react';
import { Route, Routes } from 'react-router-dom';
import FlashCardPage from './FlashCardPage';
import HomePage from './HomePage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import '../styles/App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

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

const client = new ApolloClient({
	uri: 'https://tsa2341-flashcard-be.herokuapp.com/',
	cache: new InMemoryCache(),
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<ApolloProvider client={client}>
				<Routes>
					<Route path='' element={<HomePage />}></Route>
					<Route path='sign-in' element={<SignIn />}></Route>
					<Route path='sign-up' element={<SignUp />}></Route>
					<Route path='flashcard' element={<FlashCardPage />}></Route>
				</Routes>
				<ToastContainer />
			</ApolloProvider>
		</ThemeProvider>
	);
}

export default App;
