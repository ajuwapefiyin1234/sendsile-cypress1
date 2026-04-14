import { Link, useNavigate } from "react-router-dom";
import { TbSmartHome, TbArrowBack } from "react-icons/tb";
import { useRouteError } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTE } from "@/routes";

const ErrorPage = () => {
  const error = useRouteError();
  const message = error?.message || "Something went wrong.";
  const navigate = useNavigate();

  // Check if we should reload the page
  if (message.includes("Failed to fetch dynamically imported module: ")) {
    // Check if reload flag is already set
    if (!sessionStorage.getItem("hasReloaded")) {
      // Set the reload flag and reload the page
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FFFCF7] text-center p-4">
      <h1 className="text-4xl font-bold text-[#E42E2E] mb-4">
        500 - Internal Server Error
      </h1>
      <p className="text-lg text-[#00070C] mb-6">{message}</p>
      <div className="flex space-x-4">
        <Button asChild>
          <Link
            to={ROUTE.dashboardHome}
            className="flex items-center px-6 py-3 bg-[#00070C] text-white rounded-md"
          >
            <TbSmartHome className="mr-2" />
            Home
          </Link>
        </Button>
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center px-6 py-3 bg-[#00070C] text-white rounded-md"
        >
          <TbArrowBack className="mr-2" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
