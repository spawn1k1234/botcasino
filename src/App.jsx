import React, { useState, useEffect } from "react";
import {
  TonConnectButton,
  TonConnectUIProvider,
  useTonConnectUI,
} from "@tonconnect/ui-react"; // Импортируем необходимые компоненты

const TON_ADDRESS = "UQAEbqdLmHY-gxbUG9eqeldLX8yQDjUDOo1R5NHYjlpIlGet";
const COIN_RATE = 50; // 50 монет за 0.1 TON

function App() {
  const [amount, setAmount] = useState(0);
  const [tgUser, setTgUser] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Инициализация TonConnect UI
  const tonConnectUI = useTonConnectUI();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready(); // Подготовка Telegram WebApp
      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      } else {
        console.error("Не удалось получить данные пользователя Telegram.");
      }
    }

    const checkWalletConnection = async () => {
      if (tonConnectUI) {
        const connected = await tonConnectUI.isConnected();
        setWalletConnected(connected);
      }
    };

    checkWalletConnection();
  }, [tonConnectUI]);

  const handleBuy = async () => {
    if (!tgUser || !amount) {
      alert("Введите число и зайдите через Telegram.");
      return;
    }

    const nanoTon = Math.floor((amount / COIN_RATE) * 1e9); // Переводим в нанотонны

    try {
      if (!tonConnectUI) {
        throw new Error("TonConnectUI не загружен.");
      }

      await tonConnectUI.sendTransaction({
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

        <TonConnectButton
          onConnect={() => setWalletConnected(true)}
          onDisconnect={() => setWalletConnected(false)}
        />

        <br />
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

export default App;
