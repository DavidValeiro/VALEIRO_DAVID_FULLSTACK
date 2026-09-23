'use client';

export default function NameForm() {
    async function namePost(name) {
        const res = await fetch('/api/names', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        const result = await res.json();
        console.log(result);
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
    </div>
    );
}