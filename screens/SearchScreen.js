import {
  View,
  Text,
  StatusBar,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectdata, selectuser, setData } from "../features/userSlice";
import sanityClient from "../sanity";
import { ChevronDownIcon, SearchIcon } from "react-native-heroicons/outline";
import { LogoutIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import DishRow from "../components/DishRow";
import CartIcon from "../components/CartIcon";
import { logout } from "../config";
import NoResult from "../components/NoResult";

export default function SearchScreen() {
  const item = useSelector(selectdata);
  const user = useSelector(selectuser);
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState([]);
  const navigation = useNavigation();
  const [noResult, setNoResult] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    sanityClient
      .fetch(
        `
        *[name == "${item}" && _type=="dish"]
        `
      )
      .then((data) => {
        if (data.length > 0) {
          setNoResult(null);
          setResult(data);
        } else {
          setNoResult(<NoResult />);
        }
      })
      .catch((e) => console.log(e));
  }, [item]);

  const handleSearch = () => {
    dispatch(setData(keyword.trim()));
  };

  async function handleLogout() {
    try {
      await logout();
      navigation.navigate("Auth");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <>
      <StatusBar hidden />
      <CartIcon />
      <View
        style={{
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight + 5 : 0 + 5,
        }}
        className="bg-slate-900 mb-10"
      >
        {/* Header */}
        <View className="flex-row pb-3 items-center mx-4 space-x-2">
          <View>
            <Image
              source={{ uri: "https://links.papareact.com/wru" }}
              className="h-7 w-7 bg-gray-300 p-4 rounded-full"
            />
          </View>

          <View className="flex-1">
            <Text className="font-bold text-gray-400 text-xs">
              Deliver Now!
            </Text>
            <Text className="font-bold text-base text-white">
              {user}
              <ChevronDownIcon size={20} color="#00CCBB" />
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <LogoutIcon size={35} color="#00CCBB" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center space-x-2 pb-4 mx-4 mb-4">
          <View className="flex-row flex-1 space-x-4 items-center bg-gray-200 p-3">
            <TextInput
              placeholder="Search for Foods"
              keyboardType="default"
              onChangeText={(e) => setKeyword(e)}
              value={keyword}
              className="w-72 h-8"
            />
            <TouchableOpacity onPress={handleSearch}>
              <SearchIcon color="gray" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Dishes */}
        <ScrollView>
          {result.map((dish) => (
            <DishRow
              key={dish._id}
              id={dish._id}
              name={dish.name}
              description={dish.short_description}
              price={dish.price}
              image={dish.image}
            />
          ))}
        </ScrollView>
      </View>
      {noResult}
    </>
  );
}
