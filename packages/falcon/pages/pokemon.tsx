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

export const styles = {
  wrapper: {
    backgroundColor: "#000000",
    padding: 20,
  },
  text: {
    color: "#fff",
    fontFamily: "Helvetica",
    paddingBottom: 15,
  },
};

export default function Pokemon({ data, styles }: Props) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.text}> Pokemons list</div>
      <ul>
        {data.map((pokemon: any) => (
          <li key={pokemon.name} style={styles.text}>
            {pokemon.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
