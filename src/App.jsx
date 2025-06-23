import { useEffect, useState } from "react";
import {
  TonConnectButton,
  TonConnectUIProvider,
  useTonConnectUI,
} from "@tonconnect/ui-react";

const TON_ADDRESS = "UQDNqYE7mTZnTRKdyZuu5ITXVJEnPt4co-kSqBNZ_oHZn1Q7";
const COIN_RATE = 50; // 50 монет за 0.1 TON

export default function App() {
  const [amount, setAmount] = useState(0);
  const [tgUser, setTgUser] = useState(null);
  const { tonConnectUI, connected } = useTonConnectUI(); // Обязательно получи доступ к tonConnectUI

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    if (tg?.initDataUnsafe?.user) {
      setTgUser(tg.initDataUnsafe.user);
    }
  }, []);

  const handleBuy = async () => {
    if (!tgUser || !amount) {
      alert("Введите число и зайдите через Telegram");
      return;
    }

    const nanoTon = Math.floor((amount / COIN_RATE) * 1e9);

    try {
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
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
  };

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
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
        <TonConnectButton />
        <br />
        <button onClick={handleBuy} style={{ marginTop: 10 }}>
          Оплатить
        </button>

        {/* Показать информацию о подключении */}
        {connected ? (
          <p>Подключение к кошельку установлено</p>
        ) : (
          <p>Пожалуйста, подключите свой кошелек</p>
        )}
      </div>
    </TonConnectUIProvider>
  );
}
