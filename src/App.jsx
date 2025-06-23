import { useEffect, useState } from "react";
import { TonConnectButton, TonConnectUIProvider } from "@tonconnect/ui-react";

const TON_ADDRESS = "UQAEbqdLmHY-gxbUG9eqeldLX8yQDjUDOo1R5NHYjlpIlGet";
const COIN_RATE = 50; // 50 монет за 0.1 TON

// Конфигурация TonConnect
const manifestUrl = "https://botcasino.vercel.app/tonconnect-manifest.json";

export default function App() {
  const [amount, setAmount] = useState(0);
  const [tgUser, setTgUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Инициализация Telegram WebApp
    const initTelegram = () => {
      try {
        const tg = window.Telegram?.WebApp;
        if (tg) {
          tg.expand();
          if (tg.initDataUnsafe?.user) {
            setTgUser(tg.initDataUnsafe.user);
          }
        }
      } catch (e) {
        console.log("Telegram init error:", e);
      }
    };

    initTelegram();
    setLoading(false);
  }, []);

  const handleBuy = async () => {
    if (!amount || amount <= 0) {
      alert("Пожалуйста, введите корректное количество монет");
      return;
    }

    if (!tgUser) {
      alert("Пожалуйста, войдите через Telegram");
      return;
    }

    const tonAmount = amount / COIN_RATE;
    const nanoTon = Math.floor(tonAmount * 1e9);

    try {
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: TON_ADDRESS,
            amount: nanoTon.toString(),
            payload: JSON.stringify({
              userId: tgUser.id,
              username: tgUser.username || "unknown",
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

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <TonConnectUIProvider
      manifestUrl={manifestUrl}
      uiPreferences={{
        theme: "dark",
        colorsSet: {
          light: {
            connectButton: {
              background: "#0088cc",
              foreground: "#ffffff",
            },
          },
        },
      }}
      actionsConfiguration={{
        twaReturnUrl: window.Telegram?.WebApp?.openTelegramLink || undefined,
      }}
    >
      <div
        style={{
          padding: 20,
          maxWidth: 500,
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333" }}>Купить монеты</h2>

        {tgUser ? (
          <div style={{ marginBottom: 15 }}>
            <p>Привет, {tgUser.first_name || "пользователь"}!</p>
          </div>
        ) : (
          <p style={{ color: "red" }}>Войдите через Telegram</p>
        )}

        <div style={{ marginBottom: 15 }}>
          <input
            type="number"
            placeholder="Сколько монет?"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="0"
            step="1"
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 5,
              border: "1px solid #ccc",
            }}
          />
        </div>

        {amount > 0 && (
          <div style={{ marginBottom: 15 }}>
            <p>К оплате: {(amount / COIN_RATE).toFixed(4)} TON</p>
          </div>
        )}

        <div
          style={{
            marginBottom: 15,
            padding: 10,
            background: walletConnected ? "#e6f7e6" : "#ffe6e6",
            borderRadius: 5,
          }}
        >
          {walletConnected ? (
            <p>Кошелек подключен</p>
          ) : (
            <p>Подключите кошелек для оплаты</p>
          )}
        </div>

        <div
          style={{
            marginBottom: 15,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TonConnectButton style={{ width: "100%" }} />
        </div>

        <button
          onClick={handleBuy}
          disabled={!walletConnected || !amount || amount <= 0}
          style={{
            padding: "10px 20px",
            width: "100%",
            background: walletConnected && amount > 0 ? "#0088cc" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: walletConnected && amount > 0 ? "pointer" : "not-allowed",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Оплатить
        </button>
      </div>
    </TonConnectUIProvider>
  );
}
