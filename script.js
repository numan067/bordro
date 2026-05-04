/**
 * OYKA Kağıt Ambalaj 2026 Maaş Hesaplama Sistemi
 * Güncelleme: Gece Zammı Çarpanı 22.81 -> 30.00 olarak revize edildi.
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
    document.getElementById('calisma-gun-saati').value = ayVerileri[ay].gun * 7.5;
    hesapla();
}

function hesapla() {
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
    
    // --- KAZANÇLAR (Bordroya Uygun) ---
    const anaMaasBrut = su * gs;
    const mesaiBrut = ((fm + ul) * su * 2) + (di * su * 2.5) + (re * su * 3);
    
    // YENİ GECE ZAMMI HESABI (Bordrodaki Brüt Mantığı)
    const geceZammiBrut = gz * 30; 
    
    // Toplam Kazanç (Bordrodaki "Kazanç Toplamı")
    let kazancToplami = anaMaasBrut + mesaiBrut + geceZammiBrut + yol;

    // --- YASAL KESİNTİLER ---
    const sgk = kazancToplami * 0.14;
    const issizlik = kazancToplami * 0.01;
    
    // Sendika Kesintisi (Bordrodaki Oyka_Sendika (7,00) mantığı: Saat Ücreti x 7)
    const sendika = su * 7.00; 
    
    // --- VERGİ HESABI ---
    const gvMatrahi = kazancToplami - sgk - issizlik - sendika;
    
    // Gelir Vergisi (İstisna dahil)
    let gv = (gvMatrahi * vo) - ayVerileri[ay].gv;
    if (gv < 0) gv = 0;

    // Damga Vergisi (İstisna dahil)
    let dv = (kazancToplami * 0.00759) - ayVerileri[ay].dv;
    if (dv < 0) dv = 0;

    // --- ÖZEL KESİNTİLER ---
    const vakifNetTutar = (anaMaasBrut / 100) * v_yuzde;
    // Toplam Kesinti (Yasal + Özel)
    const toplamKesinti = sgk + issizlik + sendika + gv + dv + vakifNetTutar + bes;

    // --- NET ÖDENEN ---
    const netMaas = kazancToplami - toplamKesinti;
    
    // --- İKRAMİYE (30 Günlük) ---
    const ikrBrut = su * 30 * 7.5;
    const ikrSgk = ikrBrut * 0.14;
    const ikrIssizlik = ikrBrut * 0.01;
    const ikrGv = (ikrBrut - ikrSgk - ikrIssizlik) * vo;
    const ikrDv = ikrBrut * 0.00759;
    const ikramiyeNet = ikrBrut - ikrSgk - ikrIssizlik - ikrGv - ikrDv;

    // Formatlama
    const f = (n) => n.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2});

    document.getElementById('sendika-kesinti').innerText = f(sendika);
    document.getElementById('vergi-istisnasi').innerText = f(ayVerileri[ay].gv + ayVerileri[ay].dv);
    document.getElementById('vakif-net-tutar').innerText = f(vakifNetTutar);
    document.getElementById('net-ikramiye').innerText = f(ikramiyeNet);
    document.getElementById('net-maas').innerText = f(netMaas) + " TL";
}

window.onload = ayAyariYap;
