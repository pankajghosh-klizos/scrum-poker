import { Toaster } from "react-hot-toast";
import { Header, Footer } from "../../components";
import { Outlet } from "react-router";

const Root = () => {
  return (
    <div className="min-vh-100 w-100 d-flex flex-column align-items-center justify-content-center">
      <Toaster />
      <Header />
      <main className="flex-grow-1 w-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Root;
