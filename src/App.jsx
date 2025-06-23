import { useEffect, useState } from "react";
import { TonConnectButton, TonConnectUIProvider } from "@tonconnect/ui-react";

const TON_ADDRESS = "UQAEbqdLmHY-gxbUG9eqeldLX8yQDjUDOo1R5NHYjlpIlGet";
const COIN_RATE = 50; // 50 монет за 0.1 TON

export default function App() {
  const [amount, setAmount] = useState(0);
  const [tgUser, setTgUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready(); // Это может быть ненужно, если WebApp уже готов.
      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      } else {
        console.error(
          "Ошибка: Не удалось получить данные пользователя Telegram."
        );
      }
    }

    // Проверяем, подключен ли кошелек
    const checkWalletConnection = async () => {
      if (window.tonConnectUI) {
        const connected = await window.tonConnectUI.isConnected();
        setWalletConnected(connected);
      }
    };

    checkWalletConnection();
  }, []); // Пустой массив, чтобы этот код выполнялся только один раз при загрузке компонента

  const handleBuy = async () => {
    if (!tgUser || !amount) {
      alert("Введите число и зайдите через Telegram");
      return;
    }

    const nanoTon = Math.floor((amount / COIN_RATE) * 1e9);

    try {
      // Убедитесь, что window.tonConnectUI существует
      if (!window.tonConnectUI) {
        throw new Error("TonConnectUI не загружен.");
      }

      // Отправляем транзакцию
      await window.tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: TON_ADDRESS,
            amount: nanoTon.toString(),
            payload: `uid:${tgUser.id}`,
          },
        ],
      });

      alert("Транзакция успешно отправлена!");
    } catch (err) {
      console.error("Ошибка при отправке транзакции:", err);
      alert("Ошибка: " + err.message);
    }
  };

  return (
    <TonConnectUIProvider manifestUrl="https://botcasino.vercel.app/tonconnect-manifest.json">
      <div style={{ padding: 20 }}>
        <h2>Купить монеты</h2>
        {tgUser && (
          <p>
            Привет, {tgUser.first_name} @{tgUser.username}
          </p>
        )}
        <input
          type="number"
          placeholder="Сколько монет?"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <p>К оплате: {(amount / COIN_RATE).toFixed(4)} TON</p>

        {walletConnected ? (
          <p>Кошелек подключен!</p>
        ) : (
          <p>Кошелек не подключен. Пожалуйста, подключите его.</p>
        )}

        {/* Кнопка подключения кошелька */}
        <TonConnectButton
          onConnect={() => setWalletConnected(true)}
          onDisconnect={() => setWalletConnected(false)}
        />

        <br />
        {/* Кнопка для выполнения оплаты */}
        <button
          onClick={handleBuy}
          style={{ marginTop: 10 }}
          disabled={!walletConnected}
        >
          Оплатить
        </button>
      </div>
    </TonConnectUIProvider>
  );
}
