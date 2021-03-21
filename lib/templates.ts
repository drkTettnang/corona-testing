import { Booking, Slot, Location } from "@prisma/client";

export type WelcomeTextTemplate = () => JSX.Element;

export type VerificationRequestTemplate = (data: { url: string, email: string, site: string }) => JSX.Element;

export type ResultTemplate = (data: { name: string, booking: Booking, certificateUrl: string }) => JSX.Element;

export type ConfirmationTemplate = (data: { slot: Slot & { location: Location }, bookings: Booking[] }) => JSX.Element;

export type CancelTemplate = (data: { booking: Booking }) => JSX.Element;