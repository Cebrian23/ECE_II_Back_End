import { ObjectId, OptionalId } from "npm:mongodb";
import { User_Short } from "./User.ts";

export type ReportDB = OptionalId<{
    patient: ObjectId,
    report_type: "Consulta" | "Analítica",
    health_service_type: "Pública" | "Privada",
    health_center: string,
    specialty: string,
    date: Date,
}>

export type Report = {
    id: string,
    patient: User_Short,
    report_type: "Consulta" | "Analítica",
    health_service_type: "Pública" | "Privada",
    health_center: string,
    specialty: string,
    date: Date,
}

export type Report_Short = {
    id: string,
    report_type: "Consulta" | "Analítica",
    health_service_type: "Pública" | "Privada",
    health_center: string,
    specialty: string,
    date: Date,
}