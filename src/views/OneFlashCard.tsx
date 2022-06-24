import { gql, useMutation } from '@apollo/client';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Container,
	IconButton,
	MenuItem,
	Select,
	Stack,
	Typography,
	useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';
import {
	cardErrorAction,
	loadingReadCardAction,
	readCardAction,
} from '../redux/reducers/card.reducer';
import { RootState } from '../redux/store';

const READ_CARD = gql`
	mutation ReadCard($id: Int!, $confidence: Int!) {
		readCard(id: $id, confidence: $confidence) {
			id
			usersRead {
				user {
					id
					name
				}
			}
		}
	}
`;

function OneFlashCard() {
	const theme = useTheme();
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const cardsData = useSelector((state: RootState) => state.cardReducer);
	const [flipped, setflipped] = useState(false);
	const [selectConfidence, setselectConfidence] = useState<number>(5);

	const [readCard] = useMutation(READ_CARD);

	const activeCard = cardsData.data?.cards.filter(
		(card) => card.id === parseInt(params.id as string),
	)[0];

	const handleSubmit = async () => {
		dispatch(loadingReadCardAction({}));
		await readCard({
			variables: {
				id: parseInt(params.id!),
				confidence: selectConfidence,
			},
			onError(error) {
				toast.error(error.message);
				dispatch(cardErrorAction(error));
			},
			onCompleted(data) {
				dispatch(readCardAction(data.readCard));

				setflipped(false);
			},
		});
	};

	return (
		<>
			<NavBar>
				<Stack justifyContent='left' width='100%'>
					<IconButton
						sx={{ width: 'max-content' }}
						onClick={() => {
							navigate('/flashcard');
						}}>
						<ArrowCircleLeftIcon sx={{ width: '30px', height: '30px' }} />
					</IconButton>
				</Stack>
			</NavBar>
			<Container
				sx={{
					marginTop: '70px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexFlow: 'column nowrap',
					gap: '10px',
					height: 'calc(100% - 70px)',
				}}>
				<Card
					sx={{
						maxWidth: '400px',
						width: '100%',
						backgroundColor: theme.palette.primary.light,
						height: '300px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexFlow: 'column nowrap',
						position: 'relative',
					}}>
					<Typography fontSize='14px' sx={{ position: 'absolute', top: '10px', left: '10px' }}>
						By: {activeCard?.author.name.toLocaleUpperCase()}
					</Typography>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							padding: '20px',
							flexFlow: 'column nowrap',
							flexGap: '30px',
						}}>
						<Typography fontSize='30px' fontWeight='bold'>
							{flipped ? 'Answer' : 'Question'}
						</Typography>
						<Typography color={flipped ? 'secondary.light' : 'black'} fontSize='16px'>
							{flipped ? activeCard?.answer : activeCard?.question}
						</Typography>
					</Box>
					<Typography fontWeight='bold' sx={{ position: 'absolute', bottom: '10px', left: '15px' }}>
						Reads: <Typography component='span'>{activeCard?.usersRead.length}</Typography>
					</Typography>
					<Box sx={{ position: 'absolute', bottom: '10px', right: '15px' }}>
						{activeCard?.usersRead.filter(
							(user) => user.user.id === parseInt(localStorage.getItem('userId') as string),
						).length === 0 ? (
							<Typography color={flipped ? 'secondary.light' : 'white'}>
								{flipped ? 'Viewed' : 'Not Viewed'}
							</Typography>
						) : (
							<Typography color='secondary.light'>Viewed</Typography>
						)}
					</Box>
				</Card>
				{flipped ? (
					<Stack
						gap='20px'
						direction='row'
						flexWrap='nowrap'
						sx={{ maxWidth: '400px', width: '100%' }}>
						<Select
							size='small'
							sx={{
								width: '30%',
							}}
							value={selectConfidence}
							onChange={(e) => {
								setselectConfidence(parseInt(e.target.value as string));
							}}>
							<MenuItem value={1}>1</MenuItem>
							<MenuItem value={2}>2</MenuItem>
							<MenuItem value={3}>3</MenuItem>
							<MenuItem value={4}>4</MenuItem>
							<MenuItem value={5}>5</MenuItem>
						</Select>
						<Button
							onClick={() => handleSubmit()}
							variant='contained'
							color='secondary'
							disabled={cardsData.loadingRead}
							sx={{
								width: '70%',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							{cardsData.loadingRead ? (
								<CircularProgress size='20px' />
							) : (
								<Typography fontSize='14px'>Submit</Typography>
							)}
						</Button>
					</Stack>
				) : (
					<Button
						variant='contained'
						color='secondary'
						size='small'
						onClick={() => {
							setflipped(true);
						}}
						sx={{
							display: 'flex',
							gap: '20px',
							justifyContent: 'center',
							alignItems: 'center',
							maxWidth: '400px',
							width: '100%',
						}}>
						<Typography>Click to View the Answer</Typography>
						<ArrowForwardIosIcon sx={{ width: '14px', height: '14px' }} />
					</Button>
				)}
			</Container>
		</>
	);
}

export default OneFlashCard;
