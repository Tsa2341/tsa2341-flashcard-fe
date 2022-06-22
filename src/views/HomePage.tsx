import * as React from 'react';
import { Box, Typography } from '@mui/material';
import NavBar from '../components/NavBar';

function HomePage() {
	return (
		<>
			<NavBar />
			<Box
				sx={{
					display: 'flex',
					height: '100%',
					width: '100%',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
				}}>
				<Typography color='primary' fontSize={{ xs: '35px', md: '50px' }} fontWeight='bold'>
					The Flashcard App
				</Typography>
				<Typography color='black' fontSize={{ xs: '14px', md: '16px' }}>
					The right place to enlight your self .
				</Typography>
			</Box>
		</>
	);
}

export default HomePage;
