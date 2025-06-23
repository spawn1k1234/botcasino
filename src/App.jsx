import { useEffect, useState } from "react";
import { TonConnectButton, TonConnectUIProvider } from "@tonconnect/ui-react";

const TON_ADDRESS = "UQAEbqdLmHY-gxbUG9eqeldLX8yQDjUDOo1R5NHYjlpIlGet";
const COIN_RATE = 50; // 50 монет за 0.1 TON

export default function App() {
  const [amount, setAmount] = useState(0);
  const [tgUser, setTgUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    // Инициализация Telegram WebApp
    const initTelegram = () => {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.expand(); // Развернуть приложение на весь экран
        if (tg.initDataUnsafe?.user) {
          setTgUser(tg.initDataUnsafe.user);
        } else {
          console.log("Telegram user data not available");
        }
      }
    };

    // Инициализация TonConnect
    const initTonConnect = async () => {
      if (window.tonConnectUI) {
        const connected = await window.tonConnectUI.isConnected();
        setWalletConnected(connected);

        window.tonConnectUI.onStatusChange((wallet) => {
          setWalletConnected(!!wallet);
        });
      }
    };

    initTelegram();
    initTonConnect();
  }, []);

  const handleBuy = async () => {
    if (!tgUser || !amount) {
      alert(
        "Пожалуйста, введите количество монет и убедитесь, что вы вошли через Telegram"
      );
      return;
    }

    const tonAmount = amount / COIN_RATE;
    const nanoTon = Math.floor(tonAmount * 1e9);

    try {
      if (!window.tonConnectUI) {
        throw new Error("TonConnectUI не инициализирован");
      }

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 минут
        messages: [
          {
            address: TON_ADDRESS,
            amount: nanoTon.toString(),
            payload: JSON.stringify({
              userId: tgUser.id,
              username: tgUser.username,
            }),
          },
        ],
      };

      const result = await window.tonConnectUI.sendTransaction(transaction);
      console.log("Transaction result:", result);
      alert("Транзакция успешно отправлена!");
    } catch (err) {
      console.error("Transaction error:", err);
      alert(`Ошибка: ${err.message}`);
    }
  };

  return (
    <TonConnectUIProvider
      manifestUrl="https://botcasino.vercel.app/tonconnect-manifest.json"
      uiPreferences={{ theme: "dark" }}
    >
      <div
        style={{
          padding: 20,
          maxWidth: 500,
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Купить монеты</h2>

        {tgUser && (
          <div style={{ marginBottom: 15 }}>
            <p>Привет, {tgUser.first_name || "пользователь"}!</p>
            <small>ID: {tgUser.id}</small>
          </div>
        )}

        <div style={{ marginBottom: 15 }}>
          <input
            type="number"
            placeholder="Сколько монет?"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <p>К оплате: {(amount / COIN_RATE).toFixed(4)} TON</p>
        </div>

        <div
          style={{
            marginBottom: 15,
            padding: 10,
            background: walletConnected ? "#e6f7e6" : "#ffe6e6",
            borderRadius: 5,
          }}
        >
          {walletConnected ? (
            <p>Кошелек подключен!</p>
          ) : (
            <p>Пожалуйста, подключите кошелек</p>
          )}
        </div>

        <div style={{ marginBottom: 15 }}>
          <TonConnectButton
            className="ton-connect-button"
            onConnect={() => setWalletConnected(true)}
            onDisconnect={() => setWalletConnected(false)}
          />
        </div>

        <button
          onClick={handleBuy}
          disabled={!walletConnected || !amount}
          style={{
            padding: "10px 20px",
            width: "100%",
            background: walletConnected && amount ? "#0088cc" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: walletConnected && amount ? "pointer" : "not-allowed",
          }}
        >
          Оплатить
        </button>
      </div>
    </TonConnectUIProvider>
  );
}
