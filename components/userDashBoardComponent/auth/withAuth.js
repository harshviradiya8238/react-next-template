import { useRouter } from "next/router";

const withAuth = (WrappedComponent) => {
  const Auth = (props) => {
    const router = useRouter();

    // Check if user is authenticated
    // const isAuthenticated = // your authentication check logic

    const isAuthenticated = true;
    // Redirect unauthenticated users to login page
    if (!isAuthenticated) {
      router.push("/");
      return null;
    }

    // Render the wrapped component for authenticated users
    return <WrappedComponent {...props} />;
  };

  return Auth;
};

export default withAuth;
