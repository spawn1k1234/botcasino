import { useEffect, useState } from "react";
import { TonConnect } from "@tonconnect/sdk";

const connector = new TonConnect();

export default function App() {
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coinAmount, setCoinAmount] = useState(50); // Начальное количество монет (50)
  const [balance, setBalance] = useState(0); // Баланс монет

  const TON_ADDRESS = "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7";
  const COIN_PRICE = 0.1 * 10 ** 9; // 0.1 TON в нанотонах (для 50 монет)

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
    if (!user) {
      alert("Не удалось получить данные пользователя!");
      return;
    }

    try {
      setLoading(true);

      // Подключаем кошелек через TonConnect
      await connector.connectWallet();

      // Генерация транзакции для отправки TON
      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: TON_ADDRESS,
            amount: (COIN_PRICE * (coinAmount / 50)).toString(), // Цена за количество монет
            payload: `uid:${user.id}`, // Используем user.id для идентификации
          },
        ],
      };

      // Отправляем транзакцию
      await connector.sendTransaction(tx);
      alert("✅ Оплата отправлена. Монеты скоро поступят!");

      // Получаем баланс пользователя сразу после транзакции
      const res = await fetch(
        `https://your-vercel-api.vercel.app/balance/${user.id}`
      );
      const { userBalance } = await res.json();
      setBalance(userBalance); // Обновляем баланс на клиенте
    } catch (err) {
      alert("❌ Ошибка: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", textAlign: "center" }}>
      <h2>Купить монеты</h2>
      <p>Цена: 0.1 TON (~$0.14) за 50 монет</p>

      {user && (
        <p>
          Вы: <strong>{user.first_name}</strong> @{user.username}
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        <label htmlFor="coinAmount" style={{ fontSize: "18px" }}>
          Сколько монет хотите купить?
        </label>
        <input
          type="number"
          id="coinAmount"
          value={coinAmount}
          onChange={(e) => setCoinAmount(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", marginTop: "10px" }}
        />
      </div>

      <p>Итого: {(COIN_PRICE * (coinAmount / 50)) / 10 ** 9} TON</p>

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

      <div style={{ marginTop: 30 }}>
        <h3>Ваш баланс монет: {balance}</h3>
      </div>
    </div>
  );
}
