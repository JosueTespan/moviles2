import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/config";
import Input from "../../components/Input";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../theme/colors";
import AuthHeader from "../../components/AuthHeader";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos vacíos", "Completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      Alert.alert("Error al iniciar sesión", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader subtitle="Inicia sesión para continuar" />

      <Input
        label="Correo"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        leftIcon="mail-outline"
        placeholder="ejemplo@correo.com"
      />

      <Input
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPass}
        leftIcon="lock-closed-outline"
        rightIcon={showPass ? "eye-off-outline" : "eye-outline"}
        onRightIconPress={() => setShowPass((prev) => !prev)}
        placeholder="Ingresa tu contraseña"
      />

      <PrimaryButton
        title={loading ? "Ingresando..." : "Ingresar"}
        onPress={handleLogin}
        style={{ marginTop: 8 }}
        disabled={loading}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.link}>
          ¿No tienes cuenta?{" "}
          <Text style={{ color: colors.accent }}>Crear una</Text>
        </Text>
      </TouchableOpacity>
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
  link: {
    color: colors.title,
    textAlign: "center",
  },
});
