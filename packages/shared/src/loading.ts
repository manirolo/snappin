

export type LoadingData = {
    title?: string;
    description?: string;
    logo?: string;
}

export type FullScreenLoadingStore = {
    loading: boolean;
    data: LoadingData | null;
    show: (data?: LoadingData) => void;
    clear: () => void;
};