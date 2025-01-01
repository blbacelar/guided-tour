export interface POI {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  audioFile: number;
  description: string;
  category: "landmark" | "sports" | "attraction";
  rating: number;
  image: any;
  duration: string;
  price?: number;
}
