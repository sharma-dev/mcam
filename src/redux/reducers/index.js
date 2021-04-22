import { combineReducers } from 'redux';
import identityReducer from "./identity.reducer";
import setting from "./setting.reducer";
import tripsReducer from "./trips.reducer";
import usersReducer from "./user.reducer";

const rootReducer = combineReducers({
    identity: identityReducer,
    trips: tripsReducer,
    users: usersReducer,
    settings: setting
});

export default rootReducer;