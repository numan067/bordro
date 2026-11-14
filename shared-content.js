/* Pull the shared data from KV-backed Pages Functions and update static site tables. */
(async function () {
  try {
    const response = await fetch("/api/content", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    const socialBody = document.querySelector("[data-social-benefits]");
    if (socialBody && Array.isArray(data.socialBenefits)) {
      socialBody.replaceChildren();
      data.socialBenefits.forEach(item => {
        const row = document.createElement("tr");
        [item.name, item.year2025, item.year2026].forEach((value, index) => {
          const cell = document.createElement("td");
          cell.textContent = String(value ?? "");
          if (index === 0) cell.className = "col-name";
          if (index === 1) cell.className = "col-2025";
          if (index === 2) cell.className = "col-2026";
          row.appendChild(cell);
        });
        socialBody.appendChild(row);
      });
      const headers = document.querySelectorAll("table thead th");
      if (headers.length >= 3) {
        headers[1].textContent = String(data.inflation.year - 1);
        headers[2].textContent = String(data.inflation.year);
      }
    }

    const tbody = document.querySelector("[data-inflation-monthly]");
    if (tbody && Array.isArray(data.inflation.monthly)) {
      tbody.replaceChildren();
      const lastActual = data.inflation.monthly.findLastIndex(item => Number(item.rate) > 0);
      let cumulative = 1;
      data.inflation.monthly.forEach((item, index) => {
        const row = document.createElement("tr");
        const monthCell = document.createElement("td");
        const rateCell = document.createElement("td");
        const cumulativeCell = document.createElement("td");
        monthCell.textContent = `${item.month} ${data.inflation.year}`;
        rateCell.textContent = Number(item.rate) > 0 ? Number(item.rate).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-";
        if (Number(item.rate) > 0) {
          cumulative *= 1 + Number(item.rate) / 100;
          cumulativeCell.textContent = ((cumulative - 1) * 100).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else cumulativeCell.textContent = "-";
        if (index === lastActual) row.className = "highlight";
        row.append(monthCell, rateCell, cumulativeCell);
        tbody.appendChild(row);
      });
      const heading = document.querySelector("[data-inflation-title]");
      if (heading) heading.textContent = `${data.inflation.year} ENFLASYON TAKİBİ`;
    }

    const homeTable = document.querySelector("[data-home-inflation]");
    if (homeTable) {
      homeTable.replaceChildren();
      data.inflation.monthly.forEach(item => {
        const row = document.createElement("tr");
        const month = document.createElement("td");
        const rate = document.createElement("td");
        month.textContent = `${item.month} ${data.inflation.year}`;
        rate.textContent = Number(item.rate) > 0 ? `%${Number(item.rate).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-";
        row.append(month, rate);
        homeTable.appendChild(row);
      });
    }
  } catch (error) {
    console.info("Uzak veriler alınamadı; sayfadaki yedek veriler kullanılmaya devam ediyor.", error);
  }
})();
