import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartTotal } from "../features/cartSlice";
import { useNavigation } from "@react-navigation/native";
import CurrencyFormat from "react-currency-format";

export default function CartIcon() {
  let items = useSelector(selectCartItems);
  const navigation = useNavigation();
  const cartTotal = useSelector(selectCartTotal);
  if (items.length === 0) return null;

  return (
    <View className="absolute bottom-10 w-full z-50">
      <TouchableOpacity
        className="bg-[#00ccbb] mx-5 p-4 rounded-lg flex-row items-center space-x-1"
        onPress={() => navigation.navigate("Cart")}
      >
        <Text className="text-white font-extrabold text-lg bg-[#01a296] py-1 px-2">
          {items.length}
        </Text>
        <Text className="flex-1 text-white font-extrabold text-lg text-center">
          View Basket
        </Text>
        <Text className="text-lg text-white font-extrabold">
          <CurrencyFormat
            value={cartTotal}
            thousandSeparator={true}
            displayType={"text"}
            prefix={"₹"}
            renderText={(value) => <Text>{value}</Text>}
          />
        </Text>
      </TouchableOpacity>
    </View>
  );
}
