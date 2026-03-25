document.addEventListener('input', hesapla);
document.getElementById('month').addEventListener('change', hesapla);

function hesapla() {
    // Giriş Değerlerini Al
    const ay = parseInt(document.getElementById('month').value);
    const saatUcreti = parseFloat(document.getElementById('saat-ucreti').value) || 0;
    const calismaSaat = parseFloat(document.getElementById('calisma-gun-saati').value) || 0;
    const fazlaMesai = parseFloat(document.getElementById('fazla-mesai-saati').value) || 0;
    const geceZammi = parseFloat(document.getElementById('gece-zammi').value) || 0;
    const ulusalBayram = parseFloat(document.getElementById('ulusal-bayram').value) || 0;
    const diniBayram = parseFloat(document.getElementById('dini-bayram').value) || 0;
    const resmiTatil = parseFloat(document.getElementById('resmi-tatil').value) || 0;
    const yolUcreti = parseFloat(document.getElementById('yol-ucreti').value) || 0;
    const netBes = parseFloat(document.getElementById('bes-kesintisi').value) || 0;
    const vakifYuzde = parseFloat(document.getElementById('vakif-kesintisi-yuzde').value) || 10;
    const vergiOrani = parseFloat(document.getElementById('tax-rate').value) || 0.15;

    // 1. Brüt Kazanç Hesaplamaları
    const normalKazanc = saatUcreti * calismaSaat;
    const mesaiKazanc = fazlaMesai * saatUcreti * 1.5;
    const geceKazanc = geceZammi * saatUcreti * 0.15; // Örnek %15 gece zammı
    const bayramKazanc = (ulusalBayram + diniBayram + resmiTatil) * saatUcreti * 2;
    
    // Toplam Brüt
    const toplamBrut = normalKazanc + mesaiKazanc + geceKazanc + bayramKazanc + yolUcreti;

    // 2. Vergi İstisnaları (2026 Tablosuna Göre)
    let gelirVergisiIstisnasi = 4211.33; // Ocak - Haziran
    if (ay === 7) gelirVergisiIstisnasi = 4537.75; // Temmuz
    else if (ay > 7) gelirVergisiIstisnasi = 5615.10; // Ağustos - Aralık
    
    const damgaVergisiIstisnasi = 250.70; // Sabit

    // 3. Kesintiler
    const sgkIsci = toplamBrut * 0.14;
    const issizlikIsci = toplamBrut * 0.01;
    const vakifKesintisi = toplamBrut * (vakifYuzde / 100);
    const sendikaUcreti = saatUcreti * 1.5; // Örnek sendika kesintisi

    // 4. Vergi Hesaplama (Basitleştirilmiş)
    const gelirVergisiMatrahi = toplamBrut - sgkIsci - issizlikIsci;
    let hesaplananGelirVergisi = (gelirVergisiMatrahi * vergiOrani) - gelirVergisiIstisnasi;
    if (hesaplananGelirVergisi < 0) hesaplananGelirVergisi = 0;

    const damgaVergisi = (toplamBrut * 0.00759) - damgaVergisiIstisnasi;
    const netDamga = damgaVergisi < 0 ? 0 : damgaVergisi;

    // 5. İkramiye Hesabı (Net)
    const brutIkramiye = saatUcreti * 225;
    const netIkramiye = brutIkramiye * 0.70; // Yaklaşık net çarpanı

    // 6. BES Brütleştirme (Netten Brüte)
    const besBrut = netBes / 0.85;

    // 7. SONUÇ: Net Maaş
    const netMaas = toplamBrut - sgkIsci - issizlikIsci - hesaplananGelirVergisi - netDamga - vakifKesintisi - netBes - sendikaUcreti;

    // Ekrana Yazdır
    document.getElementById('sendika-ucreti').innerText = sendikaUcreti.toLocaleString('tr-TR', {minimumFractionDigits: 2});
    document.getElementById('vergi-istisnasi').innerText = gelirVergisiIstisnasi.toLocaleString('tr-TR', {minimumFractionDigits: 2});
    document.getElementById('toplam-brut').innerText = toplamBrut.toLocaleString('tr-TR', {minimumFractionDigits: 2});
    document.getElementById('bes-brut').innerText = besBrut.toLocaleString('tr-TR', {minimumFractionDigits: 2});
    document.getElementById('vakif-sonuc').innerText = vakifKesintisi.toLocaleString('tr-TR', {minimumFractionDigits: 2});
    document.getElementById('net-ikramiye').innerText = netIkramiye.toLocaleString('tr-TR', {minimumFractionDigits: 2});
    document.getElementById('net-maas').innerText = netMaas.toLocaleString('tr-TR', {minimumFractionDigits: 2});
}

// Sayfa yüklendiğinde ilk hesaplamayı yap
hesapla();
