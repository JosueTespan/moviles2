import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import Input from "../../components/Input";
import PrimaryButton from "../../components/PrimaryButton";
import colors from "../../theme/colors";
import AuthHeader from "../../components/AuthHeader";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Campos vacíos", "Completa todos los campos");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Contraseña débil", "Debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);

      const cred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombre: name,
        email: cred.user.email,
        rol: "estudiante",
        creadoEn: serverTimestamp(),
      });

      Alert.alert("Éxito", "Usuario creado correctamente");
    } catch (error) {
      console.log(error);
      Alert.alert("Error al registrarse", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader subtitle="Crea tu cuenta en KUSKATAN" />

      <Input label="Nombre" value={name} onChangeText={setName} leftIcon="person-outline" />

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
        placeholder="Mínimo 6 caracteres"
      />

      <PrimaryButton
        title={loading ? "Creando..." : "Registrarme"}
        onPress={handleRegister}
        style={{ marginTop: 8 }}
        disabled={loading}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.link}>
          ¿Ya tienes cuenta?{" "}
          <Text style={{ color: colors.accent }}>Inicia sesión</Text>
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
