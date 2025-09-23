document.addEventListener('DOMContentLoaded', () => {
    const saatUcretiInput = document.getElementById('saat-ucreti');
    const calismaGunSaatiInput = document.getElementById('calisma-gun-saati');
    const fazlaMesaiSaatiInput = document.getElementById('fazla-mesai-saati');
    const geceZammiInput = document.getElementById('gece-zammi');
    const ulusalBayramInput = document.getElementById('ulusal-bayram');
    const diniBayramInput = document.getElementById('dini-bayram');
    const resmiTatilInput = document.getElementById('resmi-tatil');
    const yolUcretiInput = document.getElementById('yol-ucreti');
    const besKesintisiNetInput = document.getElementById('bes-kesintisi');
    const vakifKesintisiYuzdeInput = document.getElementById('vakif-kesintisi-yuzde');
    const taxRateSelect = document.getElementById('tax-rate');
    const monthSelect = document.getElementById('month');

    // Çıktı alanları
    const sendikaUcretiSonuc = document.getElementById('sendika-ucreti');
    const vergiIstisnasiSonuc = document.getElementById('vergi-istisnasi');
    const toplamBrutSonuc = document.getElementById('toplam-brut');
    const besKesintisiBrutSonuc = document.getElementById('bes-kesintisi-brut-sonuc');
    const vakifKesintisiSonuc = document.getElementById('vakif-kesintisi-sonuc');
    const netIkramiyeSonuc = document.getElementById('net-ikramiye');
    const netMaasSonuc = document.getElementById('net-maas');

    const vergiIstisnalari2025 = {
        1: { gv: 3315.70, dv: 197.38 }, // Ocak
        2: { gv: 3315.70, dv: 197.38 }, // Şubat
        3: { gv: 3315.70, dv: 197.38 }, // Mart
        4: { gv: 3315.70, dv: 197.38 }, // Nisan
        5: { gv: 3315.70, dv: 197.38 }, // Mayıs
        6: { gv: 3315.70, dv: 197.38 }, // Haziran
        7: { gv: 3315.70, dv: 197.38 }, // Temmuz
        8: { gv: 4257.57, dv: 197.38 }, // Ağustos
        9: { gv: 4420.93, dv: 197.38 }, // Eylül
        10: { gv: 4420.93, dv: 197.38 }, // Ekim
        11: { gv: 4420.93, dv: 197.38 }, // Kasım
        12: { gv: 4420.93, dv: 197.38 }  // Aralık
    };


    function calculateMaas() {
        const saatUcreti = parseFloat(saatUcretiInput.value) || 0;
        const calismaGunSaati = parseFloat(calismaGunSaatiInput.value) || 0;
        const fazlaMesaiSaati = parseFloat(fazlaMesaiSaatiInput.value) || 0;
        const geceZammi = parseFloat(geceZammiInput.value) || 0;
        const ulusalBayram = parseFloat(ulusalBayramInput.value) || 0;
        const diniBayram = parseFloat(diniBayramInput.value) || 0;
        const resmiTatil = parseFloat(resmiTatilInput.value) || 0;
        const yolUcreti = parseFloat(yolUcretiInput.value) || 0;
        const besKesintisiNet = parseFloat(besKesintisiNetInput.value) || 0;
        const vakifKesintisiYuzde = parseFloat(vakifKesintisiYuzdeInput.value) || 0;
        const taxRate = parseFloat(taxRateSelect.value);

        const currentMonth = parseInt(monthSelect.value);
        
        const damgaVergisiOrani = 0.00759;
        
        const gvIstisna = vergiIstisnalari2025[currentMonth].gv;
        const dvIstisna = vergiIstisnalari2025[currentMonth].dv;
        const vergiIstisnasiToplam = gvIstisna + dvIstisna;

        // ** MAAŞ HESAPLAMASI (Sizin Sağladığınız Formüllere Göre) **
        const brutCalismaUcreti = calismaGunSaati * saatUcreti;
        const brutFazlaMesai = fazlaMesaiSaati * 2 * saatUcreti;
        const brutGeceZammi = geceZammi * 22.81;
        const brutUlusalBayram = ulusalBayram * 2 * saatUcreti; 
        const brutDiniBayram = diniBayram * 3.5 * saatUcreti;
        const brutResmiTatil = resmiTatil * 3;
        
        const sigortaMatrahi = brutCalismaUcreti + brutFazlaMesai + brutGeceZammi + brutUlusalBayram + brutDiniBayram + brutResmiTatil;
        
        const sendikaAidati = saatUcreti * 7;
        const vakifKesintisi = (brutCalismaUcreti * (vakifKesintisiYuzde / 100));
        const besKesintisiBrut = besKesintisiNet / (1 - damgaVergisiOrani);
        
        const damgaVergisiMatrahi = sigortaMatrahi + besKesintisiBrut;
        
        const sigortaSahisTutari = sigortaMatrahi * 0.14;
        const issizlikSahisTutari = sigortaMatrahi * 0.01;
        
        const gelirVergisiMatrahi = (sigortaMatrahi * 0.85) - vakifKesintisi - sendikaAidati;
        const gelirVergisiTutari = (gelirVergisiMatrahi * taxRate);

        const damgaVergisiTutari = damgaVergisiMatrahi * 0.00759;
        
        const yasalKesintiler = sigortaSahisTutari + issizlikSahisTutari + gelirVergisiTutari + damgaVergisiTutari;

        const ozelKesintiTutari = (besKesintisiNet * 2) + vakifKesintisi + sendikaAidati;

        const netMaas = damgaVergisiMatrahi - yasalKesintiler - ozelKesintiTutari + vergiIstisnasiToplam;
        
        // ** YALNIZCA İKRAMİYE HESAPLAMASI **
        const ikramiyeBrut = saatUcreti * 225;
        const ikramiyeSigortaSahis = ikramiyeBrut * 0.14;
        const ikramiyeIssizlikSahis = ikramiyeBrut * 0.01;
        const ikramiyeDamgaVergisi = ikramiyeBrut * 0.00759;
        const ikramiyeVergiMatrahi = ikramiyeBrut - (ikramiyeSigortaSahis + ikramiyeIssizlikSahis);
        let ikramiyeAylikVergi = ikramiyeVergiMatrahi * taxRate;
        const netIkramiye = ikramiyeBrut - (ikramiyeSigortaSahis + ikramiyeIssizlikSahis + ikramiyeAylikVergi + ikramiyeDamgaVergisi);

        // ** EKRAN SONUÇLARI **
        sendikaUcretiSonuc.textContent = sendikaAidati.toFixed(2);
        vergiIstisnasiSonuc.textContent = vergiIstisnasiToplam.toFixed(2);
        toplamBrutSonuc.textContent = damgaVergisiMatrahi.toFixed(2);
        besKesintisiBrutSonuc.textContent = besKesintisiBrut.toFixed(2);
        vakifKesintisiSonuc.textContent = vakifKesintisi.toFixed(2);
        netIkramiyeSonuc.textContent = netIkramiye.toFixed(2);
        netMaasSonuc.textContent = netMaas.toFixed(2);
    }

    const inputs = [
        saatUcretiInput, calismaGunSaatiInput, fazlaMesaiSaatiInput, geceZammiInput, ulusalBayramInput,
        diniBayramInput, resmiTatilInput, yolUcretiInput, besKesintisiNetInput,
        vakifKesintisiYuzdeInput, taxRateSelect, monthSelect
    ];
    
    inputs.forEach(input => {
        input.addEventListener('input', calculateMaas);
    });

    calculateMaas();
});
