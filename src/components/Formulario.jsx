import React from "react";
import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Alerta from "./Alerta";
import Spinner from "./Spinner";

const Formulario = ({ cliente, cargando }) => {
  const navigate = useNavigate();

  //Yup para validación de datos
  const nuevoClienteSchema = Yup.object().shape({
    nombre: Yup.string()
      .min(3, "El nombre es muy corto")
      .max(20, "El nombre es muy largo")
      .required("El Nombre del Cliente es Obligatorio"), //Mapear atributos de Formik para validarlos
    empresa: Yup.string().required("El nombre de la empresa es obligatorio"),
    telefono: Yup.number()
      .positive("número no válido")
      .integer("número no válido")
      .typeError("El número no es válido"),
    email: Yup.string()
      .email("Email no válido")
      .required("El email es obligatorio"),
  });

  const handleSubmit = async (valores) => {
    try {
      let respuesta;
      if (cliente.id) {
        //Editando un registro
        const url = `http://localhost:4000/clientes/${cliente.id}`;
        respuesta = await fetch(url, {
          method: "PUT",
          body: JSON.stringify(valores),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } else {
        //Nuevo Registro
        const url = "http://localhost:4000/clientes";
        respuesta = await fetch(url, {
          method: "POST",
          body: JSON.stringify(valores),
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      await respuesta.json();
      navigate("/clientes");
      //console.log(resultado);
    } catch (error) {
      console.log(error);
    }
  };

  return cargando ? (
    <Spinner />
  ) : (
    <div className="bg-white mt-10 px-5 py-10 rounded-md shadow-md md:w-3/4 mx-auto">
      <h1 className="text-gray-600 font-bold text-xl uppercase text-center">
        {cliente?.nombre ? "Editar Cliente" : "Agregar Cliente"}
      </h1>
      <Formik
        initialValues={{
          nombre: cliente?.nombre ?? "", //parámetro que recibe el Field en name
          empresa: cliente?.empresa ?? "",
          telefono: cliente?.telefono ?? "",
          email: cliente?.email ?? "",
          notas: cliente?.notas ?? "",
        }}
        enableReinitialize={true} //permite pasar los props por default
        onSubmit={async (values, { resetForm }) => {
          await handleSubmit(values);
          resetForm();
        }}
        //Decirle a Yup donde buscar los parámetros de validación
        validationSchema={nuevoClienteSchema}
      >
        {({ errors, touched }) => {
          //error -> envía mensaje de error desde Yup al atributo
          //touched -> detecta si nos salimos del Field(input) sin cumplir las condiciones y arroja el error en realTime
          return (
            <Form>
              <div className="mt-10 mb-4">
                <label className="text-gray-800" htmlFor="nombre">
                  Nombre:
                </label>
                <Field
                  id="nombre"
                  name="nombre" //propiedad del formik
                  type="text"
                  placeholder="Nombre del Cliente"
                  className="mt-2 block w-full p-3 bg-gray-50"
                />
              </div>
              {errors.nombre && touched.nombre ? (
                <Alerta>{errors.nombre}</Alerta>
              ) : null}
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="empresa">
                  Empresa:
                </label>
                <Field
                  id="empresa"
                  name="empresa"
                  type="text"
                  placeholder="Empresa del Cliente"
                  className="mt-2 block w-full p-3 bg-gray-50"
                />
              </div>
              {errors.empresa && touched.empresa ? (
                <Alerta>{errors.empresa}</Alerta>
              ) : null}
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="email">
                  Email:
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email del cliente"
                  className="mt-2 block w-full p-3 bg-gray-50"
                />
              </div>
              {errors.email && touched.email ? (
                <Alerta>{errors.email}</Alerta>
              ) : null}
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="telefono">
                  Teléfono:
                </label>
                <Field
                  id="telefono"
                  name="telefono"
                  type="tel"
                  placeholder="Ej. 123456789"
                  className="mt-2 block w-full p-3 bg-gray-50"
                />
              </div>
              {errors.telefono && touched.telefono ? (
                <Alerta>{errors.telefono}</Alerta>
              ) : null}
              <div className="mb-4">
                <label className="text-gray-800" htmlFor="notas">
                  Notas:
                </label>
                <Field
                  as="textarea"
                  id="notas"
                  name="notas"
                  type="text"
                  placeholder="Notas del Cliente"
                  className="mt-2 block w-full p-3 bg-gray-50 h-40"
                />
              </div>
              <input
                type="submit"
                value={cliente?.nombre ? "Editar Cliente" : "Agregar Cliente"}
                className="mt-5 w-full bg-blue-800 p-3 text-white uppercase font-bold text-lg rounded-md"
              />
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
//Pasarle los defalutProps de enableInitalize al formulario
Formulario.defaultProps = {
  cliente: {},
  cargando: false,
};
export default Formulario;
