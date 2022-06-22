import { Box, Typography, useTheme } from '@mui/material';
import { NavLink } from 'react-router-dom';
import '../styles/NavBar.css';

const LinkTypography =
	(page: string) =>
	({ isActive }: { isActive: boolean }) => {
		return (
			<Typography fontSize={{ xs: '14px', md: '16px' }} color={isActive ? 'primary' : 'black'}>
				{page}
			</Typography>
		);
	};

function NavBar() {
	const theme = useTheme();

	return (
		<>
			<Box
				component='div'
				sx={{
					display: 'flex',
					padding: { xs: '5px 5px', md: '10px 10px' },
					backgroundColor: theme.palette.secondary.light,
					boxShadow: '4px 4px 10px #0000001a, 0px 10px 20px #00000040',
					alignItems: 'center',
					justifyContent: 'right',
					gap: { xs: '10px', md: '20px' },
					position: 'fixed',
					top: 0,
					left: 0,
					maxWidth: '100%',
					width: '100%',
					zIndex: '1000',
				}}>
				<NavLink className='nav-link' to='/'>
					{LinkTypography('Home')}
				</NavLink>
				<NavLink className='nav-link' to='/sign-in'>
					{LinkTypography('SignIn')}
				</NavLink>
				<NavLink className='nav-link' to='/sign-up'>
					{LinkTypography('SignUp')}
				</NavLink>
			</Box>
		</>
	);
}

export default NavBar;
