import { Link } from 'react-router-dom';
import { useRouteError } from 'react-router-dom';
import { ROUTES } from '../../utils/route-constants';

const ErrorPage = () => {
  const error = useRouteError();
  const message = (error as { message?: string })?.message || 'Something went wrong.';

  if (message.includes('Failed to fetch dynamically imported module: ')) {
    if (!sessionStorage.getItem('hasReloaded')) {
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-destructive">Error</h1>
        <p className="mt-4 text-text">An unexpected error has occurred. Please try again later.</p>
        {process.env.NODE_ENV === 'development' && (
          <p className="mt-2 text-muted-foreground italic">{message}</p>
        )}
        <Link to={ROUTES.partnerProgram}>
          <button className="mt-6 text-white bg-prm-red rounded-lg py-3 px-6">
            Go Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
