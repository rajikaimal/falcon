type Props = {
  data: {
    results: any;
  };
  styles: any;
};

export const loader = async () => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
  const json = await response.json();
  const results = json.results;
  return { data: results };
};

export default function Pokemon({ data }: Props) {
  return (
    <div>
      Pokemons
      <ul>
        {data.map((pokemon: any) => (
          <li key={pokemon.name}> {pokemon.name} </li>
        ))}
      </ul>
    </div>
  );
}
