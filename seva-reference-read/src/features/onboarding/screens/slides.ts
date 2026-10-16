export interface Slide {
  id: string;
  title: string;
  description: string;
  image?: any;
}

const slides: Slide[] = [
  {
    id: "1",
    title: "Book Temple Sevas",
    description: "Book poojas and temple services anytime.",
    image: require("../../../../assets/images/temple-kadri.webp"),
  },
  {
    id: "2",
    title: "Donate Securely",
    description: "Donate to your favourite temples securely.",
    image: require("../../../../assets/images/temple-kadri.webp"),
  },
  {
    id: "3",
    title: "Track Your Bookings",
    description: "Manage all your bookings in one place.",
    image: require("../../../../assets/images/temple-kadri.webp"),
  },
];

export default slides;
