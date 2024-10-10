import React, { useState, useCallback } from 'react';
import { View, FlatList, TextInput, Pressable, Text, SafeAreaView } from 'react-native';
import styles from './styles/style.js';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const greetings = [
  "How's your day going? 😊",
  "What's up today?"
];

const goodbyes = [
  "Goodbye! See you next time! ✨",
  "Talk to you later! 👋",
  "Take care! 👋",
];

const replies = [
  'How are you?',
  'Nice to chat with you',
  'That is great to hear!',
  'How can I assist you?',
  'That sounds like a lot of fun!'
];
const jokes = [
  "Why do astronauts use Linux? They can't open Windows in space 😂",
  "Why do Java developers wear glasses? Because they can't C# 😎",
  "Why don't programmers like nature? Because it has too many bugs 🐛",
  "Why did the web API stop working? It needed to REST 😂",
  "Why did the web developer go broke? Because he used too many cache! 💸"
];



const botAskForJoke = () => {
  return "Would you like to hear a joke? 😀 Reply 'yes' or 'no'";
};

const handleJokeRequest = () => {
  const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
  return randomJoke;
};

export default function App() {
  const [messages, setMessages] = useState([
    {
      _id: new Date().valueOf() + Math.random(),
      text: 'Hello! 👋',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: '?',
      },
    },
  ]);




  const [inputText, setInputText] = useState('');
  const [waitingForJokeResponse, setWaitingForJokeResponse] = useState(false);
  const [hasAskedForJoke, setHasAskedForJoke] = useState(false);

  const onSend = useCallback(() => {
    if (inputText.trim()) {

      const newMessage = {
        _id: new Date().valueOf() + Math.random(),
        text: inputText,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'User',
        },
      };
      setMessages(prevMessages => [newMessage, ...prevMessages]);

      let botResponse = '';

      if (inputText.toLowerCase().includes('how are you')) {
        botResponse = "I'm doing great, thank you! How about you? 😊";
      }

      else if (messages.length === 1) {
        botResponse = greetings[Math.floor(Math.random() * greetings.length)];
      }
      else if (inputText.toLowerCase().includes('bye') ||
        inputText.toLowerCase().includes('goodbye')) {
        botResponse = goodbyes[Math.floor(Math.random() * goodbyes.length)];
      }
      else if (
        inputText.toLowerCase().includes('can you tell me a joke') ||
        inputText.toLowerCase().includes('tell me a joke') ||
        inputText.toLowerCase().includes('joke') ||
        inputText.toLowerCase().includes('make me laugh')
      )
        botResponse = handleJokeRequest()
      else if (!hasAskedForJoke) {
        botResponse = botAskForJoke();
        setHasAskedForJoke(true);
        setWaitingForJokeResponse(true);
      } else if (inputText.toLowerCase().includes('yes') || inputText.toLowerCase().includes('yeah')) {
        botResponse = handleJokeRequest();
        setWaitingForJokeResponse(false);
      } else if (inputText.toLowerCase().includes('no')) {
        botResponse = "Okay! Let me know if you change your mind. 😊";
        setWaitingForJokeResponse(false);
      } else {

        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        botResponse = randomReply;
      }
      const botReply = {
        _id: new Date().valueOf() + Math.random(),
        text: botResponse,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: '?',
        },
      };
      setTimeout(() => {
        setMessages(prevMessages => [botReply, ...prevMessages]);
      }, 1000);

      setInputText('');
    }
  }, [inputText]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>

              {item.user._id === 2 && (
                <View style={styles.avatarContainer}>
                  <MaterialCommunityIcons name="robot-happy" size={30} color="white" />
                </View>
              )}


              <View
                style={[
                  styles.messageContainer,
                  item.user._id === 1 ? styles.userMessageContainer : styles.botMessageContainer,
                ]}
              >
                <View
                  style={[
                    styles.message,
                    item.user._id === 1 ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  <Text>{item.text}</Text>
                </View>
              </View>
            </View>
          )}
          keyExtractor={item => item._id.toString()}
          inverted
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={inputText}
            onChangeText={setInputText}
          />
          <Pressable style={styles.button} onPress={onSend}>
            <Text style={styles.buttonText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
