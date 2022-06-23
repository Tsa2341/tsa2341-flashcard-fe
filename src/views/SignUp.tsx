/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { toast } from 'react-toastify';
import { gql, useMutation } from '@apollo/client';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import NavBar from '../components/NavBar';
import { CircularProgress } from '@mui/material';
import {
	getUserAction,
	loadingGetUserAction,
	userErrorAction,
} from '../redux/reducers/user.reducer';
import { useNavigate } from 'react-router-dom';

const SIGN_UP = gql`
	mutation SignUp($email: String!, $password: String!, $name: String!) {
		signup(name: $name, email: $email, password: $password) {
			token
			token
			user {
				id
				name
				email
			}
		}
	}
`;

export default function SignUp() {
	const dispatch: Dispatch = useDispatch();
	const [signUp, { data, loading }] = useMutation(SIGN_UP);
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const signUpData = new FormData(event.currentTarget);

		dispatch(loadingGetUserAction({}));
		await signUp({
			variables: {
				email: signUpData.get('email'),
				password: signUpData.get('password'),
				name: `${signUpData.get('firstName')} ${signUpData.get('lastName')}`,
			},
		})
			.then((value) => {
				console.log(value.data.signup, 'value');

				localStorage.setItem('token', value.data.signup.token);
				dispatch(getUserAction(value.data.signup));
				navigate('/flashcard');
			})
			.catch((error) => {
				toast.error(error.message);
				dispatch(userErrorAction(error.message));
			});
	};

	return (
		<>
			<NavBar />
			<Container
				component='main'
				maxWidth='xs'
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
					height: '100%',
				}}>
				<CssBaseline />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign up
					</Typography>
					<Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete='given-name'
									name='firstName'
									required
									fullWidth
									id='firstName'
									label='First Name'
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id='lastName'
									label='Last Name'
									name='lastName'
									autoComplete='family-name'
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id='email'
									label='Email Address'
									name='email'
									autoComplete='email'
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									name='password'
									label='Password'
									type='password'
									id='password'
									autoComplete='new-password'
								/>
							</Grid>
						</Grid>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}>
							{loading ? <CircularProgress size='20px' /> : 'Sign Up'}
						</Button>
					</Box>
				</Box>
			</Container>
		</>
	);
}
