import Saludo from "../components/Saludo/Saludo";
import NameForm from "../components/NameForm/NameForm";
import { getApiBase } from "@/lib/url";

async function apiNumber() {
  const num = await fetch(`${await getApiBase()}/number`);
  const data = await num.json();
  return data.number;
}

export default async function Home() {
  const number = await apiNumber();

  return (
    <>
      <Saludo />
      <h1>Numero aleatorio: {number}</h1>
      <NameForm />
    </>
  );
}