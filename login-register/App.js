import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";

export default function App() {
  const [fontsLoaded] = useFonts({
    // pon aquí tu fuente real: assets/fonts/Kuskatan.ttf
    Kuskatan: require("./assets/fonts/Kuskatan.ttf"),
    // si no la tienes aún, puedes comentar esto y usar system font
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <AppNavigator />;
}
