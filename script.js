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

    const istisnalar2026 = {
        1: { gv: 4211.33, dv: 250.70 }, 2: { gv: 4211.33, dv: 250.70 },
        3: { gv: 4211.33, dv: 250.70 }, 4: { gv: 4211.33, dv: 250.70 },
        5: { gv: 4211.33, dv: 250.70 }, 6: { gv: 4211.33, dv: 250.70 },
        7: { gv: 4537.75, dv: 250.70 }, 
        8: { gv: 5615.10, dv: 250.70 }, 9: { gv: 5615.10, dv: 250.70 },
        10: { gv: 5615.10, dv: 250.70 }, 11: { gv: 5615.10, dv: 250.70 }, 12: { gv: 5615.10, dv: 250.70 }
    };

    // Ayın gün sayısına göre saati güncelleme fonksiyonu
    function guncelleAySaati() {
        const ay = parseInt(elements.month.value);
        const yil = 2026;
        // Ayın kaç çektiğini bul (0. gün bir önceki ayın son günüdür)
        const gunSayisi = new Date(yil, ay, 0).getDate();
        elements['calisma-gun-saati'].value = gunSayisi * 7.5;
        hesapla();
    }

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

        const gvIstisna = istisnalar2026[ay].gv;
        const dvIstisna = istisnalar2026[ay].dv;

        const brutNormal = calismaSaati * saatUcreti;
        const brutFM = FM * saatUcreti * 2;
        const brutGece = gece * 22.81; 
        const brutBayram = (ulusal + dini + resmi) * saatUcreti * 2;
        const toplamBrut = brutNormal + brutFM + brutGece + brutBayram + yolBrut;

        const sgkIsci = toplamBrut * 0.15; // SGK + İşsizlik
        const sendikaAidati = saatUcreti * 7; 
        const vakifKesintisi = (brutNormal * vakifYuzde / 100);
        const besBrut = besNet / 0.85;

        const gvMatrahi = toplamBrut - sgkIsci - sendikaAidati - vakifKesintisi;
        const gvTutari = Math.max(0, (gvMatrahi * vergiOrani) - gvIstisna);
        const dvTutari = Math.max(0, (toplamBrut * 0.00759) - dvIstisna);
        const netMaas = toplamBrut - sgkIsci - gvTutari - dvTutari - vakifKesintisi - besNet - sendikaAidati;

        const ikrBrut = saatUcreti * 225;
        const ikrNet = ikrBrut - (ikrBrut * 0.15 + (ikrBrut * 0.85 * vergiOrani) + (ikrBrut * 0.00759));

        const fmt = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('sendika-ucreti').innerText = fmt(sendikaAidati);
        document.getElementById('vergi-istisnasi').innerText = fmt(gvIstisna + dvIstisna);
        document.getElementById('toplam-brut').innerText = fmt(toplamBrut);
        document.getElementById('bes-kesintisi-brut-sonuc').innerText = fmt(besBrut);
        document.getElementById('vakif-kesintisi-sonuc').innerText = fmt(vakifKesintisi);
        document.getElementById('net-ikramiye').innerText = fmt(ikrNet);
        document.getElementById('net-maas').innerText = fmt(netMaas > 0 ? netMaas : 0);
    }

    // Olay Dinleyicileri
    Object.values(elements).forEach(el => el && el.addEventListener('input', hesapla));
    elements.taxRate.addEventListener('change', hesapla);
    // Ay değişince hem saati güncelle hem hesapla
    elements.month.addEventListener('change', guncelleAySaati);
    
    // İlk açılış ayarları
    guncelleAySaati(); 
});
