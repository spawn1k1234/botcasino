import { useEffect, useState } from "react";
import { TonConnect } from "@tonconnect/sdk";

const connector = new TonConnect();

export default function App() {
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coinAmount, setCoinAmount] = useState(0);

  const TON_ADDRESS = "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7";
  const COIN_RATE = 50; // 50 coins per 0.1 TON

  // Обработка изменения количества монет для покупки
  const handleAmountChange = (e) => {
    setCoinAmount(e.target.value);
  };

  // Конвертация введённого количества монет в TON
  const calculatePrice = () => {
    return (coinAmount / COIN_RATE) * 0.1;
  };

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser) {
      setUser(tgUser);
    } else {
      console.error("Не удалось получить данные о пользователе.");
    }

    window.Telegram.WebApp.ready();

    connector.restoreConnection().then(() => {
      setConnected(connector.connected);
    });

    connector.onStatusChange((wallet) => {
      setConnected(wallet !== null);
    });
  }, []);

  const handleBuy = async () => {
    try {
      setLoading(true);

      // Подключаем кошелек
      await connector.connectWallet();

      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: TON_ADDRESS,
            amount: (coinAmount / COIN_RATE) * 10 ** 9, // переводим в нанотоны
            payload: `uid:${user.id}`,
          },
        ],
      };

      await connector.sendTransaction(tx);
      alert("✅ Оплата отправлена. Монеты скоро поступят!");
    } catch (err) {
      alert("❌ Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", textAlign: "center" }}>
      <h2>Купить монеты</h2>
      <p>Цена: {calculatePrice().toFixed(4)} TON</p>
      {user && (
        <p>
          Вы: <strong>{user.first_name}</strong> @{user.username}
        </p>
      )}
      <input
        type="number"
        value={coinAmount}
        onChange={handleAmountChange}
        min="1"
        max="1000"
        style={{ padding: "10px", fontSize: "16px" }}
      />
      <button
        onClick={handleBuy}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          background: "#04befe",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          marginTop: 20,
        }}
      >
        {loading ? "Ожидание..." : "Оплатить TON"}
      </button>
    </div>
  );
}
