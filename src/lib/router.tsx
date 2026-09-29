import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  isActive: (targetPath: string) => boolean;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  isActive: () => false,
});

export function useRouter(): RouterContextType {
  return useContext(RouterContext);
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      return p === '' ? '/' : p;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean }) => {
    if (typeof window === 'undefined') return;

    if (to.startsWith('http://') || to.startsWith('https://') || to.startsWith('tel:') || to.startsWith('mailto:')) {
      window.location.href = to;
      return;
    }

    if (options?.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }

    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (targetPath: string): boolean => {
    if (targetPath === '/' && currentPath === '/') return true;
    if (targetPath !== '/' && currentPath.startsWith(targetPath)) return true;
    return false;
  };

  const contextValue = useMemo(
    () => ({
      path: currentPath,
      navigate,
      isActive,
    }),
    [currentPath]
  );

  return <RouterContext.Provider value={contextValue}>{children}</RouterContext.Provider>;
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  to?: string;
  children: React.ReactNode;
  activeClassName?: string;
}

export const Link: React.FC<LinkProps> = ({
  href,
  to,
  children,
  className = '',
  activeClassName = '',
  onClick,
  ...rest
}) => {
  const targetUrl = to || href || '/';
  const { path, navigate } = useRouter();
  const isCurrent = targetUrl === '/' ? path === '/' : path.startsWith(targetUrl);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && !targetUrl.startsWith('http')) {
      e.preventDefault();
      navigate(targetUrl);
    }
  };

  const combinedClass = `${className} ${isCurrent ? activeClassName : ''}`.trim();

  return (
    <a href={targetUrl} onClick={handleClick} className={combinedClass} aria-current={isCurrent ? 'page' : undefined} {...rest}>
      {children}
    </a>
  );
};
