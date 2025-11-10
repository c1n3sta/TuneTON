import TelegramAuthProvider from "./components/TelegramAuthProvider";
import MusicApp from "./components/MusicApp";

export default function App() {
  return (
    <div className="dark">
      <TelegramAuthProvider>
        <MusicApp />
      </TelegramAuthProvider>
    </div>
  );
}