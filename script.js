document.addEventListener('DOMContentLoaded', () => {
    const inputs = [
        'saat-ucreti', 'calisma-gun-saati', 'fazla-mesai-saati', 
        'gece-zammi', 'ulusal-bayram', 'dini-bayram', 
        'resmi-tatil', 'yol-ucreti', 'bes-kesintisi', 'vakif-kesintisi-yuzde'
    ];
    
    const elements = {};
    inputs.forEach(id => elements[id] = document.getElementById(id));
    elements.taxRate = document.getElementById('tax-rate');
    elements.month = document.getElementById('month');

    // 2026 Vergi İstisnaları
    const istisnalar2026 = {
        1: { gv: 4211.33, dv: 250.70 }, 2: { gv: 4211.33, dv: 250.70 },
        3: { gv: 4211.33, dv: 250.70 }, 4: { gv: 4211.33, dv: 250.70 },
        5: { gv: 4211.33, dv: 250.70 }, 6: { gv: 4211.33, dv: 250.70 },
        7: { gv: 4537.75, dv: 250.70 }, 
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

        // 1. Brüt Hesaplamaları
        const brutNormal = calismaSaati * saatUcreti;
        const brutFM = FM * saatUcreti * 2;
        const brutGece = gece * 22.81; 
        const brutBayram = (ulusal + dini + resmi) * saatUcreti * 2;
        const toplamBrut = brutNormal + brutFM + brutGece + brutBayram + yolBrut;

        // 2. İstisnalar
        const gvIstisna = istisnalar2026[ay].gv;
        const dvIstisna = istisnalar2026[ay].dv;

        // 3. Kesintiler
        const sgkIsci = toplamBrut * 0.14;
        const issizlikIsci = toplamBrut * 0.01;
        const sendikaAidati = saatUcreti * 7; 
        const vakifKesintisi = (brutNormal * vakifYuzde / 100);
        const besBrut = besNet / 0.85;

        // 4. Vergi ve Net Maaş
        const gvMatrahi = toplamBrut - sgkIsci - issizlikIsci - sendikaAidati - vakifKesintisi;
        const gvTutari = Math.max(0, (gvMatrahi * vergiOrani) - gvIstisna);
        const dvTutari = Math.max(0, (toplamBrut * 0.00759) - dvIstisna);
        const netMaas = toplamBrut - sgkIsci - issizlikIsci - gvTutari - dvTutari - vakifKesintisi - besNet - sendikaAidati;

        // 5. İkramiye Hesaplama (Seçili vergi dilimine Duyarlı)
        const ikrBrut = saatUcreti * 225;
        const ikrSGK = ikrBrut * 0.15;
        const ikrGV = (ikrBrut - ikrSGK) * vergiOrani;
        const ikrDV = ikrBrut * 0.00759;
        const ikrNet = ikrBrut - (ikrSGK + ikrGV + ikrDV);

        // Sonuçları Yazdır
        const fmt = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('sendika-ucreti').innerText = fmt(sendikaAidati);
        document.getElementById('vergi-istisnasi').innerText = fmt(gvIstisna + dvIstisna);
        document.getElementById('toplam-brut').innerText = fmt(toplamBrut);
        document.getElementById('bes-kesintisi-brut-sonuc').innerText = fmt(besBrut);
        document.getElementById('vakif-kesintisi-sonuc').innerText = fmt(vakifKesintisi);
        document.getElementById('net-ikramiye').innerText = fmt(ikrNet);
        document.getElementById('net-maas').innerText = fmt(netMaas > 0 ? netMaas : 0);
    }

    // Dinleyiciler
    Object.values(elements).forEach(el => el && el.addEventListener('input', hesapla));
    elements.taxRate.addEventListener('change', hesapla);
    elements.month.addEventListener('change', hesapla);
    
    hesapla(); // İlk açılışta çalıştır
});
