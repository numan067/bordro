document.addEventListener('DOMContentLoaded', () => {
    const saatUcretiInput = document.getElementById('saat-ucreti');
    const calismaGunSaatiInput = document.getElementById('calisma-gun-saati');
    const fazlaMesaiSaatiInput = document.getElementById('fazla-mesai-saati');
    const geceZammiInput = document.getElementById('gece-zammi');
    const ulusalBayramInput = document.getElementById('ulusal-bayram');
    const diniBayramInput = document.getElementById('dini-bayram');
    const resmiTatilInput = document.getElementById('resmi-tatil');
    const yolUcretiInput = document.getElementById('yol-ucreti');
    const ikramiyeBrutInput = document.getElementById('ikramiye-brut');
    const besKesintisiInput = document.getElementById('bes-kesintisi');
    const vakifKesintisiInput = document.getElementById('vakif-kesintisi');
    const taxRateSelect = document.getElementById('tax-rate');
    const monthSelect = document.getElementById('month');

    const sendikaUcretiSonuc = document.getElementById('sendika-ucreti');
    const vergiIstisnasiSonuc = document.getElementById('vergi-istisnasi');
    const toplamBrutSonuc = document.getElementById('toplam-brut');
    const besKesintisiSonuc = document.getElementById('bes-kesintisi-sonuc');
    const vakifKesintisiSonuc = document.getElementById('vakif-kesintisi-sonuc');
    const netMaasSonuc = document.getElementById('net-maas');

    function calculateMaas() {
        const saatUcreti = parseFloat(saatUcretiInput.value) || 0;
        const calismaGunSaati = parseFloat(calismaGunSaatiInput.value) || 0;
        const fazlaMesaiSaati = parseFloat(fazlaMesaiSaatiInput.value) || 0;
        const geceZammi = parseFloat(geceZammiInput.value) || 0;
        const ulusalBayram = parseFloat(ulusalBayramInput.value) || 0;
        const diniBayram = parseFloat(diniBayramInput.value) || 0;
        const resmiTatil = parseFloat(resmiTatilInput.value) || 0;
        const yolUcreti = parseFloat(yolUcretiInput.value) || 0;
        const ikramiyeBrut = parseFloat(ikramiyeBrutInput.value) || 0;
        const besKesintisi = parseFloat(besKesintisiInput.value) || 0;
        const vakifKesintisiYuzde = parseFloat(vakifKesintisiInput.value) || 0;

        const taxRate = parseFloat(taxRateSelect.value);
        const month = parseInt(monthSelect.value);
        
        const sendikaOrani = 0.02;
        const sendikaUcreti = saatUcreti * calismaGunSaati * sendikaOrani;

        const brutFazlaMesai = fazlaMesaiSaati * saatUcreti * 1.5;
        const brutGeceZammi = geceZammi * saatUcreti * 0.15;
        const brutUlusalBayram = ulusalBayram * saatUcreti * 2;
        const brutDiniBayram = diniBayram * saatUcreti * 2;
        const brutResmiTatil = resmiTatil * saatUcreti * 1.5;
        
        // Önemli düzeltme: İkramiyeyi brüt toplama ekliyoruz
        const toplamBrut = (saatUcreti * calismaGunSaati) + brutFazlaMesai + brutGeceZammi + brutUlusalBayram + brutDiniBayram + brutResmiTatil + yolUcreti + ikramiyeBrut;
        
        const sigortaIscilikOrani = 0.14;
        const issizlikOrani = 0.01;
        const sigortaSahis = toplamBrut * sigortaIscilikOrani;
        const issizlikSahis = toplamBrut * issizlikOrani;
        const damgaVergisiOrani = 0.00759;
        const damgaVergisi = toplamBrut * damgaVergisiOrani;
        const besKesintisiBrut = besKesintisi / (1 - damgaVergisiOrani);
        
        const vakifKesintisi = (toplamBrut * vakifKesintisiYuzde) / 100;

        // Vergi Matrahını doğru Brüt Toplam üzerinden hesaplıyoruz
        const vergiMatrahi = toplamBrut - (sigortaSahis + issizlikSahis + sendikaUcreti + besKesintisiBrut + vakifKesintisi);
        const aylikVergi = vergiMatrahi * taxRate;

        // 2024 Vergi İstisnası tutarları
        const yemekVergiIstisnasi = 4420.94; 
        const yolVergiIstisnasi = 197.38;
        const vergiIstisnasiToplam = yemekVergiIstisnasi + yolVergiIstisnasi;
        
        const netMaas = toplamBrut - (sigortaSahis + issizlikSahis + aylikVergi + damgaVergisi + sendikaUcreti + besKesintisi + vakifKesintisi) + vergiIstisnasiToplam;
        
        sendikaUcretiSonuc.textContent = sendikaUcreti.toFixed(2);
        vergiIstisnasiSonuc.textContent = vergiIstisnasiToplam.toFixed(2);
        toplamBrutSonuc.textContent = toplamBrut.toFixed(2);
        besKesintisiSonuc.textContent = besKesintisiBrut.toFixed(2);
        vakifKesintisiSonuc.textContent = vakifKesintisi.toFixed(2);
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
        ikramiyeBrutInput,
        besKesintisiInput,
        vakifKesintisiInput,
        taxRateSelect,
        monthSelect
    ];
    
    inputs.forEach(input => {
        input.addEventListener('input', calculateMaas);
    });

    calculateMaas();
});
