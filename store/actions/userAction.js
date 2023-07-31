import API from "../../components/helper/API.jS";

import { SUCCESS_ADD_USER, ERROR_ADD_USER } from "../constant";
// import Notification from 'app/components/Notification';

export const sendOTP = (mobileNo, email, name) => async (dispatch) => {
  try {
    const data = await API.post("/User/Create", {
      mobileNo: parseInt(mobileNo),
      otp: parseInt(otp),
    });
    dispatch({
      type: SUCCESS_ADD_USER,
      payload: data,
    });
    //   Notification('success', data?.data?.message);
    //   localStorage.setItem('token', data?.data?.data?.token);
    //   localStorage.setItem('adminInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: ERROR_ADD_USER,
      payload:
        error.data && error.data.data.message
          ? error.data.data.message
          : error.message,
    });
  }
};
