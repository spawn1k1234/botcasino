import React, { useEffect, useState } from "react";
import {
  TonConnectUIProvider,
  TonConnectButton,
  useTonAddress,
  useTonWallet,
  useTonConnectUI,
} from "@tonconnect/ui-react";

const App = () => {
  const [tonConnectUI, setTonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const wallet = useTonWallet();

  // Используем useState для хранения данных пользователя
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (wallet) {
      setUserData({
        address: wallet.account.address,
        device: wallet.device.appName,
        provider: wallet.provider,
        walletName: wallet.name,
        walletImage: wallet.imageUrl,
      });
    }
  }, [wallet]);

  return (
    <TonConnectUIProvider manifestUrl="https://your-app-url/tonconnect-manifest.json">
      <div style={{ padding: "20px" }}>
        <header style={{ display: "flex", justifyContent: "space-between" }}>
          <h1>My React App with TON Connect</h1>
          <TonConnectButton />
        </header>

        {userData ? (
          <div>
            <h2>User Wallet Info:</h2>
            <p>
              <strong>Address (user-friendly):</strong> {userFriendlyAddress}
            </p>
            <p>
              <strong>Raw Address:</strong> {rawAddress}
            </p>
            <p>
              <strong>Wallet Name:</strong> {userData.walletName}
            </p>
            <p>
              <strong>Connected Device:</strong> {userData.device}
            </p>
            <p>
              <strong>Provider:</strong> {userData.provider}
            </p>
            {userData.walletImage && (
              <img
                src={userData.walletImage}
                alt={userData.walletName}
                style={{ width: "50px", height: "50px" }}
              />
            )}
          </div>
        ) : (
          <p>Connect your wallet to see your information.</p>
        )}

        <button onClick={() => tonConnectUI.openModal()}>Connect Wallet</button>
      </div>
    </TonConnectUIProvider>
  );
};

export default App;
