import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import '../styles/App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import {
	ApolloClient,
	ApolloClientOptions,
	ApolloProvider,
	createHttpLink,
	InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import OneFlashCard from './OneFlashCard';
import FlashCard from './FlashCard';
import ListFlashCard from './ListFlashCard';

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

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token');
	return {
		headers: {
			...headers,
			authorization: token ? token : '',
		},
	};
});

const httpLink = createHttpLink({
	uri: process.env.REACT_APP_BACKEND_URL,
});

let clientObject: object = {
	// uri: process.env.REACT_APP_BACKEND_URL,
	cache: new InMemoryCache(),
	link: authLink.concat(httpLink),
};

const client = new ApolloClient(clientObject as ApolloClientOptions<typeof clientObject>);

function App() {
	return (
		<ThemeProvider theme={theme}>
			<ApolloProvider client={client}>
				<Routes>
					<Route path='' element={<HomePage />}></Route>
					<Route path='sign-in' element={<SignIn />}></Route>
					<Route path='sign-up' element={<SignUp />}></Route>
					<Route path='flashcard' element={<FlashCard />}>
						<Route path='' element={<ListFlashCard />} />
						<Route path=':id' element={<OneFlashCard />} />
					</Route>
				</Routes>
				<ToastContainer />
			</ApolloProvider>
		</ThemeProvider>
	);
}

export default App;
