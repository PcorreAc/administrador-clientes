import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Spinner from "../components/Spinner";

const VerCliente = () => {
  const { id } = useParams();

  const [cliente, setCliente] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(!cargando);
    const obtenerClienteAPI = async () => {
      try {
        const url = `http://localhost:4000/clientes/${id}`;
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        setCliente(resultado);
      } catch (error) {
        console.log(error);
      }
      setTimeout(() => {
        setCargando(false);
      }, 500);
    };
    obtenerClienteAPI();
  }, []);

  const { nombre, empresa, telefono, email, notas } = cliente;

  return cargando ? (
    <Spinner />
  ) : Object.keys(cliente).length === 0 ? (
    <p>No hay Resultados</p>
  ) : (
    <div>
      <h1 className="font-black text-4xl text-blue-900">
        Ver Clientes: {nombre}
      </h1>
      <p className="mt-3">Información del Cliente</p>
      <p className="text-gray-600 text-3xl">
        <span className="text-gray-800 uppercase font-bold">Cliente: </span>
        {nombre}
      </p>
      <p className="text-gray-600 text-2xl mt-4">
        <span className="text-gray-800 uppercase font-bold">Email: </span>
        {email}
      </p>
      <p className="text-gray-600 text-2xl mt-4">
        <span className="text-gray-800 uppercase font-bold">Teléfono: </span>
        {telefono ? telefono : "No se ha regitrado un teléfono"}
      </p>
      <p className="text-gray-600 text-2xl mt-4">
        <span className="text-gray-800 uppercase font-bold">Empresa: </span>
        {empresa}
      </p>
      <p className="text-gray-600 text-2xl mt-4">
        <span className="text-gray-800 uppercase font-bold">Notas: </span>
        {notas ? notas : "No se han ingresado notas"}
      </p>
    </div>
  );
};

export default VerCliente;
