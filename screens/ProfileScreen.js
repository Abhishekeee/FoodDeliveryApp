import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "./HomeScreen";
import Cartscreen from "./Cartscreen";
import ProfileMenu from "../components/ProfileMenu";
import SearchScreen from "./SearchScreen";
import DeliveryScreen from "./DeliveryScreen";

export default function ProfileScreen() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false, drawerStyle: { width: "70%" } }}
      initialRouteName="Home"
      drawerContent={(props) => <ProfileMenu {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Search" component={SearchScreen} />
      <Drawer.Screen name="Cart" component={Cartscreen} />
      <Drawer.Screen name="Delivery" component={DeliveryScreen} />
    </Drawer.Navigator>
  );
}
