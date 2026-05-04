/**
 * 2026 Maaş Hesaplama Sistemi
 * Güncelleme: Gece Zammı Brüt 30 TL olarak ayarlandı.
 * Hazırlayan: Numan Özdemir
 */

const ayVerileri = {
    1: { gun: 31, gv: 4211.33, dv: 250.70 }, 2: { gun: 28, gv: 4211.33, dv: 250.70 },
    3: { gun: 31, gv: 4211.33, dv: 250.70 }, 4: { gun: 30, gv: 4211.33, dv: 250.70 },
    5: { gun: 31, gv: 4211.33, dv: 250.70 }, 6: { gun: 30, gv: 4211.33, dv: 250.70 },
    7: { gun: 31, gv: 4537.75, dv: 250.70 }, 8: { gun: 31, gv: 5615.10, dv: 250.70 },
    9: { gun: 30, gv: 5615.10, dv: 250.70 }, 10: { gun: 31, gv: 5615.10, dv: 250.70 },
    11: { gun: 30, gv: 5615.10, dv: 250.70 }, 12: { gun: 31, gv: 5615.10, dv: 250.70 }
};

function ayAyariYap() {
    const ay = document.getElementById('month').value;
    // Aylık çalışma saatini gün sayısına göre otomatik ayarla (Gün * 7.5)
    document.getElementById('calisma-gun-saati').value = ayVerileri[ay].gun * 7.5;
    hesapla();
}

function hesapla() {
    // Giriş verilerini al
    const su = parseFloat(document.getElementById('saat-ucreti').value) || 0;
    const gs = parseFloat(document.getElementById('calisma-gun-saati').value) || 0;
    const gz = parseFloat(document.getElementById('gece-zammi').value) || 0;
    const fm = parseFloat(document.getElementById('fm-100').value) || 0;
    const ul = parseFloat(document.getElementById('ulusal-100').value) || 0;
    const di = parseFloat(document.getElementById('dini-150').value) || 0;
    const re = parseFloat(document.getElementById('resmi-200').value) || 0;
    const yol = parseFloat(document.getElementById('yol-ucreti').value) || 0;
    const bes = parseFloat(document.getElementById('bes-kesintisi').value) || 0;
    const v_yuzde = parseFloat(document.getElementById('vakif-yuzde').value) || 0;
    const vo = parseFloat(document.getElementById('tax-rate').value);
    const ay = document.getElementById('month').value;
    
    // 1. BRÜT KALEMLERİ HESAPLAMA
    // Mesailer (Saat Ücreti üzerinden katlanarak)
    const mesaiBrut = ((fm + ul) * su * 2) + (di * su * 2.5) + (re * su * 3);
    
    // Gece Zammı (Brüt 30 TL sabit çarpan)
    const geceZammiBrut = gz * 30;
    
    // Toplam Brüt Kazanç
    const normalBrut = (su * gs) + geceZammiBrut + yol;
    let brut = normalBrut + mesaiBrut;

    // 2. YASAL KESİNTİLER (SGK ve İşsizlik)
    const sgk = brut * 0.14;
    const issizlik = brut * 0.01;
    const sendika = su * 7.00; // Sendika kesintisi: Saat Ücreti x 7
    
    // 3. VERGİ HESAPLAMA
    // Gelir Vergisi Matrahı
    const matrah = brut - sgk - issizlik - sendika;
    
    // Gelir Vergisi (İstisna tutarı düşülür)
    let gv = (matrah * vo) - ayVerileri[ay].gv;
    if (gv < 0) gv = 0;

    // Damga Vergisi (İstisna tutarı düşülür)
    let dv = (brut * 0.00759) - ayVerileri[ay].dv;
    if (dv < 0) dv = 0;

    // 4. ÖZEL KESİNTİLER
    // Vakıf Kesintisi (Brüt Maaş üzerinden yüzde hesabı)
    const vakifNetTutar = (su * gs / 100) * v_yuzde;

    // 5. NET MAAŞ SONUCU
    const net = brut - sgk - issizlik - gv - dv - sendika - vakifNetTutar - bes;
    
    // 6. İKRAMİYE HESAPLAMA (30 Günlük Sabit İkramiye)
    const ikrBrut = su * 30 * 7.5;
    const ikrSgk = ikrBrut * 0.14;
    const ikrIssizlik = ikrBrut * 0.01;
    const ikrMatrah = ikrBrut - ikrSgk - ikrIssizlik;
    const ikrGv = ikrMatrah * vo;
    const ikrDv = ikrBrut * 0.00759;
    const ikramiyeNet = ikrBrut - ikrSgk - ikrIssizlik - ikrGv - ikrDv;

    // Formatlama Fonksiyonu (Binlik ayracı ve 2 ondalık)
    const f = (n) => n.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    // Sonuçları HTML'e Yazdır
    document.getElementById('sendika-kesinti').innerText = f(sendika);
    document.getElementById('vergi-istisnasi').innerText = f(ayVerileri[ay].gv + ayVerileri[ay].dv);
    document.getElementById('vakif-net-tutar').innerText = f(vakifNetTutar);
    document.getElementById('net-ikramiye').innerText = f(ikramiyeNet);
    document.getElementById('net-maas').innerText = f(net) + " TL";
}

// Sayfa ilk açıldığında çalıştır
window.onload = ayAyariYap;
