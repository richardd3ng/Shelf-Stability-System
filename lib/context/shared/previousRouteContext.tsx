import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { ReactNode } from "react";
import { useRouter } from "next/router";

export const PreviousRouteContext = createContext<string | null>(null);

export const usePreviousRoute = () => {
    return useContext(PreviousRouteContext);
};

export const PreviousRouteProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { asPath } = useRouter();
    const [previousPath, setPreviousPath] = useState<string | null>(null);
    const currentPathRef = useRef<string | null>(null);

    useEffect(() => {
        setPreviousPath(currentPathRef.current);
        currentPathRef.current = asPath;
    }, [asPath]);

    return (
        <PreviousRouteContext.Provider value={previousPath}>
            {children}
        </PreviousRouteContext.Provider>
    );
};
