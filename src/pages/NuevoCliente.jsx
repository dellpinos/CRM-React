import { useNavigate, Form, useActionData, redirect } from "react-router-dom";
import Formulario from "../components/Formulario";
import Error from "../components/Error";
import { agregarCliente } from "../api/clientes";

export async function action({ request }) {

    const formData = await request.formData();
    const datos = Object.fromEntries(formData);
    const email = formData.get('email');

    // Validación
    const errores = [];
    const regexEmail = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

    if (!regexEmail.test(email)) {
        errores.push('El email no es válido');
    }

    if (Object.values(datos).includes('')) {
        errores.push('Todos los campos son obligatorios');
    }

    // Retornar errores
    if (Object.keys(errores).length) {
        return errores;
    } else {

        await agregarCliente(datos);
        return redirect('/');
    }
}

const NuevoCliente = () => {

    const errores = useActionData();
    const navigate = useNavigate();

    return (
        <>
            <h1 className="font-black text-4xl text-gray-800">Nuevo Cliente</h1>
            <p className="mt-3">Llena todos los campos para registrar un nuevo cliente.</p>

            <div className="flex justify-end mb-10">
                <button className="bg-gray-800 text-white px-4 py-2 font-bold uppercase rounded-md hover:bg-gray-700"
                    onClick={() => navigate(-1)}
                >
                    Volver
                </button>

            </div>
            <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10">

                {errores?.length && errores.map((error, i) => <Error key={i}>{error}</Error>)}

                <Form
                    method="POST"
                >

                    <Formulario />

                    <input
                        type="submit"
                        className="mt-5 w-full bg-gray-800 p-3 uppercase font-bold text-white text-lg hover:cursor-pointer hover:bg-gray-700"
                        value="Registrar Cliente"

                    />

                </Form>

            </div>
        </>
    )
}

export default NuevoCliente