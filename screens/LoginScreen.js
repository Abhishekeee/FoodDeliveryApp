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
import { db, login } from "../config";
import { useDispatch } from "react-redux";
import { setUser, setUsername } from "../features/userSlice";
import { doc, getDoc } from "firebase/firestore";

export default function LoginScreen() {
  const [userNAME, setUserNAME] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userExists = async (USERNAME) => {
    try {
      const docData = await getDoc(doc(db, "users", USERNAME));
      if (docData.exists()) {
        if (USERNAME === docData.data().username) {
          return true;
        }
        return false;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  const getEmail = async (USERNAME) => {
    try {
      const docData = await getDoc(doc(db, "users", USERNAME));
      if (docData.exists()) {
        return docData.data().Email;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  // Login
  async function handleLogin() {
    try {
      const EMAIL = await getEmail(userNAME);
      if (EMAIL && (await userExists(userNAME))) {
        await login(EMAIL, pass);
        dispatch(setUsername(userNAME));
        dispatch(setUser(EMAIL));
        navigation.navigate("Profile");
      } else {
        setErr(
          <Text className="text-red-500 text-xs my-2 text-center capitalize">
            Account Not Found
          </Text>
        );
      }
    } catch (error) {
      setErr(
        <Text className="text-red-500 text-xs my-2 text-center capitalize">
          {formatErrorMessage(error.message)}
        </Text>
      );
    }
  }
  function formatErrorMessage(message) {
    return message
      .replace("Firebase:", "")
      .replace(" ", "")
      .replace("(auth/", "")
      .replace("Error", "")
      .replace("-", " ")
      .replace(")", "");
  }

  return (
    <>
      <StatusBar hidden />
      <View className="flex-1 justify-center items-center">
        <Image
          source={{
            uri: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=996&t=st=1660576631~exp=1660577231~hmac=152793cbe92c489c9c6336ea937d93934ade2181960653f76817f749e87f6322",
          }}
          className="w-36 h-36"
        />
        <Text className="mt-3 font-bold text-[#00cec9] mb-4 text-lg">
          Welcome Back!
        </Text>
        <KeyboardAvoidingView>
          <TextInput
            placeholder="Username"
            className="border bg-gray-200 w-80 p-2 my-3 rounded-md text-base h-12 focus:border-[#00cec9] focus:border-2 font-bold focus:bg-slate-200"
            onChangeText={(e) => setUserNAME(e.trim().toLowerCase())}
            value={userNAME}
          />
          <TextInput
            placeholder="Password"
            secureTextEntry={true}
            className="border bg-gray-200 w-80 h-12 p-2 my-3 rounded-md text-base focus:border-green-500 focus:border-2 font-bold focus:bg-slate-200"
            onChangeText={(e) => setPass(e.trim())}
            value={pass}
          />
          {err}
        </KeyboardAvoidingView>
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
