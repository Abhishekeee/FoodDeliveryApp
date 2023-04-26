import { TouchableOpacity, Image, View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectuser } from "../features/userSlice";
import { ChevronDownIcon } from "react-native-heroicons/solid";
import { selectCartItems } from "../features/cartSlice";

export default function ProfileMenu(props) {
  const navigation = useNavigation();
  const user = useSelector(selectuser);
  const items = useSelector(selectCartItems);

  const { state } = props;
  const { routes, index } = state;
  return (
    <View className="my-7">
      <TouchableOpacity className="mx-6">
        <Image
          source={{ uri: "https://links.papareact.com/wru" }}
          className="h-20 w-20 bg-gray-300 p-4 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-bold text-gray-400 text-xs">Deliver Now!</Text>
          <Text className="font-bold text-base text-black">
            {user}
            <ChevronDownIcon size={20} color="#00CCBB" />
          </Text>
        </View>
      </TouchableOpacity>
      <View className="my-8">
        <TouchableOpacity
          className={`p-5 ${
            routes[index].name === "Home" ? "bg-blue-300" : "bg-slate-50"
          }`}
          onPress={() => navigation.navigate("Home")}
        >
          <Text className="text-base font-bold">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`p-5 ${
            routes[index].name === "Cart" ? "bg-blue-300" : "bg-slate-50"
          }`}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text className="text-base font-bold">Cart</Text>
        </TouchableOpacity>
        {items.length > 0 ? (
          <TouchableOpacity
            className={`p-5 ${
              routes[index].name === "Delivery" ? "bg-blue-300" : "bg-slate-50"
            }`}
            onPress={() => navigation.navigate("Delivery")}
          >
            <Text className="text-base font-bold">Track Order</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
