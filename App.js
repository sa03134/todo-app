import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./colors";
import { Fontisto } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Entypo } from "@expo/vector-icons";
const STORAGE_KEY = "@toDos";
const WORK_KEY = "@working";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [editText, setEditText] = useState("");

  const saveWorking = async (state) => {
    await AsyncStorage.setItem(WORK_KEY, JSON.stringify(state));
  };
  const travel = () => {
    setWorking(false);
    saveWorking(working);
  };
  const work = () => {
    setWorking(true);
    saveWorking(working);
  };

  const onChangeText = (payload) => {
    console.log("this is payload", payload);
    setText(payload);
  };

  const onEditingText = (change) => {
    setEditText(change);
    console.log(change);
  };

  const loadWorking = async () => {
    const boolean = await AsyncStorage.getItem(WORK_KEY);
    console.log("loaded working : ", boolean);
    boolean !== "true" ? setWorking(true) : setWorking(false);
  };

  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    s !== null ? setToDos(JSON.parse(s)) : null;
  };

  useEffect(() => {
    loadWorking();
    loadToDos();
    console.log(toDos);
  }, []);
  const addToDo = async () => {
    if (text === "") {
      return;
    }

    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, complete: false, change: false },
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  const editToDo = async (key) => {
    toDos[key].text = editText;
    toDos[key].change = false;
    setToDos(toDos);
    saveToDos(toDos);
    loadToDos(toDos);
  };

  const deleteToDo = (key) => {
    Alert.alert("Delete To Do?", "Are you sure?", [
      { text: "cancel" },
      {
        text: "yes",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };

  const checkToDo = (key) => {
    toDos[key].complete = !toDos[key].complete;
    setToDos(toDos);
    saveToDos(toDos);
    loadToDos(toDos);
  };

  const changeToDo = (key) => {
    toDos[key].change = !toDos[key].change;
    saveToDos(toDos);
    setToDos(toDos);
    loadToDos(toDos);
    setEditText(toDos[key].text);
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{
              ...styles.btnText,
              color: !working ? "white" : theme.gray,
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onSubmitEditing={addToDo}
        onChangeText={onChangeText}
        value={text}
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View style={styles.toDo} key={key}>
              {!toDos[key].change ? (
                <Text
                  style={{
                    ...styles.toDoText,
                    textDecorationLine: toDos[key].complete
                      ? "line-through"
                      : null,
                    color: toDos[key].complete ? "black" : "white",
                  }}
                >
                  {toDos[key].text}
                </Text>
              ) : (
                <TextInput
                  value={editText}
                  style={styles.changeToDo}
                  onChangeText={onEditingText}
                  onSubmitEditing={() => editToDo(key)}
                />
              )}

              <View style={styles.toDoOption}>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <Fontisto name="trash" size={18} color="white" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeToDo(key)}>
                  <Entypo name="pencil" size={24} color="white" />
                </TouchableOpacity>
                <BouncyCheckbox
                  fillColor="#ffff"
                  onPress={() => checkToDo(key)}
                />
              </View>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    justifyContent: "space-between",
  },
  btnText: {
    fontSize: 38,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.gray,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  toDoOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    flexBasis: 150,
  },
  changeToDo: {
    backgroundColor: "white",
    fontSize: 16,
    borderRadius: 15,
    paddingHorizontal: 20,
  },
});
