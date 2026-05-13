import { Doctor, Doctor_Short, DoctorDB } from "../../types/Users/Doctor.ts";

export const Transform_Doctor = (doctor: DoctorDB): Doctor => {
    return(
        {
            id: doctor._id!.toString(),
            name: doctor.name,
            surname_1: doctor.surname_1,
            surname_2: doctor.surname_2,
            specialty: doctor.specialty,
            hospital: doctor.hospital,
            ubication: doctor.ubication,
            sector: doctor.sector,
            prefix: doctor.prefix,
            phone: doctor.phone,
            url: doctor.url,
        }
    )
}

export const Short_Doctor = (doctor: DoctorDB): Doctor_Short => {
    return(
        {
            id: doctor._id!.toString(),
            name: doctor.name,
            surname_1: doctor.surname_1,
            surname_2: doctor.surname_2,
            specialty: doctor.specialty,
            sector: doctor.sector,
        }
    );
}