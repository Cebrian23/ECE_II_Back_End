import { OptionalId } from "mongodb";

export type DoctorDB = OptionalId<{
    name: string,
    surname_1: string,
    surname_2?: string,
    specialty: string,
    sector: "Publico" | "Privado" | string,
    prefix?: string,
    phone?: string,
    url?: string,
}>

export type Doctor_ins = {
    name: string,
    surname_1: string,
    surname_2?: string,
    specialty: string,
    sector: "Publico" | "Privado" | string,
    prefix?: string,
    phone?: string,
    url?: string,
}

export type Doctor = {
    id: string,
    name: string,
    surname_1: string,
    surname_2?: string,
    specialty: string,
    sector: "Publico" | "Privado" | string,
    prefix?: string,
    phone?: string,
    url?: string,
}