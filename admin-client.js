(() => {
  const API = "/api";
  const status = document.getElementById("status");
  const form = document.getElementById("login-form");
  const editor = document.getElementById("editor");
  const textarea = document.getElementById("content-json");
  let token = "";

  function message(text, isError = false) {
    status.textContent = text;
    status.style.color = isError ? "#b91c1c" : "#166534";
  }
  async function getContent() {
    const response = await fetch(`${API}/content`, { cache: "no-store" });
    if (!response.ok) throw new Error("Güncel içerik alınamadı.");
    textarea.value = JSON.stringify(await response.json(), null, 2);
  }
  async function login(username, password) {
    const response = await fetch(`${API}/admin/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Giriş başarısız.");
    token = result.token;
    form.hidden = true;
    editor.style.display = "block";
    await getContent();
    message("Giriş başarılı. Düzenlemeleri kaydedince site ve uygulama yeni veriyi kullanır.");
  }
  if (form) {
    form.addEventListener("submit", async event => {
      event.preventDefault();
      message("Giriş kontrol ediliyor…");
      try {
        await login(document.getElementById("username").value, document.getElementById("password").value);
        document.getElementById("password").value = "";
      } catch (error) { message(error.message, true); }
    });
    document.getElementById("save-button").addEventListener("click", async () => {
      let content;
      try { content = JSON.parse(textarea.value); }
      catch (_) { message("JSON biçimi geçersiz. Virgül ve parantezleri kontrol edin.", true); return; }
      const button = document.getElementById("save-button");
      button.disabled = true;
      try {
        const response = await fetch(`${API}/admin/content`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(content)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Kaydetme başarısız.");
        textarea.value = JSON.stringify(result.data, null, 2);
        message("Kaydedildi ve yayınlandı. Site ve uygulama güncel veriyi bir sonraki yenilemede alır.");
      } catch (error) { message(error.message, true); }
      finally { button.disabled = false; }
    });
    document.getElementById("logout-button").addEventListener("click", () => {
      token = ""; editor.style.display = "none"; form.hidden = false;
      document.getElementById("password").value = "";
      message("Oturum kapatıldı.");
    });
  }

  window.initBordroAdminPanel = panel => {
    const loginForm = panel.querySelector("#app-login-form");
    const appEditor = panel.querySelector("#app-editor");
    const appTextarea = panel.querySelector("#app-content-json");
    const appStatus = panel.querySelector("#app-admin-status");
    const appMessage = (text, error = false) => {
      appStatus.textContent = text;
      appStatus.style.color = error ? "#b91c1c" : "#166534";
    };
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      appMessage("Giriş kontrol ediliyor…");
      try {
        const response = await fetch(`${API}/admin/login`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: panel.querySelector("#app-username").value,
            password: panel.querySelector("#app-password").value
          })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Giriş başarısız.");
        token = result.token;
        const dataResponse = await fetch(`${API}/content`, { cache: "no-store" });
        if (!dataResponse.ok) throw new Error("İçerik alınamadı.");
        const data = await dataResponse.json();
        appTextarea.value = JSON.stringify(data, null, 2);
        if (typeof window.applyRemoteContent === "function") window.applyRemoteContent(data);
        loginForm.hidden = true;
        appEditor.hidden = false;
        appMessage("Giriş başarılı. Kaydettiğiniz değişiklikler sitede ve uygulamada görünür.");
      } catch (error) { appMessage(error.message, true); }
    });
    panel.querySelector("#app-save-button").addEventListener("click", async () => {
      let content;
      try { content = JSON.parse(appTextarea.value); }
      catch (_) { appMessage("JSON biçimi geçersiz; kontrol edip tekrar deneyin.", true); return; }
      const button = panel.querySelector("#app-save-button");
      button.disabled = true;
      try {
        const response = await fetch(`${API}/admin/content`, {
          method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(content)
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Kaydetme başarısız.");
        appTextarea.value = JSON.stringify(result.data, null, 2);
        if (typeof window.applyRemoteContent === "function") window.applyRemoteContent(result.data);
        appMessage("Kaydedildi ve yayınlandı. Web sitesi de aynı veriyi kullanır.");
      } catch (error) { appMessage(error.message, true); }
      finally { button.disabled = false; }
    });
    panel.querySelector("#app-logout-button").addEventListener("click", () => {
      token = ""; appEditor.hidden = true; loginForm.hidden = false;
      panel.querySelector("#app-password").value = "";
      appMessage("Oturum kapatıldı.");
    });
  };
})();
