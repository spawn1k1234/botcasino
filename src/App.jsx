import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
    const tgUser = initDataUnsafe?.user;

    if (tgUser) {
      setUser({
        id: tgUser.id,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name,
        username: tgUser.username,
        photo_url: tgUser.photo_url,
        phone_number: initDataUnsafe?.user?.phone_number, // может быть недоступен
      });
    }

    window.Telegram.WebApp.ready();
  }, []);

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="app" style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Привет, {user.first_name}!</h1>
      {user.photo_url && (
        <img
          src={user.photo_url}
          alt="User"
          style={{ borderRadius: "50%", width: 100, height: 100 }}
        />
      )}
      <p>
        <strong>Имя:</strong> {user.first_name} {user.last_name}
      </p>
      <p>
        <strong>Username:</strong> @{user.username}
      </p>
      {user.phone_number && (
        <p>
          <strong>Телефон:</strong> {user.phone_number}
        </p>
      )}
      <p>
        <strong>ID:</strong> {user.id}
      </p>
    </div>
  );
}

export default App;
