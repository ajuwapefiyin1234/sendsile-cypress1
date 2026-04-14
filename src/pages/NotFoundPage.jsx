import { Link } from "react-router-dom";
import { TbSmartHome } from "react-icons/tb";
import { ROUTE } from "@/routes";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#FFFCF7] text-center p-4">
      <h1 className="text-4xl font-bold text-[#E42E2E] mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-[#00070C] mb-6">
        The page you are looking for does not exist.
      </p>
      <Button asChild>
        <Link
          to={ROUTE.dashboardHome}
          className="flex items-center px-6 py-3 bg-[#00070C] text-white rounded-md"
        >
          <TbSmartHome className="mr-2" />
          Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
