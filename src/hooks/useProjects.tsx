import { useCallback, useEffect, useMemo, useState } from "react";
import useUser from "./useUser";
import type { ProductApiResponse, ProductData } from "@/lib/types";

export const useUserProject = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<ProductData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    const fetchProjects = useCallback(async (signal: AbortSignal) => {
        if (!user?.uuid) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_ENDPOINT_URL}/api/products/${user.uuid}/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ProductApiResponse = await response.json();

            if (data.status && Array.isArray(data.data)) {
                setProjects(data.data);
            } else {
                setProjects([]);
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return;
            }
            setError(error instanceof Error ? error.message : 'Failed to fetch projects');
            setProjects([]);
        } finally {
            if (!signal.aborted) {
            setLoading(false);
            }
        }
    }, [user?.uuid]);

    useEffect(() => {
        if (!user?.uuid) return;

        const controller = new AbortController();
        fetchProjects(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchProjects, user?.uuid]);

    return useMemo(
        () => ({
            loading,
            projects,
            error,
        }),
    [loading, projects, error]
    );
}

export const useProject = (productName: string) => {
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<ProductData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const getSingleProject = useCallback(async (signal: AbortSignal) => {
        if (!productName) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_ENDPOINT_URL}/api/products/${productName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: ProductApiResponse = await response.json();

            if (data.status) {
                setProject(data.data);
            } else {
                setProject(null);
            }
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return;
            }
            setError(error instanceof Error ? error.message : 'Failed to fetch projects');
            setProject(null);
        } finally {
            if (!signal.aborted) {
            setLoading(false);
            }
        }
    }, [productName]);

    useEffect(() => {
        if (!productName) return;

        const controller = new AbortController();
        getSingleProject(controller.signal);

        return () => {
            controller.abort();
        };
    }, [getSingleProject, productName]);

    return useMemo(
        () => ({
            isFechingProject: loading,
            project,
            error,
        }),
        [loading, project, error]
    );
}