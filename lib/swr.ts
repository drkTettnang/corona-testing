import { Booking, Location, Slot } from "@prisma/client";
import Axios from "axios";
import useSWR from "swr";

const fetcher = url => Axios.get(url).then(res => res.data)

export type SlotInfo = { seats: number, date: Date, occupied: number, requireCode: boolean, id: number };

export type Slots = {
    [dateKey: string]: SlotInfo
}

export function useSlots(locationId: number) {
    const { data, error } = useSWR<Slots>(`/api/location/${locationId}/slot`, fetcher, { refreshInterval: 30000 });

    return {
        dates: data,
        error,
        isLoading: !error && !data,
        isError: !!error,
    }
}

export function useLocations() {
    const { data, error } = useSWR<Location[]>('/api/location', fetcher);

    return {
        locations: data,
        error,
        isLoading: !error && !data,
        isError: !!error,
    }
}

export type Statistics = {
    results: {[dateKey: string]: {unknown?: number, invalid?: number, positiv?: number, negativ?: number}},
    bookings: {
        bookings: {count: number, createdAt: string}[],
        occupiedSlots: {count: number, date: string}[],
        availableSlots: {count: number, date: string}[],
        today: {date: string, createdAt: string}[],
    },
};

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
    const { data, error } = useSWR<(Booking & {slot: (Slot & {location: Location})})[]>(active ? '/api/bookings' : null, fetcher);

    return {
        data,
        error,
        isLoading: !error && !data,
        isError: !!error,
    }
}

export function useReservations(active = true): {
    data: { date: Date, slot: Slot, numberOfAdults: number, numberOfChildren: number, expiresOn: Date },
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