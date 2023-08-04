import { SUCCESS_LOAN_TYPE, ERROR_LOAN_TYPE } from "../constant";

export const initialState = {
  loanType: [],
  loading: false,
  error: "",
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const loanReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUCCESS_LOAN_TYPE:
      return { ...state, loading: false, loanType: action.payload };
    case ERROR_LOAN_TYPE:
      return { ...state, loading: false };
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

export default loanReducer;
