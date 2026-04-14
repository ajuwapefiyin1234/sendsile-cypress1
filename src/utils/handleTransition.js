export const handleTransition = async (
  e,
  route,
  navigate,
  transitionContainerSelector = '#transition-container'
) => {
  e?.preventDefault();
  if (!route || !navigate) return;
  const transitionContainer = document.querySelector(
    transitionContainerSelector
  );
  transitionContainer?.classList.add('page-transition');

  await new Promise((resolve) => setTimeout(resolve, 150)); // sleep function
  navigate(route);
  await new Promise((resolve) => setTimeout(resolve, 250)); // sleep function
  transitionContainer?.classList.remove('page-transition');
};
