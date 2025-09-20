document.addEventListener('DOMContentLoaded', () => {
    const saatUcretiInput = document.getElementById('saat-ucreti');
    const calismaGunSaatiInput = document.getElementById('calisma-gun-saati');
    const fazlaMesaiSaatiInput = document.getElementById('fazla-mesai-saati');
    const geceZammiInput = document.getElementById('gece-zammi');
    const ulusalBayramInput = document.getElementById('ulusal-bayram');
    const diniBayramInput = document.getElementById('dini-bayram');
    const resmiTatilInput = document.getElementById('resmi-tatil');
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

    // 2025 yılı Gelir ve Damga Vergisi istisnaları (Sizin verdiğiniz tabloya göre)
    // Kaynak: 57086.jpg
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
        const yolUcreti = parseFloat(yolUcretiInput.value) || 0;
        const besKesintisi = parseFloat(besKesintisiInput.value) || 0;
        const vakifKesintisiYuzde = parseFloat(vakifKesintisiYuzdeInput.value) || 0;
        const taxRate = parseFloat(taxRateSelect.value);

        const currentMonth = parseInt(monthSelect.value);
        const currentYear = new Date().getFullYear();
        const calismaGunSayisi = getDaysInMonth(currentMonth, currentYear);
        
        // Sizin formülleriniz
        const sendikaUcreti = saatUcreti * 7;
        
        const brutFazlaMesai = fazlaMesaiSaati * saatUcreti * 2;
        const brutGeceZammi = geceZammi * 22.81;
        const brutUlusalBayram = ulusalBayram * saatUcreti * 2;
        const brutDiniBayram = diniBayram * saatUcreti * 3.5;
        const brutResmiTatil = resmiTatil * 3;
        
        const toplamBrut = (saatUcreti * calismaGunSaati) + brutFazlaMesai + brutGeceZammi + brutUlusalBayram + brutDiniBayram + brutResmiTatil + yolUcreti;
        
        const damgaVergisiOrani = 0.00759;
        const besKesintisiBrut = besKesintisi / (1 - damgaVergisiOrani);

        // Vakıf Kesintisi Formülü
        const vakifMatrahi = calismaGunSayisi * saatUcreti * 7.5;
        const vakifKesintisi = vakifMatrahi * (vakifKesintisiYuzde / 100);

        // Sigorta Matrahı formülü
        const sigortaMatrahi = toplamBrut - besKesintisiBrut;
        
        const sigortaIscilikOrani = 0.14;
        const issizlikOrani = 0.01;
        const sigortaSahis = sigortaMatrahi * sigortaIscilikOrani;
        const issizlikSahis = sigortaMatrahi * issizlikOrani;
        const damgaVergisi = toplamBrut * damgaVergisiOrani;
        
        // Vergi İstisnalarını seçilen aya göre belirleme
        const gvIstisna = vergiIstisnalari2025[currentMonth].gv;
        const dvIstisna = vergiIstisnalari2025[currentMonth].dv;
        const vergiIstisnasiToplam = gvIstisna + dvIstisna;

        const vergiMatrahi = toplamBrut - (sigortaSahis + issizlikSahis + sendikaUcreti + besKesintisiBrut + vakifKesintisi);
        let aylikVergi = vergiMatrahi * taxRate;
        
        // Vergi istisnası uygulanmış hali
        if (aylikVergi > gvIstisna) {
            aylikVergi = aylikVergi - gvIstisna;
        } else {
            aylikVergi = 0;
        }

        const netDamgaVergisi = (damgaVergisi > dvIstisna) ? (damgaVergisi - dvIstisna) : 0;

        const netMaas = toplamBrut - (sigortaSahis + issizlikSahis + aylikVergi + netDamgaVergisi + sendikaUcreti + besKesintisi + vakifKesintisi);
        
        sendikaUcretiSonuc.textContent = sendikaUcreti.toFixed(2);
        vergiIstisnasiSonuc.textContent = vergiIstisnasiToplam.toFixed(2);
        toplamBrutSonuc.textContent = toplamBrut.toFixed(2);
        besKesintisiSonuc.textContent = besKesintisiBrut.toFixed(2);
        vakifKesintisiSonuc.textContent = vakifKesintisi.toFixed(2);
        netIkramiyeSonuc.textContent = "0.00"; 
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
