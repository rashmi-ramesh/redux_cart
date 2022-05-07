import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import cartItems from '../../cartItems';
import axios from 'axios';

const url = 'https://course-api.com/react-useReducer-cart-project';

const initialState = {
    cartItems:cartItems,
    amount:0,
    total:0,
    isLoading:true
};

export const getCartItems = createAsyncThunk(
    'cart/getCartItems',async (_,thunkAPI) => { //thunkAPI is a giant obj with getState(),dispatch() etc
        // return await fetch(url).then((res)=>res.json()).catch((err)=>console.log(err))
        try {
            // console.log(thunkAPI.dispatch(openModel()));
            // console.log(thunkAPI.getState());
            const resp = await axios(url);
            return resp.data; //in axios data is in data property
            // const resp = await fetch(url);
            // const newItems = await resp.json();
            // setItems(newItems);
        }
        catch(error) {
            return thunkAPI.rejectWithValue('something went wrong') //err msg comes in payload
        }
    }
)

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        clearCart:(state)=>{
            state.cartItems=[];
        },
        removeItem:(state,action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((item)=>item.id !== itemId)
        },
        increase:(state,action) => {
            const itemId = action.payload;
            const cartItem = state.cartItems.find((item)=>item.id === itemId);
            cartItem.amount = cartItem.amount + 1;
        },
        decrease:(state,action) => {
            const itemId = action.payload;
            const cartItem = state.cartItems.find((item)=>item.id === itemId);
            cartItem.amount = cartItem.amount - 1;
        },
        calculateTotals:(state,action) => {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item)=>{
                amount += item.amount;
                total += item.amount * item.price;
            });
            state.amount = amount;
            state.total = total;
        }

    },
    extraReducers:{
        [getCartItems.pending]:(state) => {
            state.isLoading = true;
        },
        [getCartItems.fulfilled]:(state,action) => {
            // console.log(action);
            state.isLoading = false;
            state.cartItems = action.payload;
        },
        [getCartItems.rejected]:(state,action) => {
            state.isLoading = false;
        }
    }
})

console.log(cartSlice); //name,actions,caseReducers,getInitialState(f),reducer(f)
export default cartSlice.reducer;
export const { clearCart, removeItem, increase, decrease, calculateTotals} = cartSlice.actions;