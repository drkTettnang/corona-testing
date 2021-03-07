import { Booking } from "@prisma/client";
import Axios from "axios";
import useSWR from "swr";

const fetcher = url => Axios.get(url).then(res => res.data)

export type SlotInfo = { seats: number, occupied: number, requireCode: boolean, id: number };

export type Dates = {
    [dateKey: string]: SlotInfo
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

export type Statistics = {[dateKey: string]: {unknown?: number, invalid?: number, positiv?: number, negativ?: number}};

export function useStatistics() {
    const { data, error } = useSWR<Statistics>('/api/elw/statistics', fetcher, { refreshInterval: 60000 });

    return {
        statistics: data,
        error,
        isLoading: !error && !data,
        isError: !!error,
    }
}

export function useBookings(active = true) {
    const { data, error } = useSWR<Booking[]>(active ? '/api/bookings' : null, fetcher);

    return {
        data,
        error,
        isLoading: !error && !data,
        isError: !!error,
    }
}

export function useReservations(active = true): {
    data: { date: Date, numberOfAdults: number, numberOfChildren: number, expiresOn: Date },
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

export function useMac(id: number) {
    const { data, error } = useSWR<{mac: string}>(`/api/elw/mac/${id}`, fetcher, );

    return {
        mac: data?.mac,
        error,
        isLoading: !error && !data,
        isError: !!error,
    }
}