import { Form, useNavigate, useLoaderData, useActionData, redirect } from "react-router-dom";
import Formulario from "../components/Formulario";
import Error from "../components/Error";
import { obtenerCliente, actualizarCliente } from "../api/clientes";

export async function loader({ params }) {
    const cliente = await obtenerCliente(params.clienteId);
    if (Object.values(cliente).length === 0) {
        throw new Response('', {
            status: 404,
            statusText: "No hay resultados"
        });
    }
    return cliente;
}

export async function action({request, params}) {

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

        await actualizarCliente(params.clienteId, datos);
        return redirect('/');
    }

}

function EditarCliente() {

    const navigate = useNavigate();
    const cliente = useLoaderData();
    const errores = useActionData();

    return (
        <>
            <h1 className="font-black text-4xl text-gray-800">Editar Cliente</h1>
            <p className="mt-3">Aquí puedes modificar los datos de un cliente.</p>

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
                    noValidate

                >

                    <Formulario 
                        cliente={cliente}
                    />

                    <input
                        type="submit"
                        className="mt-5 w-full bg-gray-800 p-3 uppercase font-bold text-white text-lg hover:cursor-pointer hover:bg-gray-700"
                        value="Guardar Cambios"

                    />

                </Form>

            </div>
        </>
    )
}

export default EditarCliente