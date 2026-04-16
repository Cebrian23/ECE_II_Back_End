import { DoctorsCollection, MedicationsCollection } from "../../db/conection.ts";
import { User_Short, UserDB } from "../../types/Users/User.ts";
import { Short_Medication } from "./utils_Medications.ts";
import { Transform_Doctor } from "./utils_Doctors.ts";

export const Transform_User = async (user: UserDB): Promise<Response> => {
    const medications = await MedicationsCollection.find({patient: user._id}).toArray();
    const doctors = await DoctorsCollection.find({_id: {$in: user.doctors}}).toArray();

    if(user.doctors.length !== doctors.length){
        return new Response(
            JSON.stringify({error: `${user.doctors.length - doctors.length} doctores no encontrados`}),
            {
                status: 404,
            }
        );
    }

    return new Response(
        JSON.stringify(
            {
                id: user._id!.toString(),
                name: user.name,
                surname_1: user.surname_1,
                surname_2: user.surname_2,
                DNI: user.DNI,
                email: user.email,
                password: user.password,
                phone_prefix: user.phone_prefix,
                phone_number: user.phone_number,
                medications: medications.map((medication) => Short_Medication(medication)),
                doctors: doctors.map((doctor) => Transform_Doctor(doctor)),
            }
        ),
        {
            status: 200,
        }
    )
}

export const Short_User = (user: UserDB): User_Short => {
    return {
        id: user._id!.toString(),
        name: user.name,
        surname_1: user.surname_1,
        surname_2: user.surname_2,
        DNI: user.DNI,
        email: user.email,
    }
}
