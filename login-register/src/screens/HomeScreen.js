import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../theme/colors";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.brand}>KUSKATAN</Text>
      </View>

      <Text style={styles.text}>
        Bienvenido a KUSKATAN 🎶 — un espacio donde la tecnología y la cultura
        se encuentran. Aquí podrás explorar, aprender y conectar.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 70,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 10,
  },
  brand: {
    fontSize: 34,
    color: colors.title,
    fontFamily: "Kuskatan", // fuente personalizada
    letterSpacing: 2,
  },
  text: {
    color: colors.info,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
});
