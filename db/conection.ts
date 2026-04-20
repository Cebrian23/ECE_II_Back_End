import { MongoClient } from "mongodb";
import { UserDB } from "../types/Users/User.ts";
import { MedicationDB } from "../types/Users/Medication.ts";
import { DoctorDB } from "../types/Users/Doctor.ts";
import { AppointmentDB } from "../types/Users/Appointment.ts";
import { BloodTestDB } from "../types/Users/BloodTest.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if(!MONGO_URL){
    throw new Error("No se ha encontrado la clave MONGO URL");
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.log("Cliente conectado");

const db = client.db("Gestor_Sanitario");

export const UsersCollection = db.collection<UserDB>("Users");
export const MedicationsCollection = db.collection<MedicationDB>("Medication");
export const DoctorsCollection = db.collection<DoctorDB>("Doctors");
export const AppointmentsCollection = db.collection<AppointmentDB>("Appointments");
export const BloodTestsCollection = db.collection<BloodTestDB>("BloodTests");