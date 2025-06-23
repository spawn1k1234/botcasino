import React, { useEffect, useState } from "react";
import {
  TonConnectButton,
  useTonAddress,
  useTonWallet,
} from "@tonconnect/ui-react";

const App = () => {
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const wallet = useTonWallet();

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
    </div>
  );
};

export default App;
