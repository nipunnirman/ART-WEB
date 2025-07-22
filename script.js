
const giftOptions = document.querySelectorAll('.gift-option');
const totalDisplay = document.getElementById('totalPrice');
let selectedItems = [];

function calculateTotal() {
  let total = 0;
  selectedItems = [];

  giftOptions.forEach(option => {
    if (option.type === 'checkbox' && option.checked) {
      total += parseInt(option.value);
      selectedItems.push({
        name: option.dataset.name,
        price: parseInt(option.value)
      });
    }
    if (option.tagName === 'SELECT' && option.value !== '0') {
      total += parseInt(option.value);
      const selectedOption = option.options[option.selectedIndex];
      selectedItems.push({
        name: option.dataset.name + ' - ' + selectedOption.dataset.item,
        price: parseInt(option.value)
      });
    }
  });

  totalDisplay.textContent = total;
}

function generateSummaryImage() {
  const canvas = document.getElementById('summaryCanvas');
  const ctx = canvas.getContext('2d');
  
  // Set canvas size
  canvas.width = 600;
  canvas.height = 400 + (selectedItems.length * 30);
  
  // Background
  ctx.fillStyle = '#f7f3ec';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Header
  ctx.fillStyle = '#3e3e3e';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🎁 Gift Box Summary', canvas.width/2, 40);
  
  // Date
  ctx.font = '14px Arial';
  ctx.fillText(new Date().toLocaleDateString(), canvas.width/2, 70);
  
  // Items
  ctx.textAlign = 'left';
  ctx.font = '16px Arial';
  let yPosition = 120;
  
  if (selectedItems.length === 0) {
    ctx.fillStyle = '#999';
    ctx.fillText('No items selected', 50, yPosition);
  } else {
    selectedItems.forEach((item, index) => {
      ctx.fillStyle = '#3e3e3e';
      ctx.fillText(`${index + 1}. ${item.name}`, 50, yPosition);
      ctx.fillStyle = '#a3b18a';
      ctx.textAlign = 'right';
      ctx.fillText(`Rs.${item.price}`, canvas.width - 50, yPosition);
      ctx.textAlign = 'left';
      yPosition += 30;
    });
    
    // Total
    yPosition += 20;
    ctx.strokeStyle = '#a3b18a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, yPosition);
    ctx.lineTo(canvas.width - 50, yPosition);
    ctx.stroke();
    
    yPosition += 30;
    ctx.fillStyle = '#3e3e3e';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('Total:', 50, yPosition);
    ctx.fillStyle = '#a3b18a';
    ctx.textAlign = 'right';
    ctx.fillText(`Rs.${totalDisplay.textContent}`, canvas.width - 50, yPosition);
    
    yPosition += 40;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.fillText('(Delivery & Packaging Free)', canvas.width/2, yPosition);
  }
  
  return canvas.toDataURL('image/png');
}

function downloadSummary() {
  const imageData = generateSummaryImage();
  const link = document.createElement('a');
  link.download = `gift-box-summary-${new Date().toISOString().split('T')[0]}.png`;
  link.href = imageData;
  link.click();
}

function sendToWhatsApp() {
  let message = "🎁 *Gift Box Selection Summary*\n\n";
  
  if (selectedItems.length === 0) {
    message += "No items selected yet.\n";
  } else {
    selectedItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} - Rs.${item.price}\n`;
    });
    message += `\n*Total: Rs.${totalDisplay.textContent}*\n`;
    message += "(Delivery & Packaging Free)\n\n";
  }
  
  message += "Please confirm my order and let me know the next steps! 😊";
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}

giftOptions.forEach(option => {
  option.addEventListener('change', calculateTotal);
});

// Initialize
calculateTotal();
