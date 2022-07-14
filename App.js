import { LogBox } from "react-native";
import { TailwindProvider } from "tailwind-rn";
import utilities from "./tailwind.json";
import StackNavigator from "./src/StackNavigator";
import { AuthProvider } from "./src/hooks/useAuth";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);
LogBox.ignoreLogs(["AsyncStorage has been extracted"]);
LogBox.ignoreLogs(["Unsupported Tailwind class"]);

export default function App() {
  return (
    <TailwindProvider utilities={utilities}>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </TailwindProvider>
  );
}
