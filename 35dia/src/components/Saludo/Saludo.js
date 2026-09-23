import { getApiBase } from '@/lib/url';

export default async function Saludo() {
  const res = await fetch(`${await getApiBase()}/saludo`);
  const saludo = await res.json();
  return (
    <div>
      <h1>{saludo}</h1>
    </div>
  );
}