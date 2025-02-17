import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import thunk from "redux-thunk";
import reduxPromise  from 'redux-promise'
import { composeWithDevTools } from "redux-devtools-extension";
import { createWrapper } from "next-redux-wrapper";
import rootReducer from "./reducers/rootReducer";
import storage from 'redux-persist/lib/storage';

// initial states here
const initalState = {};

const persistConfig = {
  key: 'root',
  storage,
}

// middleware
const middleware = [thunk, reduxPromise];

const persistedReducer = persistReducer(persistConfig, rootReducer)


// creating store
const theStore = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);


const persistor = persistStore(theStore)

// assigning store to next wrapper
const makeStore = () => theStore;

const wrapper = createWrapper(makeStore);

module.exports = {
    theStore,
    persistor,
    wrapper
}

