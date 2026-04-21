import { ObjectId, OptionalId } from "npm:mongodb";
import { Doctor } from "./Doctor.ts";
import { User_Short } from "./User.ts";

export type AppointmentDB = OptionalId<{
    date: string,
    hour: string,
    doctor: ObjectId,
    user: ObjectId,
    specialty: string,
    sector: "Publico" | "Privado" | string,
}>

export type Appointment = {
    id: string,
    date: string,
    hour: string,
    doctor: Doctor,
    user: User_Short,
    specialty: string,
    sector: "Publico" | "Privado" | string,
}