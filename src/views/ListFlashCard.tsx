/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import {
	Box,
	Button,
	CircularProgress,
	Grid,
	Icon,
	IconButton,
	MenuItem,
	Modal,
	Select,
	Stack,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import { Container } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
import NavBar from '../components/NavBar';
import {
	cardErrorAction,
	CardState,
	CardType,
	createCardAction,
	deleteCardAction,
	getCardsAction,
	loadingCreateCardAction,
	loadingDeleteCardAction,
	loadingGetCardsAction,
	loadingUpdateCardAction,
	updateCardAction,
} from '../redux/reducers/card.reducer';
import { useForm } from 'react-hook-form';
import { RootState } from '../redux/store';
import { Link } from 'react-router-dom';

const FIND_CARD = gql`
	query Query($findCardEmail2: String, $filter: String, $orderBy: [cardOrderByInput!]) {
		findCard(email: $findCardEmail2, filter: $filter, orderBy: $orderBy) {
			count
			cards {
				id
				question
				answer
				author {
					name
				}
				usersRead {
					user {
						name
						id
					}
				}
			}
		}
	}
`;
const CREATE_CARD = gql`
	mutation ($question: String!, $answer: String!) {
		createCard(question: $question, answer: $answer) {
			id
			question
			answer
			author {
				name
			}
			usersRead {
				user {
					name
					id
				}
			}
		}
	}
`;
const UPDATE_CARD = gql`
	mutation UpdateCard($id: Int!, $question: String, $answer: String) {
		updateCard(id: $id, question: $question, answer: $answer) {
			id
			question
			answer
			author {
				name
			}
			usersRead {
				user {
					name
					id
				}
			}
		}
	}
`;
const DELETE_CARD = gql`
	mutation DeleteCard($id: Int!) {
		deleteCard(id: $id) {
			id
		}
	}
`;

function ListFlashCard() {
	const theme = useTheme();
	const cardsData: CardState = useSelector((state: RootState) => state.cardReducer);
	const [author, setAuthor] = useState<string | undefined>(undefined);
	const [filter, setfilter] = useState<string | undefined>(undefined);
	const [selectCreateAt, setSelectCreateAt] = useState<string | undefined>('asc');
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [activeCard, setActiveCard] = useState<number | null>(null);
	const dispatch: Dispatch = useDispatch();
	const [findCards, { data: findData, loading: findLoading, error: findError }] =
		useLazyQuery(FIND_CARD);
	const [createCard, { data: createData, loading: createLoading, error: createError }] =
		useMutation(CREATE_CARD);
	const [updateCard, { data: updateData, loading: updateLoading, error: updateError }] =
		useMutation(UPDATE_CARD);
	const [deleteCard, { data: deleteData, loading: deleteLoading, error: deleteError }] =
		useMutation(DELETE_CARD);
	const {
		register: createRegister,
		reset: createReset,
		getValues: createGetValues,
		handleSubmit: createHandleSubmit,
	} = useForm();
	const {
		register: updateRegister,
		reset: updateReset,
		getValues: updateGetValues,
		handleSubmit: updateHandleSubmit,
		setValue: updateSetValue,
	} = useForm();

	const getCards = async () => {
		let variables = {};

		if (author) {
			variables = Object.assign(variables, { findCardEmail2: author });
		}
		if (filter) {
			variables = Object.assign(variables, { filter });
		}
		if (selectCreateAt) {
			variables = Object.assign(variables, {
				orderBy: [{ createdAt: selectCreateAt }],
			});
		}

		dispatch(loadingGetCardsAction({}));
		await findCards({
			variables,
			fetchPolicy: 'network-only',
			onError: (error) => {},
		})
			.then((value) => {
				if (value.error) {
					throw value.error;
				}
				dispatch(getCardsAction(value.data.findCard));
			})
			.catch((error) => {
				toast.error(error.message);
				dispatch(cardErrorAction(error));
			});
	};
	const handleCreateCard = async (data: object) => {
		dispatch(loadingCreateCardAction({}));
		await createCard({
			variables: data,
			onError: (error) => {
				toast.error(error.message);
				dispatch(cardErrorAction(error.message));
			},
			onCompleted: (data) => {
				dispatch(createCardAction(data.createCard));
			},
		});

		createReset();
		setOpenCreateModal(false);
	};
	const handleUpdateCard = async (data: object) => {
		dispatch(loadingUpdateCardAction({}));
		await updateCard({
			variables: {
				id: activeCard,
				...data,
			},
			onError: (error) => {
				toast.error(error.message);
				dispatch(cardErrorAction(error.message));
			},
			onCompleted: (data) => {
				dispatch(updateCardAction(data.updateCard));
			},
		});

		updateReset();
		setOpenUpdateModal(false);
	};
	const handleDeleteCard = async () => {
		dispatch(loadingDeleteCardAction({}));
		await deleteCard({
			variables: { id: activeCard },
			onError(error) {
				toast.error(error.message);
				dispatch(cardErrorAction(error.message));
			},
			onCompleted(data) {
				dispatch(deleteCardAction(activeCard!));
			},
		});

		setOpenDeleteModal(false);
	};
	const handleOpenUpdateModal = (card: CardType) => {
		updateSetValue('question', card.question);
		updateSetValue('answer', card.answer);

		setOpenUpdateModal(true);
	};

	useEffect(() => {
		getCards().then(() => {
			console.log('finished running');
		});
	}, []);

	return (
		<>
			<NavBar />
			<Container sx={{ marginTop: 8 }}>
				<Stack margin='10px 0px'>
					<Button
						fullWidth
						variant='contained'
						color='primary'
						sx={{ padding: '10px 15px' }}
						onClick={() => setOpenCreateModal(true)}>
						<>
							<AddIcon sx={{ margin: '0px 5px' }} />
							<Typography fontSize='14px' fontWeight='bold'>
								Create FlashCard
							</Typography>
						</>
					</Button>
				</Stack>
				<Grid container gap='10px'>
					<Grid item>
						<TextField
							size='small'
							id='author'
							label='Author Email'
							name='author'
							autoComplete='author'
							value={author}
							onChange={(e) => {
								setAuthor(e.target.value);
							}}
						/>
					</Grid>
					<Grid item>
						<TextField
							size='small'
							id='filter'
							label='Filter'
							name='filter'
							autoComplete='filter'
							value={filter}
							onChange={(e) => {
								setfilter(e.target.value);
							}}
						/>
					</Grid>
					<Grid item>
						<Select
							size='small'
							value={selectCreateAt}
							onChange={(e) => {
								setSelectCreateAt(e.target.value);
							}}
							sx={{ width: '150px' }}>
							<MenuItem value='asc'>ascending</MenuItem>
							<MenuItem value='desc'>descending</MenuItem>
							<MenuItem value=''>none</MenuItem>
						</Select>
					</Grid>
					<Grid item>
						<Button color='primary' variant='contained' onClick={() => getCards()}>
							Search
						</Button>
					</Grid>
				</Grid>
				<Container sx={{ padding: '10px 0px' }}>
					{!cardsData.loadingGet && cardsData.data ? (
						<Stack gap='10px' direction='column' width='100%'>
							{cardsData.data.cards.map((card: CardType) => (
								<Box
									key={card.id}
									component='div'
									sx={{
										width: '100%',
										padding: '20px',
										display: 'flex',
										alignItems: 'center',
										backgroundColor: '#f5f5f5',
										borderRadius: '10px',
										border: `1px solid ${theme.palette.secondary.dark}`,
										flexGap: { xs: '5px', sm: '10px', md: '20px' },
									}}>
									<Typography fontSize='20px' fontWeight='bold' color='#a1a1a1' marginRight='10px'>
										{card.id}
									</Typography>
									<Link
										to={`${card.id}`}
										style={{
											textDecoration: 'none',
											width: '100%',
											overflow: 'hidden',
											cursor: 'pointer',
										}}>
										<Typography
											marginRight='10px'
											lineHeight='18px'
											fontSize='16px'
											color='black'
											sx={{
												overflow: 'hidden',
												textOverflow: 'ellipsis',
												cursor: 'pointer',
											}}>
											{card.question}
										</Typography>
									</Link>
									<Stack gap='10px' direction='row' width='max-content'>
										<IconButton
											onClick={() => {
												setActiveCard(card.id);
												handleOpenUpdateModal(card);
											}}>
											<EditIcon
												sx={{
													height: '20px',
													color: theme.palette.secondary.main,
													cursor: 'pointer',
												}}
											/>
										</IconButton>
										<IconButton
											onClick={() => {
												setActiveCard(card.id);
												setOpenDeleteModal(true);
											}}>
											<DeleteIcon
												sx={{
													height: '20px',
													color: 'red',
													cursor: 'pointer',
												}}></DeleteIcon>
										</IconButton>
										<IconButton>
											<Link
												to={`${card.id}`}
												style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
												<ArrowForwardIosIcon
													sx={{
														height: '20px',
														color: theme.palette.primary.dark,
														cursor: 'pointer',
													}}
												/>
											</Link>
										</IconButton>
									</Stack>
								</Box>
							))}
						</Stack>
					) : (
						<CircularProgress />
					)}
				</Container>

				<Modal
					open={openCreateModal}
					onClose={() => {
						if (!createLoading) {
							setOpenCreateModal(false);
						}
					}}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px',
					}}>
					<Box
						component='div'
						sx={{
							width: '100%',
							maxWidth: '300px',
							padding: '20px',
							backgroundColor: 'white',
							borderRadius: '10px',
						}}>
						<Stack gap='10px'>
							<TextField
								fullWidth
								id='question'
								label='Question'
								defaultValue=''
								autoFocus
								{...createRegister('question')}
							/>
							<TextField
								fullWidth
								id='answer'
								label='answer'
								defaultValue=''
								{...createRegister('answer')}
							/>
							<Button
								fullWidth
								variant='contained'
								onClick={createHandleSubmit(handleCreateCard)}
								disabled={createLoading}>
								{createLoading ? (
									<CircularProgress size='20px' />
								) : (
									<>
										<AddIcon sx={{ margin: '0px 5px' }} />
										<Typography>Create</Typography>
									</>
								)}
							</Button>
						</Stack>
					</Box>
				</Modal>
				<Modal
					open={openUpdateModal}
					onClose={() => {
						if (!updateLoading) {
							setOpenUpdateModal(false);
						}
					}}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px',
					}}>
					<Box
						component='div'
						sx={{
							width: '100%',
							maxWidth: '300px',
							padding: '20px',
							backgroundColor: 'white',
							borderRadius: '10px',
						}}>
						<Stack gap='10px'>
							<TextField
								fullWidth
								id='question'
								label='Question'
								defaultValue=''
								autoFocus
								{...updateRegister('question')}
							/>
							<TextField
								fullWidth
								id='answer'
								label='answer'
								defaultValue=''
								{...updateRegister('answer')}
							/>
							<Button
								fullWidth
								variant='contained'
								onClick={updateHandleSubmit(handleUpdateCard)}
								disabled={updateLoading}>
								{updateLoading ? (
									<CircularProgress size='20px' />
								) : (
									<>
										<AddIcon sx={{ margin: '0px 5px' }} />
										<Typography>Update</Typography>
									</>
								)}
							</Button>
						</Stack>
					</Box>
				</Modal>
				<Modal
					open={openDeleteModal}
					onClose={() => {
						if (!deleteLoading) {
							setOpenDeleteModal(false);
						}
					}}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '20px',
					}}>
					<Box
						component='div'
						sx={{
							width: '100%',
							maxWidth: '350px',
							padding: '20px',
							backgroundColor: 'white',
							borderRadius: '10px',
						}}>
						<Typography fontSize='30px' color='primary.dark' fontWeight='bold'>
							Delete Card
						</Typography>
						<Typography marginLeft='20px' fontSize='16px' color='dark' fontWeight='400'>
							Do you really wish to delete this Card?
						</Typography>
						<Stack marginTop='30px' direction='row' gap='10px' justifyContent='right'>
							<Button
								color='info'
								variant='contained'
								onClick={() => setOpenDeleteModal(false)}
								disabled={cardsData.loadingDelete}>
								{cardsData.loadingDelete ? (
									<CircularProgress size='20px' />
								) : (
									<>
										<Typography>Cancel</Typography>
									</>
								)}
							</Button>
							<Button
								color='error'
								variant='contained'
								onClick={handleDeleteCard}
								disabled={cardsData.loadingDelete}>
								{cardsData.loadingDelete ? (
									<CircularProgress size='20px' />
								) : (
									<>
										<Typography>Delete</Typography>
									</>
								)}
							</Button>
						</Stack>
					</Box>
				</Modal>
			</Container>
		</>
	);
}

export default ListFlashCard;
