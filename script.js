document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['saat-ucreti', 'calisma-gun-saati', 'fazla-mesai-saati', 'gece-zammi', 'ulusal-bayram', 'dini-bayram', 'resmi-tatil', 'yol-ucreti', 'bes-kesintisi', 'vakif-kesintisi-yuzde'];
    const elements = {};
    inputs.forEach(id => elements[id] = document.getElementById(id));
    elements.taxRate = document.getElementById('tax-rate');
    elements.month = document.getElementById('month');

    // 2026 Vergi İstisnaları (Görseldeki tablodan alınmıştır)
    const istisnalar2026 = {
        1: { gv: 4211.33, dv: 250.70 }, 2: { gv: 4211.33, dv: 250.70 },
        3: { gv: 4211.33, dv: 250.70 }, 4: { gv: 4211.33, dv: 250.70 },
        5: { gv: 4211.33, dv: 250.70 }, 6: { gv: 4211.33, dv: 250.70 },
        7: { gv: 4537.75, dv: 250.70 }, // Temmuz güncellemesi
        8: { gv: 5615.10, dv: 250.70 }, 9: { gv: 5615.10, dv: 250.70 },
        10: { gv: 5615.10, dv: 250.70 }, 11: { gv: 5615.10, dv: 250.70 }, 12: { gv: 5615.10, dv: 250.70 }
    };

    function hesapla() {
        const val = (id) => parseFloat(elements[id].value) || 0;
        
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
        const vergiOrani = parseFloat(elements.taxRate.value);
        const ay = parseInt(elements.month.value);

        // İstisnalar
        const gvIstisna = istisnalar2026[ay].gv;
        const dvIstisna = istisnalar2026[ay].dv;

        // 1. Kazançlar (Sigorta Matrahı)
        const brutCalisma = calismaSaati * saatUcreti;
        const brutFM = FM * 2 * saatUcreti;
        const brutGece = gece * 22.81;
        const brutUlusal = ulusal * 2 * saatUcreti;
        const brutDini = dini * 3.5 * saatUcreti;
        const brutResmi = resmi * 3 * saatUcreti; // Standart kabul edilen çarpan
        
        const sigortaMatrahi = brutCalisma + brutFM + brutGece + brutUlusal + brutDini + brutResmi + yolBrut;

        // 2. Yan Hesaplamalar
        const sendikaAidati = saatUcreti * 7;
        const vakifKesintisi = (brutCalisma * vakifYuzde / 100);
        const besBrut = besNet / (1 - 0.00759);
        const damgaVergisiMatrahi = sigortaMatrahi + besBrut;

        // 3. Yasal Kesintiler
        const sigortaSahis = sigortaMatrahi * 0.14;
        const issizlikSahis = sigortaMatrahi * 0.01;
        const gvMatrahi = (sigortaMatrahi * 0.85) - vakifKesintisi - sendikaAidati;
        const gvTutari = Math.max(0, gvMatrahi * vergiOrani);
        const dvTutari = damgaVergisiMatrahi * 0.00759;
        
        const toplamYasalKesinti = sigortaSahis + issizlikSahis + gvTutari + dvTutari;

        // 4. Özel Kesinti Tutarı (Formül: (Bes Net x 2) + Vakıf + Sendika)
        const ozelKesintiTutari = (besNet * 2) + vakifKesintisi + sendikaAidati;

        // 5. Net Maaş (Formül: Damga Matrahı - Yasal Kesintiler - Özel Kesintiler + Vergi İstisnası)
        const netMaas = damgaVergisiMatrahi - toplamYasalKesinti - ozelKesintiTutari + (gvIstisna + dvIstisna);

        // 6. Otomatik İkramiye (Saat Ücreti x 225)
        const ikrBrut = saatUcreti * 225;
        const ikrSig = ikrBrut * 0.15;
        const ikrMatrah = ikrBrut - ikrSig;
        const ikrNet = ikrBrut - (ikrSig + (ikrMatrah * vergiOrani) + (ikrBrut * 0.00759));

        // Sonuçları Yazdır
        const fmt = (n) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('sendika-ucreti').innerText = fmt(sendikaAidati);
        document.getElementById('vergi-istisnasi').innerText = fmt(gvIstisna + dvIstisna);
        document.getElementById('toplam-brut').innerText = fmt(damgaVergisiMatrahi);
        document.getElementById('bes-kesintisi-brut-sonuc').innerText = fmt(besBrut);
        document.getElementById('vakif-kesintisi-sonuc').innerText = fmt(vakifKesintisi);
        document.getElementById('net-ikramiye').innerText = fmt(ikrNet);
        document.getElementById('net-maas').innerText = fmt(netMaas > 0 ? netMaas : 0);
    }

    [...Object.values(elements)].forEach(el => el.addEventListener('input', hesapla));
    hesapla(); // İlk açılışta temiz başla
});
