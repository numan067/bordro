document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"], select');
    const saatUcretiInput = document.getElementById('saat-ucreti');
    const calismaGunSaatiInput = document.getElementById('calisma-gun-saati');
    const fazlaMesaiSaatiInput = document.getElementById('fazla-mesai-saati');
    const geceZammiInput = document.getElementById('gece-zammi');
    const ulusalBayramInput = document.getElementById('ulusal-bayram');
    const diniBayramInput = document.getElementById('dini-bayram');
    const resmiTatilInput = document.getElementById('resmi-tatil');
    const yolUcretiInput = document.getElementById('yol-ucreti');
    const besBrutInput = document.getElementById('bes-brut');
    const taxRateSelect = document.getElementById('tax-rate');
    const monthSelect = document.getElementById('month');

    const sendikaUcretiEl = document.getElementById('sendika-ucreti');
    const vergiIstisnasiEl = document.getElementById('vergi-istisnasi');
    const ikramiyeEl = document.getElementById('ikramiye');
    const netMaasEl = document.getElementById('net-maas');

    // 2025 yılına ait vergi istisnası değerleri (Gelir Vergisi + Damga Vergisi)
    const taxExemptionValues = {
        1: 3315.70 + 197.38, 
        2: 3315.70 + 197.38, 
        3: 3315.70 + 197.38, 
        4: 3315.70 + 197.38, 
        5: 3315.70 + 197.38, 
        6: 3315.70 + 197.38, 
        7: 3315.70 + 197.38, 
        8: 4257.57 + 197.38, 
        9: 4420.94 + 197.38, 
        10: 4420.94 + 197.38, 
        11: 4420.94 + 197.38, 
        12: 4420.94 + 197.38  
    };

    function calculateSalary() {
        const saatUcreti = parseFloat(saatUcretiInput.value) || 0;
        const calismaGunSaati = parseFloat(calismaGunSaatiInput.value) || 0;
        const fazlaMesaiSaati = parseFloat(fazlaMesaiSaatiInput.value) || 0;
        const geceZammi = parseFloat(geceZammiInput.value) || 0;
        const ulusalBayram = parseFloat(ulusalBayramInput.value) || 0;
        const diniBayram = parseFloat(diniBayramInput.value) || 0;
        const resmiTatil = parseFloat(resmiTatilInput.value) || 0;
        const yolUcreti = parseFloat(yolUcretiInput.value) || 0;
        const besBrut = parseFloat(besBrutInput.value) || 0;
        const taxRate = parseFloat(taxRateSelect.value) || 0;
        const selectedMonth = parseInt(monthSelect.value);

        // Brüt Maaş Hesaplaması (İkramiye hariç)
        const normalCalisma = saatUcreti * calismaGunSaati;
        const fazlaMesaiBrut = fazlaMesaiSaati * 2 * saatUcreti; 
        const geceVardiyasiBrut = geceZammi * 22.81;
        const ulusalBayramBrut = ulusalBayram * 2 * saatUcreti;
        const diniBayramBrut = diniBayram * 2 * saatUcreti;
        const resmiTatilBrut = resmiTatil * saatUcreti;
        
        const brut = normalCalisma + fazlaMesaiBrut + geceVardiyasiBrut + ulusalBayramBrut + diniBayramBrut + resmiTatilBrut + yolUcreti;
        
        // Kesintiler ve Vergi Hesaplaması
        const sendikaUcreti = saatUcreti * 7;
        const sigortaSahisTutari = brut * 0.14;
        const issizlikSahisTutari = brut * 0.01;
        const damgaVergisi = brut * 0.00759;
        
        const vergiMatrahi = brut - sigortaSahisTutari - issizlikSahisTutari - sendikaUcreti - besBrut;
        
        const aylikVergi = vergiMatrahi * taxRate;

        const toplamKesinti = sigortaSahisTutari + issizlikSahisTutari + aylikVergi + damgaVergisi + besBrut + sendikaUcreti;

        const vergiIstisnasi = taxExemptionValues[selectedMonth];
        
        const netMaas = brut - toplamKesinti + vergiIstisnasi;

        // İkramiye Hesaplaması (Ayrı ve normal bordro kesintileriyle)
        const ikramiyeBrut = saatUcreti * 225;
        const ikramiyeSGK = ikramiyeBrut * 0.14;
        const ikramiyeIssizlik = ikramiyeBrut * 0.01;
        const ikramiyeDamga = ikramiyeBrut * 0.00759;
        const ikramiyeVergiMatrahi = ikramiyeBrut - ikramiyeSGK - ikramiyeIssizlik;
        const ikramiyeVergi = ikramiyeVergiMatrahi * taxRate;
        
        const ikramiyeNet = ikramiyeBrut - ikramiyeSGK - ikramiyeIssizlik - ikramiyeDamga - ikramiyeVergi;


        // Sonuçları ekrana yazdır
        sendikaUcretiEl.textContent = sendikaUcreti.toFixed(2);
        vergiIstisnasiEl.textContent = vergiIstisnasi.toFixed(2);
        ikramiyeEl.textContent = ikramiyeNet.toFixed(2);
        netMaasEl.textContent = netMaas.toFixed(2);
    }

    inputs.forEach(input => {
        input.addEventListener('input', calculateSalary);
    });

    calculateSalary();
});