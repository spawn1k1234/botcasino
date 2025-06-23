import { useEffect, useState } from "react";
import { TonConnect } from "@tonconnect/sdk";

const connector = new TonConnect();

export default function App() {
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const TON_ADDRESS = "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7";
  const COIN_AMOUNT = 0.1 * 10 ** 9; // 0.1 TON in nanotons

  useEffect(() => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    if (tgUser) {
      setUser(tgUser);
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

      // Подключение кошелька
      const wallet = await connector.connect(); // Используем correct метод connect()

      if (!wallet) {
        throw new Error("Не удалось подключить кошелек.");
      }

      // Создание транзакции
      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: TON_ADDRESS,
            amount: COIN_AMOUNT.toString(),
            payload: `uid:${user.id}`,
          },
        ],
      };

      // Отправка транзакции
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
      <p>Цена: 0.1 TON (~$0.14)</p>

      {user && (
        <p>
          Вы: <strong>{user.first_name}</strong> @{user.username}
        </p>
      )}

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
