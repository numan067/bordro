document.addEventListener('DOMContentLoaded', () => {
    const saatUcretiInput = document.getElementById('saat-ucreti');
    const calismaGunSaatiInput = document.getElementById('calisma-gun-saati');
    const fazlaMesaiSaatiInput = document.getElementById('fazla-mesai-saati');
    const geceZammiInput = document.getElementById('gece-zammi');
    const ulusalBayramInput = document.getElementById('ulusal-bayram');
    const diniBayramInput = document.getElementById('dini-bayram');
    const resmiTatilInput = document.getElementById('resmi-tatil');
    const ikramiyeBrutInput = document.getElementById('ikramiye-brut');
    const yolUcretiInput = document.getElementById('yol-ucreti');
    const besKesintisiInput = document.getElementById('bes-kesintisi');
    const vakifKesintisiYuzdeInput = document.getElementById('vakif-kesintisi-yuzde');
    const taxRateSelect = document.getElementById('tax-rate');
    const monthSelect = document.getElementById('month');

    const sendikaUcretiSonuc = document.getElementById('sendika-ucreti');
    const toplamBrutSonuc = document.getElementById('toplam-brut');
    const besKesintisiSonuc = document.getElementById('bes-kesintisi-sonuc');
    const vakifKesintisiSonuc = document.getElementById('vakif-kesintisi-sonuc');
    const netIkramiyeSonuc = document.getElementById('net-ikramiye');
    const vergiIstisnasiSonuc = document.getElementById('vergi-istisnasi');
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
        10: { gv: 4420.93, dv: 197.38 },// Ekim
        11: { gv: 4420.93, dv: 197.38 },// Kasım
        12: { gv: 4420.93, dv: 197.38 }// Aralık
    };


    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    function calculateMaas() {
        const saatUcreti = parseFloat(saatUcretiInput.value) || 0;
        const calismaGunSaati = parseFloat(calismaGunSaatiInput.value) || 0;
        const fazlaMesaiSaati = parseFloat(fazlaMesaiSaatiInput.value) || 0;
        const geceZammi = parseFloat(geceZammiInput.value) || 0;
        const ulusalBayram = parseFloat(ulusalBayramInput.value) || 0;
        const diniBayram = parseFloat(diniBayramInput.value) || 0;
        const resmiTatil = parseFloat(resmiTatilInput.value) || 0;
        const ikramiyeBrut = parseFloat(ikramiyeBrutInput.value) || 0;
        const yolUcreti = parseFloat(yolUcretiInput.value) || 0;
        const besKesintisi = parseFloat(besKesintisiInput.value) || 0;
        const vakifKesintisiYuzde = parseFloat(vakifKesintisiYuzdeInput.value) || 0;
        const taxRate = parseFloat(taxRateSelect.value);

        const currentMonth = parseInt(monthSelect.value);
        const currentYear = new Date().getFullYear();
        const calismaGunSayisi = getDaysInMonth(currentMonth, currentYear);
        
        // Ortak kesinti oranları
        const sigortaIscilikOrani = 0.14;
        const issizlikOrani = 0.01;
        const damgaVergisiOrani = 0.00759;
        
        // Vergi İstisnaları
        const gvIstisna = vergiIstisnalari2025[currentMonth].gv;
        const dvIstisna = vergiIstisnalari2025[currentMonth].dv;
        const vergiIstisnasiToplam = gvIstisna + dvIstisna;

        // ** MAAŞ HESAPLAMASI (İkramiye hariç) **
        const brutCalismaUcreti = calismaGunSaati * 225;
        const brutFazlaMesai = fazlaMesaiSaati * saatUcreti * 2;
        const brutGeceZammi = geceZammi * 22.81;
        const brutUlusalBayram = ulusalBayram * saatUcreti * 2;
        const brutDiniBayram = diniBayram * saatUcreti * 3.5;
        const brutResmiTatil = resmiTatil * 3;
        
        const maasBrut = brutCalismaUcreti + brutFazlaMesai + brutGeceZammi + brutUlusalBayram + brutDiniBayram + brutResmiTatil + yolUcreti;
        
        const besKesintisiBrut = besKesintisi / (1 - damgaVergisiOrani);
        
        const vakifMatrahi = calismaGunSayisi * saatUcreti * 7.5;
        const vakifKesintisi = vakifMatrahi * (vakifKesintisiYuzde / 100);

        const maasSigortaMatrahi = maasBrut - besKesintisiBrut;
        
        const maasSigortaSahis = maasSigortaMatrahi * sigortaIscilikOrani;
        const maasIssizlikSahis = maasSigortaMatrahi * issizlikOrani;
        const maasDamgaVergisi = maasBrut * damgaVergisiOrani;
        const maasVergiMatrahi = maasBrut - (maasSigortaSahis + maasIssizlikSahis + sendikaUcreti + besKesintisiBrut + vakifKesintisi);
        
        let maasAylikVergi = maasVergiMatrahi * taxRate;
        if (maasAylikVergi > gvIstisna) {
            maasAylikVergi -= gvIstisna;
        } else {
            maasAylikVergi = 0;
        }

        const maasNetDamgaVergisi = (maasDamgaVergisi > dvIstisna) ? (maasDamgaVergisi - dvIstisna) : 0;
        
        const netMaas = maasBrut - (maasSigortaSahis + maasIssizlikSahis + maasAylikVergi + maasNetDamgaVergisi + sendikaUcreti + besKesintisi + vakifKesintisi);
        
        // ** İKRAMİYE HESAPLAMASI **
        const ikramiyeSigortaMatrahi = ikramiyeBrut;
        const ikramiyeSigortaSahis = ikramiyeSigortaMatrahi * sigortaIscilikOrani;
        const ikramiyeIssizlikSahis = ikramiyeSigortaMatrahi * issizlikOrani;
        const ikramiyeDamgaVergisi = ikramiyeBrut * damgaVergisiOrani;
        
        const ikramiyeVergiMatrahi = ikramiyeBrut - (ikramiyeSigortaSahis + ikramiyeIssizlikSahis);
        let ikramiyeAylikVergi = ikramiyeVergiMatrahi * taxRate;
        
        const netIkramiye = ikramiyeBrut - (ikramiyeSigortaSahis + ikramiyeIssizlikSahis + ikramiyeAylikVergi + ikramiyeDamgaVergisi);

        // ** TOPLAM SONUÇLAR **
        const sendikaUcreti = saatUcreti * 7;
        const toplamBrut = maasBrut + ikramiyeBrut;
        
        sendikaUcretiSonuc.textContent = sendikaUcreti.toFixed(2);
        vergiIstisnasiSonuc.textContent = vergiIstisnasiToplam.toFixed(2);
        toplamBrutSonuc.textContent = toplamBrut.toFixed(2);
        besKesintisiSonuc.textContent = besKesintisiBrut.toFixed(2);
        vakifKesintisiSonuc.textContent = vakifKesintisi.toFixed(2);
        netIkramiyeSonuc.textContent = netIkramiye.toFixed(2);
        netMaasSonuc.textContent = netMaas.toFixed(2);
    }

    const inputs = [
        saatUcretiInput,
        calismaGunSaatiInput,
        fazlaMesaiSaatiInput,
        geceZammiInput,
        ulusalBayramInput,
        diniBayramInput,
        resmiTatilInput,
        ikramiyeBrutInput,
        yolUcretiInput,
        besKesintisiInput,
        vakifKesintisiYuzdeInput,
        taxRateSelect,
        monthSelect
    ];
    
    inputs.forEach(input => {
        input.addEventListener('input', calculateMaas);
    });

    calculateMaas();
});
