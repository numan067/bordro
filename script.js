document.getElementById('hesaplaBtn').addEventListener('click', function() {
    const aySecimi = document.getElementById('aySecimi').value;
    const vergiDilimi = parseFloat(document.getElementById('vergiDilimi').value) / 100;

    const saatlikUcret = parseFloat(document.getElementById('saatlikUcret').value) || 0;
    const normalCalisma = parseFloat(document.getElementById('normalCalisma').value) || 0;
    const haftaIciMesai = parseFloat(document.getElementById('haftaIciMesai').value) || 0;
    const fazlaMesai = parseFloat(document.getElementById('fazlaMesai').value) || 0;
    const geceVardiyasi = parseFloat(document.getElementById('geceVardiyasi').value) || 0;
    const ulusalBayram = parseFloat(document.getElementById('ulusalBayram').value) || 0;
    const diniBayram = parseFloat(document.getElementById('diniBayram').value) || 0;
    const yolYardimi = parseFloat(document.getElementById('yolYardimi').value) || 0;
    const besKesintisi = parseFloat(document.getElementById('bes').value) || 0;
    const geceVardiyasiSaatlikBrut = parseFloat(document.getElementById('geceVardiyasiSaatlikBrut').value) || 0;

    // Brüt kazançları hesapla
    const normalMaas = saatlikUcret * normalCalisma;
    const haftaIciMesaiUcret = haftaIciMesai * saatlikUcret * 2; // İstediğiniz gibi 2 katı olarak düzeltildi.
    const fazlaMesaiUcret = fazlaMesai * saatlikUcret * 3;
    const geceVardiyasiUcret = geceVardiyasi * geceVardiyasiSaatlikBrut;
    const ulusalBayramUcret = ulusalBayram * saatlikUcret * 2;
    const diniBayramUcret = diniBayram * saatlikUcret * 3.5;
    
    // Toplam brüt maaşı hesapla
    const brutMaas = normalMaas + haftaIciMesaiUcret + fazlaMesaiUcret + geceVardiyasiUcret + ulusalBayramUcret + diniBayramUcret + yolYardimi;

    // Yasal Kesintiler
    const SGK_ORANI = 0.14;
    const ISSIZLIK_ORANI = 0.01;
    const DAMGA_VERGISI_ORANI = 0.00759;

    const sgkIsciPrimi = brutMaas * SGK_ORANI;
    const issizlikIsciPayi = brutMaas * ISSIZLIK_ORANI;

    // Sendika Aidatı Hesaplaması
    const sendikaAidati = saatlikUcret * 7;
    
    // Vergi istisnası (2025 yılına göre örnek)
    let gelirVergisiIstisna = 3315.70;
    let damgaVergisiIstisna = 197.38;

    switch (aySecimi) {
        case 'agustos':
            gelirVergisiIstisna = 4257.57;
            break;
        case 'eylul':
        case 'ekim':
        case 'kasim':
        case 'aralik':
            gelirVergisiIstisna = 4420.93;
            break;
    }

    // BES ve sendika aidatı vergi matrahından düşülüyor
    const gelirVergisiMatrahi = brutMaas - sgkIsciPrimi - issizlikIsciPayi - gelirVergisiIstisna - besKesintisi - sendikaAidati;
    const gelirVergisi = gelirVergisiMatrahi > 0 ? gelirVergisiMatrahi * vergiDilimi : 0;
    const damgaVergisi = (brutMaas - damgaVergisiIstisna) > 0 ? (brutMaas - damgaVergisiIstisna) * DAMGA_VERGISI_ORANI : 0;
    
    // İkramiye hesaplaması (30 günlük normal maaş üzerinden)
    const ikramiyeBrut = saatlikUcret * 30 * 8;
    const ikramiyeSGK = ikramiyeBrut * (SGK_ORANI + ISSIZLIK_ORANI);
    const ikramiyeGVMatrah = ikramiyeBrut - ikramiyeSGK - gelirVergisiIstisna;
    const ikramiyeGV = ikramiyeGVMatrah > 0 ? ikramiyeGVMatrah * vergiDilimi : 0;
    const ikramiyeDV = (ikramiyeBrut - damgaVergisiIstisna) > 0 ? (ikramiyeBrut - damgaVergisiIstisna) * DAMGA_VERGISI_ORANI : 0;
    const ikramiyeNet = ikramiyeBrut - ikramiyeSGK - ikramiyeGV - ikramiyeDV;

    // Toplam Kesintiler ve Net Maaş
    const toplamKesinti = sgkIsciPrimi + issizlikIsciPayi + gelirVergisi + damgaVergisi + sendikaAidati + besKesintisi;
    const netMaas = brutMaas - toplamKesinti;

    // Sonuçları ekrana yazdır
    document.getElementById('brutSonuc').textContent = brutMaas.toFixed(2) + ' TL';
    document.getElementById('sgkIsciPrimi').textContent = sgkIsciPrimi.toFixed(2) + ' TL';
    document.getElementById('issizlikIsci').textContent = issizlikIsciPayi.toFixed(2) + ' TL';
    document.getElementById('gvMatrahi').textContent = gelirVergisiMatrahi.toFixed(2) + ' TL';
    document.getElementById('gvSonuc').textContent = gelirVergisi.toFixed(2) + ' TL';
    document.getElementById('dvSonuc').textContent = damgaVergisi.toFixed(2) + ' TL';
    document.getElementById('sendikaSonuc').textContent = sendikaAidati.toFixed(2) + ' TL';
    document.getElementById('ikramiyeSonuc').textContent = ikramiyeNet.toFixed(2) + ' TL';
    document.getElementById('kesintiSonuc').textContent = toplamKesinti.toFixed(2) + ' TL';
    document.getElementById('netSonuc').textContent = netMaas.toFixed(2) + ' TL';
});