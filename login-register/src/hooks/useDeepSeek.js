// hooks/useDeepSeek.js
import Constants from 'expo-constants';
import { useState } from 'react';

const useDeepSeek = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

   // Obtener la API key correctamente
  const API_KEY = Constants.expoConfig?.extra?.deepSeekApiKey;

  console.log('API Key:', API_KEY); // Para debug

 const sendMessage = async (message, conversationHistory = []) => {
    if (!API_KEY) {
      throw new Error('API key no configurada. Verifica app.config.js');
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            ...conversationHistory,
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (err) {
      setError(err.message);
      console.log("err: ", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
};

export default useDeepSeek;