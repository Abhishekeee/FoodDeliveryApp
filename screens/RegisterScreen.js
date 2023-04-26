import {
  View,
  Text,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { signup } from "../config";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser, setUsername } from "../features/userSlice";
import * as EmailValidator from "email-validator";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [userNAME, setUserNAME] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [err, setErr] = useState();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Check Username already Exist or not
  const checkUsername = async (USERNAME) => {
    try {
      const docData = await getDoc(doc(db, "users", USERNAME));
      if (docData.exists()) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  // SIGNUP
  async function handleSignup() {
    try {
      if (!EmailValidator.validate(email)) {
        setErr(
          <Text className="text-red-500 text-xs my-2 text-center">
            Invalid Email
          </Text>
        );
      } else if (await checkUsername(userNAME)) {
        dispatch(setUser(email));
        dispatch(setUsername(userNAME));
        if (pass == cpass) {
          try {
            await signup(email, pass);
            // Inserting User Credentials in Firestore
            setDoc(doc(db, "users", userNAME), {
              username: userNAME,
              Email: email,
              password: pass,
            })
              .then((res) => {
                console.log("data submitted");
              })
              .catch((error) => {
                console.log(error);
              });
            navigation.navigate("Profile");
          } catch (err) {
            setErr(
              <Text className="text-red-500 text-xs my-2 text-center capitalize">
                {formatErrorMessage(err.message)}
              </Text>
            );
          }
        } else {
          setErr(
            <Text className="text-red-500 text-xs my-2 text-center">
              Password and Confirm Password Should Be Same
            </Text>
          );
        }
      } else {
        setErr(
          <Text className="text-red-500 text-xs my-2 text-center">
            UserName or Email Already Exists
          </Text>
        );
      }
    } catch (error) {
      setErr(
        <Text className="text-red-500 text-xs my-2 text-center capitalize">
          {formatErrorMessage(error.message)`or Username`}
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
            uri: "https://img.freepik.com/free-vector/follow-me-social-business-theme-design_24877-50426.jpg?w=996&t=st=1660580318~exp=1660580918~hmac=58decb4fcb48af2dab4c1d4f58d9db7101d4a163c621b9fdb0751fb496c1d909",
          }}
          className="w-36 h-36"
        />
        <Text className="mt-3 font-bold text-slate-900 mb-4 text-lg">
          Get Started!
        </Text>
        <KeyboardAvoidingView>
          <TextInput
            placeholder="Username"
            className="border bg-gray-200 w-80 h-12 p-2 my-3 rounded-md text-base focus:border-p[#FFC312] focus:border-2 font-bold focus:bg-slate-200"
            selectionColor={"#3498db"}
            onChangeText={(e) => setUserNAME(e.trim())}
            value={userNAME.toLowerCase()}
          />
          <TextInput
            placeholder="Email"
            className="border bg-gray-200 w-80 h-12 p-2 my-3 rounded-md text-base focus:border-[#C4E538] focus:border-2 font-bold focus:bg-slate-200"
            selectionColor={"#3498db"}
            onChangeText={(e) => setEmail(e.trim())}
            value={email.toLowerCase()}
          />
          <TextInput
            placeholder="Create password"
            secureTextEntry={true}
            className="border bg-gray-200 w-80 h-12 p-2 my-3 rounded-md text-base focus:border-[#55efc4] focus:border-2 font-bold focus:bg-slate-200"
            selectionColor={"#27ae60"}
            onChangeText={(e) => setPass(e.trim())}
            value={pass}
          />
          <TextInput
            placeholder="Confirm password"
            secureTextEntry={true}
            className="border bg-gray-200 w-80 h-12 p-2 my-3 rounded-md text-base focus:border-[#55efc4] focus:border-2 font-bold focus:bg-slate-200"
            selectionColor={"#2ecc71"}
            onChangeText={(e) => setCpass(e.trim())}
            value={cpass}
          />
          {err}
        </KeyboardAvoidingView>
        <TouchableOpacity
          className="py-3 bg-[#55efc4] mt-5 w-80"
          onPress={handleSignup}
        >
          <Text className="font-bold text-slate-900 text-center">Sign Up</Text>
        </TouchableOpacity>
        <StatusBar hidden />
      </View>
    </>
  );
}
