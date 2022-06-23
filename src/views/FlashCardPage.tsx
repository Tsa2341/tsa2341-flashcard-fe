/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { gql, useLazyQuery } from '@apollo/client';
import { Button, Grid, MenuItem, Select, TextField } from '@mui/material';
import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Dispatch } from 'redux';
import NavBar from '../components/NavBar';
import { getCardsAction } from '../redux/reducers/card.reducer';

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
					}
				}
			}
		}
	}
`;

function FlashCardPage() {
	const [author, setAuthor] = useState<string | undefined>(undefined);
	const [filter, setfilter] = useState<string | undefined>(undefined);
	const [selectId, setSelectId] = useState<string | undefined>('asc');
	const [selectCreateAt, setSelectCreateAt] = useState<string | undefined>('asc');
	const dispatch: Dispatch = useDispatch();
	const [findCards, { data, loading, error }] = useLazyQuery(FIND_CARD);

	const getCards = async () => {
		let variables = {};

		if (author) {
			variables = Object.assign(variables, { findCardEmail2: author });
		}
		if (filter) {
			variables = Object.assign(variables, { filter });
		}
		if (selectId) {
			variables = Object.assign(variables, {
				orderBy: [{ id: selectId }],
			});
		}
		if (selectCreateAt) {
			variables = Object.assign(variables, {
				orderBy: [{ createAt: selectCreateAt }],
			});
		}

		await findCards({
			variables,
		})
			.then((value) => {
				console.log(value, 'data');

				if (value.error) {
					throw value.error;
				}

				dispatch(getCardsAction(value));
			})
			.catch((error) => {
				console.log(error);
				toast.error(error.message);
			});
	};

	useEffect(() => {
		getCards();
	}, []);

	return (
		<>
			<NavBar />
			<Container sx={{ marginTop: 8 }}>
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
							value={selectId}
							onChange={(e) => {
								setSelectId(e.target.value);
							}}
							sx={{ width: '150px' }}>
							<MenuItem value='asc'>ascending</MenuItem>
							<MenuItem value='desc'>descending</MenuItem>
							<MenuItem value=''>none</MenuItem>
						</Select>
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
			</Container>
		</>
	);
}

export default FlashCardPage;
