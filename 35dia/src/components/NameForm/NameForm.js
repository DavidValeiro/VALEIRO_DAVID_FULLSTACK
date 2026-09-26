'use client';

import { useState } from 'react';

export default function NameForm() {
    const [message, setMessage] = useState('');

    async function namePost(name) {
        const res = await fetch('/api/names', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        const result = await res.json();
        if (res.ok && result.recibido) {
            setMessage('Nombre enviado correctamente');
        } else {
            setMessage('Error al enviar el nombre');
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get('name');
        namePost(name);
    }


    return (
    <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
            <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
    </div>
    );
}