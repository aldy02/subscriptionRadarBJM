export const generateInvoiceHTML = (transaction) => {
  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${transaction.invoice_number}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .invoice-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 30px;
        }
        .detail-section {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 5px;
        }
        .detail-section h3 {
          margin-top: 0;
          color: #2563eb;
        }
        .status-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-pending { 
          background-color: #fef3cd; 
          color: #8a6d3b; 
        }
        .status-accepted { 
          background-color: #d4edda; 
          color: #155724; 
        }
        .status-rejected { 
          background-color: #f8d7da; 
          color: #721c24; 
        }
        .period-info {
          background-color: #e3f2fd;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
        }
        .payment-info {
          margin-top: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 5px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { 
            margin: 0; 
          }
          .no-print { 
            display: none; 
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <h2>${transaction.invoice_number}</h2>
        <p>Tanggal: ${new Date(transaction.created_at).toLocaleString("id-ID")}</p>
      </div>

      <div class="invoice-details">
        <div class="detail-section">
          <h3>Informasi Transaksi</h3>
          <p><strong>Paket:</strong> ${
            transaction.type === "subscription"
              ? transaction.SubscriptionPlan?.name || "N/A"
              : transaction.Advertisement?.name || "Iklan"
          }</p>
          <p><strong>Type:</strong> ${transaction.type}</p>
          <p><strong>Status:</strong> 
            <span class="status-badge status-${transaction.status}">${transaction.status}</span>
          </p>
          <p><strong>Metode Pembayaran:</strong> ${transaction.payment_method.toUpperCase()}</p>
          ${
            transaction.UserSubscription
              ? `
            <div class="period-info">
              <p><strong>Masa Aktif Langganan:</strong></p>
              <p>${new Date(transaction.UserSubscription.start_date).toLocaleDateString("id-ID")} s/d ${new Date(transaction.UserSubscription.end_date).toLocaleDateString("id-ID")}</p>
            </div>
          `
              : ""
          }
          ${
            transaction.type === "advertisement" && transaction.AdvertisementContent
              ? `
            <div class="period-info">
              <p><strong>Durasi Tayang Iklan:</strong></p>
              <p>${new Date(transaction.AdvertisementContent.start_date).toLocaleDateString("id-ID")} s/d ${new Date(transaction.AdvertisementContent.end_date).toLocaleDateString("id-ID")}</p>
            </div>
          `
              : ""
          }
        </div>
        
        <div class="detail-section">
          <h3>Detail Pembayaran</h3>
          <p><strong>Total Harga:</strong></p>
          <h2 style="color: #2563eb; margin: 10px 0;">Rp${transaction.total_price.toLocaleString("id-ID")}</h2>
          ${
            transaction.admin_notes
              ? `<p><strong>Catatan Admin:</strong> ${transaction.admin_notes}</p>`
              : ""
          }
        </div>
      </div>

      ${
        transaction.proof_payment
          ? `
        <div class="payment-info">
          <h3>Bukti Pembayaran</h3>
          <p><strong>File:</strong> ${transaction.proof_payment}</p>
        </div>
      `
          : ""
      }

      <div class="footer">
        <p>Terima kasih atas kepercayaan Anda</p>
        <p>Dicetak pada: ${new Date().toLocaleString("id-ID")}</p>
      </div>
    </body>
    </html>
  `;
};

export const printInvoice = (transaction) => {
  const printWindow = window.open("", "_blank");
  const htmlContent = generateInvoiceHTML(transaction);

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};