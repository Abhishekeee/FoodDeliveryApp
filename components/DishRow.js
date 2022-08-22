import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import CurrencyFormat from "react-currency-format";
import { urlFor } from "../sanity";
import { MinusCircleIcon, PlusCircleIcon } from "react-native-heroicons/solid";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  selectCartItemsWithId,
  removeFromCart,
} from "../features/cartSlice";

export default function DishRow({ id, name, description, price, image }) {
  const [isPressed, setIsPressed] = useState(false);

  //   Redux Implementation
  const items = useSelector((state) => selectCartItemsWithId(state, id));
  const dispatch = useDispatch();

  const addItemToCart = () => {
    dispatch(addToCart({ id, name, description, price, image }));
  };
  const removeItemFromCart = () => {
    if (!items.length > 0) return;
    dispatch(removeFromCart({ id }));
  };

  return (
    <>
      <TouchableOpacity
        className={`bg-white border p-4 border-gray-200 ${
          isPressed && "border-b-0"
        }`}
        onPress={() => setIsPressed(!isPressed)}
      >
        <View className="flex-row">
          <View className="flex-1 pr-2">
            <Text className="text-lg mb-1">{name}</Text>
            <Text className="text-gray-400">{description}</Text>
            <Text className="text-gray-400 mt-2">
              <CurrencyFormat
                value={price}
                thousandSeparator={true}
                displayType={"text"}
                prefix={"₹"}
                renderText={(value) => <Text>{value}</Text>}
              />
            </Text>
          </View>

          <View>
            <Image
              style={{
                borderWidth: 1,
                borderColor: "#F3F3F4",
              }}
              source={{ uri: urlFor(image).url() }}
              className="h-20 w-20 bg-gray-300 p-4"
            />
          </View>
        </View>
      </TouchableOpacity>

      {isPressed && (
        <View className="bg-white px-4">
          <View className="flex-row items-center space-x-2 pb-3">
            <TouchableOpacity
              onPress={removeItemFromCart}
              disabled={!items.length}
            >
              <MinusCircleIcon
                size={40}
                color={items.length > 0 ? "#00CCBB" : "gray"}
              />
            </TouchableOpacity>
            <Text>{items.length}</Text>
            <TouchableOpacity onPress={addItemToCart}>
              <PlusCircleIcon size={40} color="#00CCBB" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
