import TelegramAuthProvider from "./components/TelegramAuthProvider";
import MusicApp from "./components/MusicApp";

export default function App() {
  return (
    <TelegramAuthProvider>
      <MusicApp />
    </TelegramAuthProvider>
  );
}