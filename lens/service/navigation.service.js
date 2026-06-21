let router = null;

/**
 * Called once from NavigationSetter component to store the Next.js router instance.
 * The router comes from `useRouter()` in `next/navigation`.
 */
export const setRouter = (routerInstance) => {
  router = routerInstance;
};

/**
 * Programmatic navigation — can be used anywhere (axios interceptors, redux, utils).
 * Mirrors Next.js router.push behavior.
 */
export const navigate = (path, options = {}) => {
  if (!router) {
    console.warn("Router not initialized yet");
    return;
  }

  if (options.replace) {
    router.replace(path);
  } else {
    router.push(path);
  }
};

/**
 * Navigate back in browser history.
 */
export const navigateBack = () => {
  if (!router) {
    console.warn("Router not initialized yet");
    return;
  }

  router.back();
};

/**
 * Replace current history entry without adding a new one.
 */
export const navigateReplace = (path) => {
  if (!router) {
    console.warn("Router not initialized yet");
    return;
  }

  router.replace(path);
};

/**
 * Refresh the current route (re-fetches server components).
 */
export const navigateRefresh = () => {
  if (!router) {
    console.warn("Router not initialized yet");
    return;
  }

  router.refresh();
};

// Keep backward compatibility — setNavigator still works
export const setNavigator = setRouter;
