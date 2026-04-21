import { ObjectId } from "npm:mongodb";
import { DoctorsCollection, UsersCollection } from "../../db/conection.ts";
import { AppointmentDB } from "../../types/Users/Appointment.ts";
import { Short_User } from "./utils_Users.ts";
import { Transform_Doctor } from "./utils_Doctors.ts";

export const Transform_Appointment = async (appointment: AppointmentDB): Promise<Response> => {
    const doctorDB = await DoctorsCollection.findOne({_id: new ObjectId(appointment.doctor)});

    if(!doctorDB){
        return new Response(
            JSON.stringify({error: "Doctor no encontrado"}),
            {
                status: 404,
            }
        );
    }

    const userDB = await UsersCollection.findOne({_id: new ObjectId(appointment.user)});

    if(!userDB){
        return new Response(
            JSON.stringify({error: "Usuario no encontrado"}),
            {
                status: 404,
            }
        );
    }

    return new Response(
        JSON.stringify(
            {
                id: appointment._id!.toString(),
                doctor: Transform_Doctor(doctorDB),
                user: Short_User(userDB),
                date: appointment.date,
                hour: appointment.hour,
                specialty: appointment.specialty,
                sector: appointment.sector,
            }
        ),
        {
            status: 200,
        }
    );
}