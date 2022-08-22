import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { selectRestaurant } from "../features/restaurantSlice";
import {
  removeFromCart,
  selectCartItems,
  selectCartTotal,
} from "../features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { XCircleIcon } from "react-native-heroicons/solid";
import { urlFor } from "../sanity";
import CurrencyFormat from "react-currency-format";

export default function Cartscreen() {
  const navigation = useNavigation();
  const restaurant = useSelector(selectRestaurant);
  const items = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [groupedItemsInCart, setGroupedItemsInCart] = useState([]);
  const dispatch = useDispatch();

  useMemo(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});

    setGroupedItemsInCart(groupedItems);
  }, [items]);

  return (
    <>
      <StatusBar hidden />
      <View className="flex-1 bg-white">
        <View className="flex-1 bg-slate-900">
          <View className="p-5 border-b border-[#00ccBB] bg-slate-900 shadow-xs">
            <View>
              <Text className="text-lg font-bold text-center text-white">
                Basket
              </Text>
              <Text className="text-gray-400 text-center">
                {restaurant.title}
              </Text>
            </View>

            <TouchableOpacity
              onPress={navigation.goBack}
              className="rounded-full bg-slate-900 absolute top-3 right-5"
            >
              <XCircleIcon color="#00cc86" height={50} width={50} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center space-x-4 px-4 py-3 bg-slate-700 my-5">
            <Image
              source={{ uri: "https://links.papareact.com/wru" }}
              className="h-7 w-7 bg-gray-300 p-4 rounded-full"
            />
            <Text className="flex-1 text-white">Deliver in 50-75 min</Text>
            <TouchableOpacity>
              <Text className="text-[#00ccBB]">Change</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="divide-y divide-gray-200">
            {Object.entries(groupedItemsInCart).map(([key, items]) => (
              <View
                key={key}
                className="flex-row items-center space-x-3 bg-slate-800 py-2 px-5"
              >
                <Text className="text-[#00ccbb] font-bold">
                  {items.length} x
                </Text>
                <Image
                  source={{ uri: urlFor(items[0]?.image).url() }}
                  className="h-12 w-12 rounded-full"
                />
                <Text className="flex-1 text-white">{items[0]?.name}</Text>
                <Text className="text-gray-600">
                  <CurrencyFormat
                    value={items[0]?.price}
                    thousandSeparator={true}
                    displayType={"text"}
                    prefix={"₹"}
                    renderText={(value) => (
                      <Text className="text-white">{value}</Text>
                    )}
                  />
                </Text>
                <TouchableOpacity>
                  <Text
                    className="text-[#00CCBB] text-xs"
                    onPress={() => dispatch(removeFromCart({ id: key }))}
                  >
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View className="p-5 bg-[#2c3e50] mt-5 space-y-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-400">Subtotal</Text>
              <Text className="text-gray-400">
                <CurrencyFormat
                  value={cartTotal}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={"₹"}
                  renderText={(value) => <Text>{value}</Text>}
                />
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-300">Delivery Fee</Text>
              <Text className="text-gray-300">
                <CurrencyFormat
                  value={40}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={"₹"}
                  renderText={(value) => <Text>{value}</Text>}
                />
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-white">Order Total</Text>
              <Text className="font-extrabold text-white">
                <CurrencyFormat
                  value={cartTotal + 40}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={"₹"}
                  renderText={(value) => <Text>{value}</Text>}
                />
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("PreparingOrder")}
              className="rounded-lg bg-[#00CCBB] p-4"
            >
              <Text className="text-center text-white text-lg font-bold">
                Place Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
