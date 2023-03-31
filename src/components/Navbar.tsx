import React, {useState, useEffect} from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { useGlobalState } from "../context";
import Modal from "./Modal";
import { formattedDate } from "../helpers/formattedDate";
const Navbar = () => {
    const [loading, setLoading] = useState(false)
    const { logged, user } = useGlobalState()
    const [mark, setMark] = useState(false)
    const [watchTip, setWatchTip] = useState(false)
    const [shift, setShift] = useState("1")
    const [tips, setTips] = useState(0)
    const onClose = () => {
        setMark(false)
    }
    const onCloseTip = () => {
        setWatchTip(false)
    }
    const onOpen = () => {
        setMark(true)
    }
    const onOpenTip = () => {
        setWatchTip(true)
        setLoading(true)
        fetch(`${process.env.API}/api/user/tips/${user.cc}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        }).then(res => {
            if(!res.ok){
                setLoading(false)
                return
            }
            return res.json()
        }).then(res => {
            setLoading(false)
            setTips(res.totalTips)
        })
    }
    const markAssist = () => {
        const formatDate = formattedDate()
        let isDay: boolean = false
        if(shift === "1"){
            return alert("Por favor selecciona el turno.")
        }
        if(shift === "2"){
            isDay = true
        }
        setLoading(true)
        fetch(`${process.env.API}/api/user/assist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ date: formatDate, cc: user.cc, isDay })
        }).then(async(res) => {
            setLoading(false)
            if(!res.ok){
                const respuesta = await res.json()
                console.log(respuesta)
                return alert(`error: probablemente elegiste turno incorrecto. Intentalo de nuevo.`)
            }
            alert("Listo.")
            onClose()
        })
    }
    return (<div>
        {
            logged ? (
                <Disclosure as="nav" className="bg-gray-800 sticky top-0">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            <div className="flex items-center justify-start sm:items-stretch sm:justify-start">
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={onOpenTip}
                                        type="button"
                                        className="inline-block rounded bg-white px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-800 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                        Ver propinas
                                    </button>
                                </div>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <div className="flex justify-center space-x-2">
                                    <button
                                        onClick={onOpen}
                                        type="button"
                                        className="inline-block rounded bg-white px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-gray-800 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                                        Marcar asistencia
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Modal isOpen={mark} onClose={onClose}>
                        <div>
                            <div className="mb-3 xl:w-96">
                                <select onChange={(e) => setShift(e.target.value)} data-te-select-init className="bg-gray-800 text-white">
                                    <option value="1">Turno</option>
                                    <option value="2">Día</option>
                                    <option value="3">Noche</option>
                                </select>
                            </div>
                            <div className="mb-3 xl:w-96">
                                <div className="flex justify-center space-x-2">
                                    {
                                        !loading ? (
                                            <button
                                                onClick={markAssist}
                                                type="button"
                                                className="inline-block rounded bg-gray-800 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                                            >
                                                Marcar
                                            </button>
                                        ) : "Cargando..."
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <Modal isOpen={watchTip} onClose={onCloseTip}>
                        <div className="flex justify-center">
                            <div
                                className="block max-w-sm"
                            >
                                <h5
                                    className="mb-2 text-xl font-medium leading-tight text-gray-800">
                                    {user.name}
                                </h5>
                                <p className="mb-4 text-base text-gray-800">
                                    ${!loading ? tips : "Cargando..."}
                                </p>
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </Disclosure>
            ) : null
        }
    </div>)
}

export default Navbar