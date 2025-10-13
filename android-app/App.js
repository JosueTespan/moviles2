import './src/utils/notificationsSetup';
import React, { useEffect, useState } from "react";
import { Platform, View, Text } from "react-native";
import Navigation from "./src/navigation";
import { registerForPushNotificationsAsync } from "./src/services/notifications";

export default function App() {
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [devicePushToken, setDevicePushToken] = useState(null);

    useEffect(() => {
        (async () => {
            const { expoToken, deviceToken } = await registerForPushNotificationsAsync();
            setExpoPushToken(expoToken);
            setDevicePushToken(deviceToken);

            // Envía ambos a tu backend (guarda deviceToken para FCM directo)
            try {
                /* await registerDeviceOnBackend({
                    userId: "USER_123",
                    platform: Platform.OS,
                    expoPushToken: expoToken,
                    devicePushToken: deviceToken
                }); */

                console.log('expoToken: ' + expoToken);
                console.log('deviceToken: ' + deviceToken);
            } catch (e) {
                console.warn("No se pudo registrar el dispositivo:", e);
            }
        })();
    }, []);

    return (
        <>
            <Navigation />
        </>
    );
}
