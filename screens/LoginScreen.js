import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { login } from "../config";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // Login
  async function handleLogin() {
    try {
      dispatch(setUser(email));
      await login(email, pass);
      navigation.navigate("Home");
    } catch (error) {
      setErr(
        <Text className="text-red-500 text-xs my-2 text-center capitalize">
          {error.message
            .replace("Firebase:", "")
            .replace(" ", "")
            .replace("(auth/", "")
            .replace("Error", "")
            .replace("-", " ")
            .replace(")", "")}
        </Text>
      );
    }
  }

  return (
    <>
      <StatusBar hidden />
      <View className="flex-1 justify-center items-center bg-slate-900">
        <Image
          source={{
            uri: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=996&t=st=1660576631~exp=1660577231~hmac=152793cbe92c489c9c6336ea937d93934ade2181960653f76817f749e87f6322",
          }}
          className="w-36 h-36"
        />
        <Text className="mt-3 font-bold text-[#00cec9] mb-4">
          Welcome Back!
        </Text>
        <KeyboardAvoidingView>
          <TextInput
            placeholder="Email"
            className="border bg-gray-200 w-80 p-2 my-3 rounded-md text-xs h-12 focus:border-[#00cec9] focus:border-2 font-bold"
            onChangeText={(e) => setEmail(e.trim())}
            value={email}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            className="border bg-gray-200 w-80 h-12 p-2 my-3 rounded-md text-xs focus:border-green-500 focus:border-2 font-bold"
            onChangeText={(e) => setPass(e.trim())}
            value={pass}
          />
          {err} 
        </KeyboardAvoidingView>
        <Text
          className="text-xs text-blue-300"
          onPress={() => navigation.navigate("Register")}
        >
          Forgot your password?
        </Text>
        <TouchableOpacity
          className="py-3 bg-[#00cec9] mt-5 w-80 rounded-lg"
          onPress={handleLogin}
        >
          <Text className="font-bold text-slate-900 text-center">LOGIN</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
