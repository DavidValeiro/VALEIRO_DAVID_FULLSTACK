import {type JSX, type ChangeEvent, type FormEvent} from 'react'

interface FormProps {
    name: string
    onChange: (value: string) => void
}

function Form({name, onChange}: FormProps): JSX.Element {
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        onChange(e.target.value)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
    }

    return (
        <form className="w-fit" onSubmit={handleSubmit}>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre</label>
            <input id="name" type="text" value={name} onChange={handleChange} placeholder="Escribe tu nombre" className="rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
        </form>
    )
}

export default Form