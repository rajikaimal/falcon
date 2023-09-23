export const loader = async () => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
  const json = await response.json();
  const results = json.results;
  return results;
};

export default function Pokemon(props) {
  return <div>Pokemons page {props}</div>;
}
