document.addEventListener('DOMContentLoaded', () => {
    // Giriş alanlarını tanımla
    const inputs = [
        'saat-ucreti', 'calisma-gun-saati', 'fazla-mesai-saati', 
        'gece-zammi', 'ulusal-bayram', 'dini-bayram', 
        'resmi-tatil', 'yol-ucreti', 'bes-kesintisi', 'vakif-kesintisi-yuzde'
    ];
    
    const elements = {};
    inputs.forEach(id => {
        elements[id] = document.getElementById(id);
    });
    
    elements.taxRate = document.getElementById('tax-rate');
    elements.month = document.getElementById('month');

    // 2026 Vergi İstisnaları
    const istisnalar2026 = {
        1: { gv: 4211.33, dv: 250.70 }, 2: { gv: 4211.33, dv: 250.70 },
        3: { gv: 4211.33, dv: 250.70 }, 4: { gv: 4211.33, dv: 250.70 },
        5: { gv: 4211.33, dv: 250.70 }, 6: { gv: 4211.33, dv: 250.70 },
        7: { gv: 4537.75, dv: 250.70 }, // Temmuz
        8: { gv: 5615.10, dv: 250.70 }, 9: { gv: 5615.10, dv: 250.70 },
        10: { gv: 5615.10, dv: 250.70 }, 11: { gv: 5615.10, dv: 250.70 }, 12: { gv: 5615.10, dv: 250.70 }
    };

    function hesapla() {
        const val = (id) => parseFloat(elements[id]?.value) || 0;
        
        const saatUcreti = val('saat-ucreti');
        const calismaSaati = val('calisma-gun-saati');
        const FM = val('fazla-mesai-saati');
        const gece = val('gece-zammi');
        const ulusal = val('ulusal-bayram');
        const dini = val('dini-bayram');
        const resmi = val('resmi-tatil');
        const yolBrut = val('yol-ucreti');
        const besNet = val('bes-kesintisi');
        const vakifYuzde = val('vakif-kesintisi-yuzde');
        const vergiOrani = parseFloat(elements.taxRate.value) || 0.15;
        const ay = parseInt(elements.month.value) || 1;

        // İstisnalar
        const gvIstisna = istisnalar2026[ay].gv;
        const dvIstisna = istisnalar2026[ay].dv;

        // 1. Kazançlar
        const brutCalisma = calismaSaati * saatUcreti;
        const brutFM = FM * 2 * saatUcreti; // %100 mesai varsayımı
        const brutGece = gece * 22.81; // Gece tazminatı sabit
        const brutUlusal = ulusal * 2 * saatUcreti;
        const brutDini = dini * 2 * saatUcreti;
        const brutResmi = resmi * 2 * saatUcreti;
        
        const toplamBrut = brutCalisma + brutFM + brutGece + brutUlusal + brutDini + brutResmi + yolBrut;

        // 2. Kesintiler
        const sendikaAidati = saatUcreti * 1.5; // Örnek çarpan
        const vakifKesintisi = (brutCalisma * vakifYuzde / 100);
        const besBrut = besNet / 0.85; // %15 vergi avantajı ile brütleştirme

        // 3. Yasal Kesintiler (SGK + İşsizlik %15)
        const sgkIsci = toplamBrut * 0.14;
        const issizlikIsci = toplamBrut * 0.01;
        
        // Vergi Hesaplama
        const gvMatrahi = toplamBrut - sgkIsci - issizlikIsci;
        const gvTutari = Math.max(0, (gvMatrahi * vergiOrani) - gvIstisna);
        const dvTutari = Math.max(0, (toplamBrut * 0.00759) - dvIstisna);

        // 4. Net Maaş
        const netMaas = toplamBrut - sgkIsci - issizlikIsci - gvTutari - dvTutari - vakifKesintisi - besNet - sendikaAidati;

        // 5. İkramiye (Saat Ücreti x 225 üzerinden yaklaşık net)
        const ikrBrut = saatUcreti * 225;
        const ikrNet = ikrBrut * 0.72; // Vergi/SGK sonrası yaklaşık net

        // Sonuçları Yazdır
        const fmt = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        
        if(document.getElementById('sendika-ucreti')) document.getElementById('sendika-ucreti').innerText = fmt(sendikaAidati);
        if(document.getElementById('vergi-istisnasi')) document.getElementById('vergi-istisnasi').innerText = fmt(gvIstisna + dvIstisna);
        if(document.getElementById('toplam-brut')) document.getElementById('toplam-brut').innerText = fmt(toplamBrut);
        if(document.getElementById('bes-kesintisi-brut-sonuc')) document.getElementById('bes-kesintisi-brut-sonuc').innerText = fmt(besBrut);
        if(document.getElementById('vakif-kesintisi-sonuc')) document.getElementById('vakif-kesintisi-sonuc').innerText = fmt(vakifKesintisi);
        if(document.getElementById('net-ikramiye')) document.getElementById('net-ikramiye').innerText = fmt(ikrNet);
        if(document.getElementById('net-maas')) document.getElementById('net-maas').innerText = fmt(netMaas > 0 ? netMaas : 0);
    }

    // Tüm inputlara dinleyici ekle
    Object.values(elements).forEach(el => {
        if(el) el.addEventListener('input', hesapla);
    });
    
    // İlk açılışta hesapla
    hesapla();
});
