interface Props {
  phone: number;
}

export const loader = (): Props => {
  const data = {
    phone: 81234567,
  };

  return data;
};

export default function About({ phone }: Props) {
  return <div className="text">About page, phone number: {phone}</div>;
}
