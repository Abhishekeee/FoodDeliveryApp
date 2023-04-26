import {
  View,
  Text,
  Platform,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  LogoutIcon,
  ChevronDownIcon,
  SearchIcon,
} from "react-native-heroicons/outline";
import Categories from "../components/Categories";
import FeaturedRow from "../components/FeaturedRow";
import sanityClient from "../sanity";
import { useSelector, useDispatch } from "react-redux";
import {
  selectusername,
  setData,
  setUserLat,
  setUserLon,
} from "../features/userSlice";
import { logout } from "../config";
import CartIcon from "../components/CartIcon";

export default function HomeScreen() {
  const navigation = useNavigation();
  const username = useSelector(selectusername);
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [featuredCategories, setFeaturedCategories] = useState([]);

  useEffect(() => {
    sanityClient
      .fetch(
        `
    *[_type == "featured"]{
      ...,
      restaurants[]->{
        ...,
        dishes[]->,
        type->{
          name
        }
      }
    }
    `
      )
      .then((data) => setFeaturedCategories(data))
      .catch((e) => console.log(`Can't Load Data ${e}`));
  }, []);

  // Get User Location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    dispatch(setUserLat(location.coords.latitude));
    dispatch(setUserLon(location.coords.longitude));
  }

  // Searching
  const handleSearch = () => {
    dispatch(setData(keyword.trim()));
    navigation.navigate("Search");
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
      <CartIcon />
      <StatusBar hidden />
      <View
        style={{
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight + 5 : 0 + 5,
        }}
        className="mb-10 bg-slate-900"
      >
        {/* Header */}
        <View className="flex-row pb-3 items-center mx-4 space-x-2">
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Image
              source={{ uri: "https://links.papareact.com/wru" }}
              className="h-7 w-7 bg-gray-300 p-4 rounded-full"
            />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="font-bold text-gray-400 text-xs">
              Deliver Now!
            </Text>
            <Text className="font-bold text-base text-white">
              {username}
              <ChevronDownIcon size={20} color="#00CCBB" />
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <LogoutIcon size={35} color="#00CCBB" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="flex-row items-center space-x-2 pb-2 mx-2 mb-4">
          <View className="flex-row space-x-6 flex-1 items-center bg-gray-200 p-3">
            <TextInput
              placeholder="Search for Foods"
              keyboardType="default"
              onChangeText={(e) => setKeyword(e)}
              value={keyword}
              className="w-72 h-8"
            />
            <TouchableOpacity onPress={handleSearch}>
              <SearchIcon color="gray" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Body */}
        <ScrollView
          className="bg-gray-100"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Categories */}
          <Categories />

          {/* Featured */}
          {featuredCategories?.map((category) => (
            <FeaturedRow
              key={category._id}
              id={category._id}
              title={category.name}
              description={category.short_description}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
}
