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
import { selectuser, setData } from "../features/userSlice";
import { logout } from "../config";

export default function HomeScreen() {
  const navigation = useNavigation();
  const user = useSelector(selectuser);
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState("");
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
        <View className="flex-row items-center space-x-2 pb-2 mx-4">
          <View className="flex-row flex-1 space-x-4 items-center bg-gray-200 p-3">
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
