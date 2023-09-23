interface Props {
  phone: number;
}

export const loader = (): Props => {
  const data = {
    phone: 81234567,
  };
  //
  // const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
  // const json = await response.json();
  // const results = json.results;
  // console.log(results);
  //
  return data;
};

export default function About({ phone }: Props) {
  return <div className="text">About page, phone number: {phone}</div>;
}
