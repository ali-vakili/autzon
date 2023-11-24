
type galleryPropType = {
  gallery: {
    id: string;
    name: string;
    city_id: number;
    address: string;
    about: string | null;
    image: {
      id: string;
      url: string;
    } | null;
    categories: {
      id: number;
    }[];
    phone_numbers: {
      id: string;
      number: string
    }[];
  }
}


const Gallery = ({ gallery }: galleryPropType) => {
  return (
    <div>Gallery</div>
  )
}

export default Gallery