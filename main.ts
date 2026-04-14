import { ObjectId } from "mongodb";
import { AppointmentsCollection, DoctorsCollection, UsersCollection } from "./db/conection.ts";
import { Validate_Email } from "./utilities/Validations/Validate_Email.ts";
import { Validate_Phone } from "./utilities/Validations/Validate_Phone.ts";
import { Transform_User } from "./utilities/Users/utils_Users.ts";
import { Transform_Doctor } from "./utilities/Users/utils_Doctors.ts";
import { Transform_Appointment } from "./utilities/Users/utils_Appointments.ts";

const handler = async (req: Request): Promise<Response> => {
	const method = req.method;
	const url = new URL(req.url);
	const pathname = url.pathname;
  	const searchParams = url.searchParams;

	const path = pathname.replace(/\/+$/, ""); // quita slash final

	const headers = new Headers();
	headers.set("Access-Control-Allow-Origin", "*");
	headers.set("Access-Control-Allow-Headers", "*");
	headers.set("Access-Control-Allow-Methods", "GET, PUT, POST, OPTIONS");
	//headers.set("Access-Control-Allow-Credentials", "true");

	console.log(method)

	if(method === "OPTIONS"){
		return new Response(null,{
    		status: 204,
    		headers: headers,
    	});
	}
	else if(method === "GET"){
    	if(path === "/login"){
			const email = searchParams.get("email");
			const password = searchParams.get("password");

			if(!email || !password){
                return new Response(
                    JSON.stringify({error: "Email o contraseña no encontrada"}),
                    {
                        status: 400,
						headers: headers,
                    }
                );
            }

			const email_validation = await Validate_Email(email);

            if(email_validation.status !== 200){
                return new Response(
                    JSON.stringify(await email_validation.json()),
                    {
                        status: email_validation.status,
                        headers: headers,
                    }
                );
            }

			const user = await UsersCollection.findOne({email: email});

			if(!user || user.password !== password){
				return new Response(
					JSON.stringify({error: "Email o contraseña no encontrada"}),
					{
						status: 404,
						headers: headers,
					}
				);
			}

			return new Response(
				JSON.stringify({id: user._id.toString()}),
				{
					status: 200,
					headers: headers,
				}
			);
		}
		else if(path === "/user/id"){
			const id = searchParams.get("id");

			if(!id){
                return new Response(
                    JSON.stringify({error: "ID no encontrada"}),
                    {
                        status: 400,
						headers: headers,
                    }
                );
            }

			const user = await UsersCollection.findOne({_id: new ObjectId(id)});

			if(!user){
				return new Response(
					JSON.stringify({error: `Persona con id ${id} no encontrada`}),
					{
						status: 404,
						headers: headers,
					}
				);
			}

			const response_user = await Transform_User(user);

			if(response_user.status !== 200){
				return new Response(
					JSON.stringify(await response_user.json()),
					{
						status: response_user.status,
						headers: headers,
					}
				);
			}

			return new Response(
				JSON.stringify(await response_user.json()),
				{
					status: 200,
					headers: headers,
				}
			);
		}
		else if(path === "/user/doctors"){
			const id = searchParams.get("id");

			if(!id){
				return new Response(
					JSON.stringify({error: "ID no encontrado"}),
					{
						status: 400,
						headers: headers,
					}
				);
			}

			const user_exists = await UsersCollection.findOne({_id: new ObjectId(id)});

			if(!user_exists){
				return new Response(
					JSON.stringify({error: "Persona no encontrada"}),
					{
						status: 404,
						headers: headers,
					}
				);
			}

			const doctorsDB = await DoctorsCollection.find({_id: {$in: user_exists.doctors}}).toArray();

			if(user_exists.doctors.length !== doctorsDB.length){
				return new Response(
					JSON.stringify({error: `${user_exists.doctors.length - doctorsDB.length} doctores no encontrados`}),
					{
						status: 404,
						headers: headers,
					}
				);
			}

			return new Response(
				JSON.stringify(doctorsDB.map((doctor) => Transform_Doctor(doctor))),
				{
					status: 200,
					headers: headers,
				}
			);
		}
		else if(path === "/user/appointments"){
			const id = searchParams.get("id");

			if(!id){
				return new Response(
					JSON.stringify({error: "ID no encontrado"}),
					{
						status: 400,
						headers: headers,
					}
				);
			}

			const user_exists = await UsersCollection.findOne({_id: new ObjectId(id)});

			if(!user_exists){
				return new Response(
					JSON.stringify({error: "Persona no encontrada"}),
					{
						status: 404,
						headers: headers,
					}
				);
			}

			const appointmentsDB = await AppointmentsCollection.find({user: new ObjectId(id)}).toArray();

			const appointments_trans = await Promise.all(appointmentsDB.map(async (appointment) => await Transform_Appointment(appointment)));

			const error_ap = appointments_trans.find((response) => {
				if(response.status !== 200){
					return response;
				}
			});

			if(error_ap !== undefined){
				return new Response(
					JSON.stringify({error: await error_ap.json()}),
					{
						status: error_ap.status,
						headers: headers,
					}
				);
			}
			
			const appointments = await Promise.all(appointments_trans.map(async(response) => await response.json()));

			return new Response(
				JSON.stringify(appointments),
				{
					status: 200,
					headers: headers,
				}
			);
		}
	}
	else if(method === "POST"){
		if(path === "/user"){
			const data = await req.json();
			const name: string | undefined = data.name;
			const surname_1: string | undefined = data.surname_1;
			const surname_2: string | undefined = data.surname_2;
			const email: string | undefined = data.email;
			const password: string | undefined = data.password;
			const prefix: string | undefined = data.prefix;
			const phone: string | undefined = data.phone;

			if(!name || !surname_1 || !email || !password){
				return new Response(
					JSON.stringify({error: "Faltan datos para insertar una persona"}),
					{
						status: 400,
						headers: headers,
					}
				);
			}

			let surname_aux: string | undefined = "";
			if(surname_2){
				surname_aux = surname_2;
			}
			else{
				surname_aux = undefined;
			}

			const users_email = await UsersCollection.findOne({email: email});

            if(users_email){
                return new Response(
                    JSON.stringify({error: `Persona con email ${email} ya existente`}),
                    {
                        status: 409,
						headers: headers,
                    }
                );
            }

			const email_validation = await Validate_Email(email);

            if(email_validation.status !== 200){
                return new Response(
                    JSON.stringify(await email_validation.json()),
                    {
                        status: email_validation.status,
						headers: headers,
                    }
                );
            }

            let phone_prefix: string | undefined = "";
            let phone_number: string| undefined = "";

            if(!prefix || !phone){
                phone_prefix = undefined;
                phone_number = undefined;
            }
			else{
                const validation = await Validate_Phone(prefix, phone);

                if(validation.status !== 200){
                    return new Response(
                        JSON.stringify(await validation.json()),
                        {
                            status: validation.status,
                            headers: headers,
                        }
                    );
                }
                else{
                    const phone_error = await UsersCollection.findOne({prefijo_movil: prefix, numero_movil: phone});

                    if(phone_error){
                        return new Response(
                            JSON.stringify({error: `Persona con teléfono ${prefix} ${phone} ya existe`}),
                            {
                                status: 409,
                                headers: headers,
                            }
                        );
                    }

                    phone_prefix = prefix.replaceAll(" ","+");
                    phone_number = phone;
                }
            }
            
			const { insertedId } = await UsersCollection.insertOne(
				{
					name: name,
					surname_1: surname_1,
					surname_2: surname_aux,
					email: email,
					password: password,
					doctors: [],
					phone_prefix: phone_prefix,
					phone_number: phone_number,
				}
			);

			return new Response(
				JSON.stringify(
					{
						message: "Usuario correctamente insertado",
					}
				),
				{
					status: 200,
					headers: headers,
				}
			);
		}
		else if(path === "/user/appointments"){
			const data = await req.json();
			const user: string | undefined = data.user;
			const doctor: string | undefined = data.doctor;
			const date: string | undefined = data.date;
			const hour: string | undefined = data.hour;
			const specialty: string | undefined = data.specialty;
			const sector: string | undefined = data.sector;

			if(!user || !doctor || !date || !hour || !specialty || !sector){
				return new Response(
					JSON.stringify({error: "Faltan datos de la cita"}),
					{
						status: 400,
						headers: headers,
					}
				);
			}

			const user_exists = await UsersCollection.findOne({_id: new ObjectId(user)});

			if(!user_exists){
				return new Response(
					JSON.stringify({error: "Usuario no encontrado"}),
					{
						status: 404,
						headers: headers,
					}
				);
			}

			const appointmentsDB = await AppointmentsCollection.find({user: new ObjectId(user)}).toArray();

			const appointment = appointmentsDB.find((ap) => {
				if(ap.date === date && ap.hour === hour){
					return ap;
				}
			});

			if(appointment !== undefined){
				return new Response(
					JSON.stringify({error: "Cita ya programada para esa fecha"}),
					{
						status: 406,
						headers: headers,
					}
				);
			}

			const doctor_exists = await DoctorsCollection.findOne({_id: new ObjectId(doctor)});

			if(!doctor_exists){
				return new Response(
					JSON.stringify({error: "Doctor no encontrado"}),
					{
						status: 404,
						headers: headers
					}
				);
			}

			const { insertedId } = await AppointmentsCollection.insertOne(
				{
					user: new ObjectId(user),
					doctor: new ObjectId(doctor),
					date: date,
					hour: hour,
					specialty: specialty,
					sector: sector,
				}
			);

			return new Response(
				JSON.stringify(
					{
						message: "Cita exitosamente insertada",
					}
				),
				{
					status: 200,
					headers: headers,
				}
			);
		}
		else if(path === "/user/doctor"){
			const data = await req.json();
			const id_user: string | undefined = data.id_user;
			const name: string | undefined = data.name;
			const surname_1: string | undefined = data.surname_1;
			const surname_2: string | undefined = data.surname_2;
			const specialty: string | undefined = data.specialty;
			const sector: string | undefined = data.sector;
			const prefix: string | undefined = data.prefix;
			const phone: string | undefined= data.phone;

			if(!name || !surname_1 || !specialty || !sector || !id_user){
				return new Response(
					JSON.stringify({error: "Faltan datos para insertar a un doctor"}),
					{
						status: 400,
						headers: headers,
					}
				);
			}
			
			let surname2: string | undefined = "";
			if(surname_2){
				surname2 = surname_2;
			}
			else{
				surname2 = undefined;
			}

			let prefijo: string | undefined = "";
			let numero: string | undefined = "";

			if(!prefix || !phone){
				prefijo = undefined;
				numero = undefined;
			}
			else{
                const validation = await Validate_Phone(prefix, phone);

                if(validation.status !== 200){
                    return new Response(
                        JSON.stringify(await validation.json()),
                        {
                            status: validation.status,
                            headers: headers,
                        }
                    );
                }
                else{
                    const phone_error = await UsersCollection.findOne({prefijo_movil: prefix, numero_movil: phone});

                    if(phone_error){
                        return new Response(
                            JSON.stringify({error: `Persona con teléfono ${prefix} ${phone} ya existe`}),
                            {
                                status: 409,
                                headers: headers,
                            }
                        );
                    }

                    prefijo = prefix.replaceAll(" ","+");
                    numero = phone;
                }
            }

			const { insertedId } = await DoctorsCollection.insertOne(
				{
					name: name,
					surname_1: surname_1,
					surname_2: surname2,
					specialty: specialty,
					sector: sector,
					prefix: prefijo,
					phone: numero,
				}
			);

			const user_exists = await UsersCollection.findOne({_id: new ObjectId(id_user)});

			if(!user_exists){
				return new Response(
					JSON.stringify({error: "Persona no encontrada"}),
					{
						status: 404,
						headers: headers,
					}
				);
			}

			const doctors = user_exists.doctors;

			doctors.push(insertedId);

			const { modifiedCount } = await UsersCollection.updateOne(
				{_id: new ObjectId(id_user)},
				{
					$set: {
						doctors: doctors,
					}
				}
			);

			if(modifiedCount === 0){
				return new Response(
					JSON.stringify({error: "Persona no actualizada"}),
					{
						status: 404,
						headers: headers,
					}
				);
			}

			return new Response(
				JSON.stringify(
					{
						message: "Doctor exitosamente insertado",
					}
				),
				{
					status: 200,
					headers: headers,
				}
			);
		}
	}
	else if(method === "PUT"){
		if(path === "/user"){
			const data = await req.json();
			const id: string | undefined = data.id;
			const name: string | undefined = data.name;
			const surname_1: string | undefined = data.surname_1;
			const surname_2: string | undefined = data.surname_2;
			const email: string | undefined = data.email;
			const password: string | undefined = data.password;
			const prefix: string | undefined = data.phone_prefix;
			const phone: string | undefined = data.phone_number;

			if(!id){
				return new Response(
					JSON.stringify({error: "ID no encontrado"}),
					{
						status: 400,
						headers: headers,
					}
				);
			}

			if(!name && !surname_1 && !surname_2 && !email && !prefix && !phone){
				return new Response(
					JSON.stringify({error: "Faltan datos para actualizar"}),
					{
						status: 400,
						headers: headers,
					}
				);
			}

			if(email){
                const data = await Validate_Email(email);

                if(data.status !== 200){
                    return new Response(
                        JSON.stringify(await data.json()),
                        {
                            status: data.status,
							headers: headers,
                        }
                    );
                }
				else{
					const email_error = await UsersCollection.findOne({email: email});

					if(email_error && email_error._id.toString() !== id){
						return new Response(
							JSON.stringify({error: `Email ${email} pertenece a otra persona`}),
							{
								status: 409,
								headers: headers,
							}
						);
					}
				}
            }
            
			if(prefix && phone){
                const data = await Validate_Phone(prefix, phone);

                if(data.status !== 200){
                    return new Response(
                        JSON.stringify(await data.json()),
                        {
                            status: data.status,
							headers: headers,
                        }
                    );
                }
				else{
					const phone_error = await UsersCollection.findOne({phone_prefix: prefix, phone_number: phone});

					if(phone_error && phone_error._id.toString() !== id){
						return new Response(
							JSON.stringify({error: `Teléfono ${prefix} ${phone} pertenece a otra persona`}),
							{
								status: 409,
								headers: headers,
							}
						);
					}
				}
            }

			if(password === undefined){
				const user = await UsersCollection.findOne({_id: new ObjectId(id)});

				if(!user){
					return new Response(
						JSON.stringify({error: "Usuario no encontrado"}),
						{
							status: 404,
							headers: headers,
						}
					);
				}

				const pass = user.password;

				const { modifiedCount } = await UsersCollection.updateOne(
					{_id: new ObjectId(id)},
					{$set:
						{
							name: name,
							surname_1: surname_1,
							surname_2: surname_2,
							email: email,
							password: pass,
							phone_prefix: prefix,
							phone_number: phone,
						}
					}
				);

				if(modifiedCount === 0){
					return new Response(
						JSON.stringify({error: `Los datos del usuario eran los mismos que se intentaban actualizar`}),
						{
							status: 404,
							headers: headers,
						}
					);
				}

				return new Response(
					JSON.stringify({message: "Usuario exitosamente modificado"}),
					{
						status: 200,
						headers: headers,
					}
				);
			}

			const { modifiedCount } = await UsersCollection.updateOne(
                {_id: new ObjectId(id)},
                {$set:
                    {
                        name: name,
                        surname_1: surname_1,
                        surname_2: surname_2,
                        email: email,
						password: password,
                        phone_prefix: prefix,
                        phone_number: phone,
                    }
                }
            );

            if(modifiedCount === 0){
                return new Response(
                    JSON.stringify({error: `Usuario no encontrado`}),
                    {
                        status: 404,
						headers: headers,
                    }
                );
            }

            return new Response(
                JSON.stringify({message: "Usuario exitosamente modificado"}),
                {
                    status: 200,
					headers: headers,
                }
            );
		}
	}

	return new Response(
		"Path not found",
		{
			status: 404,
			headers: headers,
		}
	);
};

Deno.serve({ port: 4000 }, handler);