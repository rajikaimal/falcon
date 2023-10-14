interface Props {
  phone: number;
  styles: any;
}

export const loader = (): Omit<Props, "styles"> => {
  const data = {
    phone: 81234567,
  };

  return data;
};

export const styles = {
  text: {
    backgroundColor: "red",
    fontSize: "20px",
  },
};

export default function About({ phone, styles }: Props) {
  return <div style={styles.text}>Phone number: {phone}</div>;
}
