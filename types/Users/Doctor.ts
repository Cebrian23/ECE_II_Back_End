import { OptionalId } from "npm:mongodb";

export type DoctorDB = OptionalId<{
    name: string,
    surname_1: string,
    surname_2?: string,
    specialty: string,
    sector: "Publico" | "Privado" | string,
    hospital?: string,
    ubication?: string,
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
    hospital?: string,
    ubication?: string,
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
    hospital?: string,
    ubication?: string,
    prefix?: string,
    phone?: string,
    url?: string,
}

export type Doctor_Short = {
    id: string,
    name: string,
    surname_1: string,
    surname_2?: string,
    specialty: string,
    sector: "Publico" | "Privado" | string,
}