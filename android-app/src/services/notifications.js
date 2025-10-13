import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";

export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        Alert.alert("Notificaciones", "Necesitas un dispositivo físico para recibir push.");
        return { expoToken: null, deviceToken: null };
    }

    const settings = await Notifications.getPermissionsAsync();
    let finalStatus = settings.status;

    if (finalStatus !== "granted") {
        const req = await Notifications.requestPermissionsAsync();
        finalStatus = req.status;
    }

    if (finalStatus !== "granted") {
        Alert.alert("Permisos", "No se concedieron permisos de notificaciones.");
        return { expoToken: null, deviceToken: null };
    }

    const expoToken = (await Notifications.getExpoPushTokenAsync()).data;
    const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
    
    return { expoToken, deviceToken };
}
