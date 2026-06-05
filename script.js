/**
 * Genera un código corto aleatorio (4-6 caracteres)
 * @returns {string} Código corto alfanumérico
 */
function generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Genera una key con formato CRISS-MODZ-XXXXXXXX
 * @returns {string} Key formateado
 */
function generateKey() {
    const shortCode = generateShortCode();
    const key = `CRISS-MODZ-${shortCode}`;
    
    // Mostrar el contenedor de resultados
    const resultContainer = document.getElementById('resultContainer');
    const keyOutput = document.getElementById('keyOutput');
    
    keyOutput.value = key;
    resultContainer.style.display = 'block';
    
    // Animación suave
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Guardar en localStorage (opcional)
    saveKeyToHistory(key);
}

/**
 * Guarda la key en el historial local
 * @param {string} key - Key a guardar
 */
function saveKeyToHistory(key) {
    let history = JSON.parse(localStorage.getItem('keyHistory')) || [];
    history.unshift({
        key: key,
        timestamp: new Date().toISOString()
    });
    // Guardar solo las últimas 50 keys
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    localStorage.setItem('keyHistory', JSON.stringify(history));
}

/**
 * Copia el key al portapapeles
 */
function copyToClipboard() {
    const keyOutput = document.getElementById('keyOutput');
    const btnCopy = event.target.closest('.cyber-btn-copy');
    
    // Seleccionar el texto
    keyOutput.select();
    keyOutput.setSelectionRange(0, 99999);
    
    // Copiar al portapapeles
    document.execCommand('copy');
    
    // Feedback visual
    const originalText = btnCopy.innerHTML;
    btnCopy.innerHTML = '<span class="copy-glow"></span><span class="copy-text">✓ COPIADO</span>';
    btnCopy.style.borderColor = '#ffbe0b';
    btnCopy.style.boxShadow = '0 0 15px #ffbe0b';
    
    setTimeout(() => {
        btnCopy.innerHTML = originalText;
        btnCopy.style.borderColor = '';
        btnCopy.style.boxShadow = '';
    }, 2000);
}

/**
 * Reinicia el formulario y limpia los resultados
 */
function resetForm() {
    const resultContainer = document.getElementById('resultContainer');
    const keyOutput = document.getElementById('keyOutput');
    
    resultContainer.style.display = 'none';
    keyOutput.value = '';
    
    // Scroll hacia el botón de generar
    document.getElementById('generateBtn').focus();
}

/**
 * Manejo del Enter en inputs
 */
document.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        if (!document.getElementById('resultContainer').style.display || 
            document.getElementById('resultContainer').style.display === 'none') {
            generateKey();
        }
    }
});

/**
 * Descarga la key como QR
 */
function downloadQR() {
    const keyOutput = document.getElementById('keyOutput').value;
    if (!keyOutput) return;
    
    // Usar QR Server API (gratuito)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(keyOutput)}`;
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${keyOutput}.png`;
    link.click();
}

/**
 * Muestra el historial de keys
 */
function showHistory() {
    const history = JSON.parse(localStorage.getItem('keyHistory')) || [];
    if (history.length === 0) {
        alert('No hay keys generadas aún');
        return;
    }
    
    let historyText = 'HISTORIAL DE KEYS:\n\n';
    history.forEach((item, index) => {
        const date = new Date(item.timestamp).toLocaleString();
        historyText += `${index + 1}. ${item.key} (${date})\n`;
    });
    
    alert(historyText);
}

/**
 * Copia el key en formato JSON para API
 */
function copyAsJSON() {
    const keyOutput = document.getElementById('keyOutput').value;
    if (!keyOutput) return;
    
    const jsonData = JSON.stringify({
        key: keyOutput,
        timestamp: new Date().toISOString()
    }, null, 2);
    
    navigator.clipboard.writeText(jsonData).then(() => {
        alert('JSON copiado al portapapeles');
    });
}
