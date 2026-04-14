import SpinnerLoader from "./SpinnerLoader"


const PageLoader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center">
            <SpinnerLoader />
        </div>
    </div>
  )
}

export default PageLoader