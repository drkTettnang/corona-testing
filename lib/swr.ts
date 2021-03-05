import Axios from "axios";
import useSWR from "swr";

const fetcher = url => Axios.get(url).then(res => res.data)

export type Dates = {
    [dateKey:string]: {seats: number, occupied: number}
}

export function useDates() {
    const { data, error } = useSWR<Dates>('/api/dates', fetcher, { refreshInterval: 30000 });

    return {
        dates: data,
        error,
        isLoading: !error && !data,
        isError: !!error,
    }
}

export function useBookings(active = true) {
    const { data, error } = useSWR(active ? '/api/bookings' : null, fetcher);

    return {
        data,
        error,
        isLoading: !error && !data,
        isError: !!error,
    }
}

export function useReservations(active = true): {
    data: {date: Date, numberOfAdults: number, numberOfChildren: number, expiresOn: Date},
    error: any,
    isLoading: boolean,
    isError: boolean,
} {
    const { data, error } = useSWR(active ? '/api/reservations' : null, fetcher);

    return {
        data,
        error,
        isLoading: !error && !data,
        isError: !!error,
    }
}