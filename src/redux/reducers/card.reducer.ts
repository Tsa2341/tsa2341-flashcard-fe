import { createSlice } from '@reduxjs/toolkit';

export interface CardState {
	data: object;
	error: object | null;
	loadingGet: boolean;
}

const initialState: CardState = {
	error: null,
	data: {},
	loadingGet: true,
};

export const cardSlice = createSlice({
	name: 'card',
	initialState,
	reducers: {
		getCards: (
			state: CardState,
			{ type, payload }: { type: string; payload: object },
		): CardState => {
			console.log(payload);
			return { ...state, loadingGet: false, error: null, data: payload };
		},
		loadingGetCards: (
			state: CardState,
			{ type, payload }: { type: string; payload: object },
		): CardState => {
			return { ...state, loadingGet: true, data: {} };
		},
		cardError: (
			state: CardState,
			{ type, payload }: { type: string; payload: object },
		): CardState => {
			return { ...state, loadingGet: false, error: payload };
		},
	},
});

export const {
	getCards: getCardsAction,
	loadingGetCards: loadingGetCardsAction,
	cardError: cardErrorAction,
} = cardSlice.actions;
export const cardReducer = cardSlice.reducer;
