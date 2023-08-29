import axios from "axios";

import { SUCCESS_LOAN_TYPE, ERROR_LOAN_TYPE } from "../constant";
// import Notification from 'app/components/Notification';

export const getALLLoanType = () => async (dispatch) => {
  try {
    const data = await axios.get(
      "https://loan-bazar-dev.azurewebsites.net/api/LoanType/GetAll"
    );

    dispatch({
      type: SUCCESS_LOAN_TYPE,
      payload: data,
    });
    //   Notification('success', data?.data?.message);
    //   localStorage.setItem('token', data?.data?.data?.token);
    //   localStorage.setItem('adminInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: ERROR_LOAN_TYPE,
      payload:
        error.data && error.data.data.message
          ? error.data.data.message
          : error.message,
    });
  }
};
