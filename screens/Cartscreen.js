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
  emptyCart,
  removeFromCart,
  selectCartItems,
  selectCartTotal,
} from "../features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { XCircleIcon, TrashIcon } from "react-native-heroicons/solid";
import { urlFor } from "../sanity";
import CurrencyFormat from "react-currency-format";

export default function Cartscreen() {
  const navigation = useNavigation();
  const restaurant = useSelector(selectRestaurant);
  let items = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [groupedItemsInCart, setGroupedItemsInCart] = useState([]);
  const dispatch = useDispatch();
  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(40);
  const [orderTotal, setOrderTotal] = useState(0);
  // To Empty Cart
  const EmptyCart = () => {
    setGroupedItemsInCart([]);
    setSubtotal(0);
    setGst(0);
    setDeliveryFee(0);
    setOrderTotal(0);
    dispatch(emptyCart());
  };
  useMemo(() => {
    const groupedItems = items.reduce((results, item) => {
      (results[item.id] = results[item.id] || []).push(item);
      return results;
    }, {});

    setGroupedItemsInCart(groupedItems);

    // Calculate subtotal
    const newSubtotal = cartTotal;
    setSubtotal(newSubtotal);

    // Calculate GST
    const newGst = newSubtotal * 0.05;
    setGst(newGst.toFixed(2));

    // Calculate delivery fee
    const newDeliveryFee = items.length > 0 ? 40 : 0;
    setDeliveryFee(newDeliveryFee);

    // Calculate order total
    if (newSubtotal !== 0) {
      const newOrderTotal = newSubtotal + deliveryFee;
      setOrderTotal(newOrderTotal.toFixed(2));
    }
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
            <TouchableOpacity onPress={EmptyCart}>
              <TrashIcon color="#00cc86" className="h-16 w-16" />
            </TouchableOpacity>
          </View>
          {items.length > 0 ? (
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
          ) : (
            <Text className="flex-1 text-white text-center mt-[30%]">No Item Yet!</Text>
          )}

          <View className="p-5 bg-[#2c3e50] mt-5 space-y-4">
            <View className="flex-row justify-between">
              <Text className="text-gray-400">Subtotal</Text>
              <Text className="text-gray-400">
                <CurrencyFormat
                  value={subtotal}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={"₹"}
                  renderText={(value) => <Text>{value}</Text>}
                />
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-300">GST @5%</Text>
              <Text className="text-gray-300">
                <CurrencyFormat
                  value={gst}
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
                  value={deliveryFee}
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
                  value={orderTotal}
                  thousandSeparator={true}
                  displayType={"text"}
                  prefix={"₹"}
                  renderText={(value) => <Text>{value}</Text>}
                />
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("PreparingOrder")}
              className={`rounded-lg ${
                orderTotal < 1 ? "bg-slate-300" : "bg-[#00CCBB]"
              } p-4`}
              disabled={orderTotal < 1}
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
