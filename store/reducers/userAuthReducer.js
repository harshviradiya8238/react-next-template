import { SUCCESS_ADD_USER, ERROR_ADD_USER } from "../constant";

export const initialState = {
  userDetails: {},
  allUsers: [],
  loading: false,
  error: "",
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS_ADD_USER:
      const { data } = action.payload;
      return { ...state, allUsers: [...state.allUsers, data], loading: false };
    case ERROR_ADD_USER:
      return { ...state, loading: false, error: action.payload.error };
    // case USER_LOGIN:
    //     return { ...state, loading: true };
    // case SUCCESS_USER_LOGIN:
    //     return { ...state, userDetails: action.payload, loading: false };
    // case ERROR_USER_LOGIN:
    //     return { ...state, loading: false };
    // case USER_DETAILS:
    //     return { ...state };
    // case SUCCESS_USER_DETAILS:
    //     return { ...state, userDetails: action.payload };
    // case ERROR_USER_DETAILS:
    //     return { ...state };
    // case GET_CANDIDATES:
    //     return { ...state, loading: true };
    // case GET_CANDIDATES_SUCCESS:
    //     return { ...state, loading: false, candidates: action.payload };
    // case GET_CANDIDATES_ERROR:
    //     return { ...state, loading: false };

    // case GET_CANDIDATES_BY_ID:
    //     return { ...state, loading: true };
    // case GET_CANDIDATES_BY_ID_SUCCESS:
    //     return { ...state, loading: false, selectedCandidate: action.payload };
    // case GET_CANDIDATES_BY_ID_ERROR:
    //     return { ...state, loading: false };
    default:
      return { ...state };
  }
};

export default userReducer;
