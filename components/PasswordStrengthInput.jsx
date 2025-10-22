import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons"; // 👁 for eye icon toggle

export default function PasswordStrengthInput({
  onValidPassword,
  placeholder = "Enter password",
  label = "Password",
}) {
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

 
  const score = useMemo(() => {
    let points = 0;
    if (password.length >= 8) points++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) points++;
    if (/[0-9]/.test(password)) points++;
    if (/[^A-Za-z0-9]/.test(password)) points++;
    return points;
  }, [password]);

  const strengthLabel = useMemo(() => {
    switch (score) {
      case 0:
      case 1:
        return "Very weak";
      case 2:
        return "Weak";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  }, [score]);

  const strengthColor = useMemo(() => {
    switch (score) {
      case 0:
      case 1:
        return "#ff4d4f"; // red
      case 2:
        return "#ff7a45"; // orange
      case 3:
        return "#faad14"; // yellow
      case 4:
        return "#52c41a"; // green
      default:
        return "#ddd";
    }
  }, [score]);

  const isAcceptable = score >= 3;

  const handleSubmit = () => {
    setTouched(true);
    if (!isAcceptable) {
      Alert.alert("Weak password", "Please choose a stronger password.");
      return;
    }

    if (onValidPassword) onValidPassword(password);
    setPassword("");
    setTouched(false);
  };


  useEffect(() => {
    return () => setPassword("");
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      {/* 🔒 Password input with eye toggle */}
      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          onChangeText={(t) => setPassword(t)}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
           placeholderTextColor="#f3e8e8ff"
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          returnKeyType="done"
          style={styles.input}
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#888"
          />
        </Pressable>
      </View>

     
      <View style={styles.meterRow}>
        <View style={[styles.meter, { backgroundColor: "#fff" }]}>
          <View
            style={{
              flex: score / 4,
              backgroundColor: strengthColor,
              height: "100%",
              borderRadius: 6,
            }}
          />
        </View>
        <Text style={styles.strengthText}>{strengthLabel}</Text>
      </View>

   
      <View style={styles.hints}>
        <Text style={styles.hintText}>• Minimum 8 characters</Text>
        <Text style={styles.hintText}>• Mix uppercase & lowercase</Text>
        <Text style={styles.hintText}>• Add numbers and symbols</Text>
      </View>

     
      {touched && !isAcceptable && (
        <Text style={styles.error}>
          Password too weak — please make it stronger.
        </Text>
      )}


      <Pressable
        onPress={handleSubmit}
        style={[styles.button, !isAcceptable && styles.buttonDisabled]}
        disabled={!isAcceptable}
      >
        <Text style={styles.buttonText}>Confirm Password</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#000",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "500",
    color: "#fff",
  },
  inputContainer: {
    position: "relative",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    paddingRight: 40, 
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  meterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  meter: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  strengthText: {
    marginLeft: 12,
    minWidth: 70,
    textAlign: "right",
    color: "#fff",
  },
  hints: {
    marginBottom: 12,
  },
  hintText: {
    fontSize: 13,
    color: "#ccc",
  },
  error: {
    color: "#ff4d4f",
    marginBottom: 8,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#1677ff",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#555",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

