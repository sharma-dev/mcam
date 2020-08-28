import { START_LOADING, STOP_LOADING } from "../../utils/constants/common.constants";
import { GET_USER_CONTACT_SUCCESS, GET_USER_CONTACT_FAILURE} from '../../utils/constants/user.constants';
import { CLEAR_ERROR } from "../../utils/constants/error.constants";

const initialState = {
    profile: {},
    contacts: {},
    loading: false
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case START_LOADING:
            return {
                ...state,
                loading: true
            };
        case STOP_LOADING:
            return {
                ...state,
                loading: false
            };
        case GET_USER_CONTACT_SUCCESS:
            return {
                ...state,
                contacts: action.payload,
                error: "",
                loading: false
            }
        case GET_USER_CONTACT_FAILURE:
            return {
                ...state,
                error: action.payload
            }
        case CLEAR_ERROR:
            return {
                ...state,
                error: ""
            };
        default:
            return state;
    }
}


export default userReducer;