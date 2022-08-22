import { View, Text, TouchableOpacity, Image } from "react-native";

export default function CategoryCard({ imgUrl, title }) {
  return (
    <TouchableOpacity className='mx-1'>
      <Image source={{ uri: imgUrl }} className="h-20 w-20 rounded" />
      <Text className="absolute bottom-1 left-1 text-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
}
