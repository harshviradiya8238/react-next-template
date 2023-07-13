import ShortNavbar from "../components/common/ShortNavbar";
import ForgetPasswordForm from "../components/forgetPassword/ForgetPasswordForm";

export default function ForgetPassword() {
  return (
    <>
      <ShortNavbar />
      <ForgetPasswordForm />
    </>
  );
}

ForgetPassword.getLayout = function getLayout(page) {
  return <>{page}</>;
};
