import { gql, useMutation } from '@apollo/client';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { CircularProgress } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
import NavBar from '../components/NavBar';
import { getUserAction, userErrorAction } from '../redux/reducers/user.reducer';

const SIGN_IN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				name
				email
			}
		}
	}
`;

export default function SignIn() {
	const dispatch: Dispatch = useDispatch();
	const [signIn, { loading, data }] = useMutation(SIGN_IN);
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const signInData = new FormData(event.currentTarget);
		console.log({
			email: signInData.get('email'),
			password: signInData.get('password'),
		});

		await signIn({
			variables: {
				email: signInData.get('email'),
				password: signInData.get('password'),
			},
		})
			.then((value) => {
				console.log(value.data.login, 'value');

				localStorage.setItem('token', value.data.login.token);
				dispatch(getUserAction(value.data.login));
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
						Sign in
					</Typography>
					<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							autoFocus
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
						/>
						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}>
							{loading ? <CircularProgress size='20px' /> : 'Sign In'}
						</Button>
					</Box>
				</Box>
			</Container>
		</>
	);
}
