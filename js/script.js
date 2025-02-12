let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

document.addEventListener('DOMContentLoaded', function () {
    updateUI(); // Load dữ liệu khi trang tải
});

function addTransaction() {
    const desc = document.getElementById('desc').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (!desc || isNaN(amount)) return alert('Vui lòng nhập đầy đủ thông tin');

    transactions.push({ desc, amount, type });
    updateUI();
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateUI() {
    const transactionList = document.getElementById('transactions');
    transactionList.innerHTML = ''; // Xóa danh sách cũ trước khi cập nhật

    transactions.forEach((transaction, index) => {
        const formattedAmount = transaction.amount.toLocaleString('vi-VN');
        const li = document.createElement('li');
        li.innerHTML = `${transaction.desc} - ${formattedAmount} VND (${transaction.type === 'income' ? 'Thu' : 'Chi'}) 
                        <button onclick="deleteTransaction(${index})">❌</button>`;
        transactionList.appendChild(li);
    });

    // Cập nhật tổng số dư
    const balance = transactions.reduce((acc, transaction) => {
        return transaction.type === 'income' ? acc + transaction.amount : acc - transaction.amount;
    }, 0);
    const formattedBalance = balance.toLocaleString('vi-VN');
    document.getElementById('balance').textContent = formattedBalance + ' VND';
    localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    function deleteTransaction(index) {
        if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
            transactions.splice(index, 1); // Xóa giao dịch tại vị trí index
            updateUI(); // Cập nhật giao diện
        }
    }
    function clearAllTransactions() {
        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử giao dịch?")) {
            transactions = []; // Xóa toàn bộ dữ liệu
            updateUI(); // Cập nhật giao diện
        }
    }
    

    function exportToJson() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "transactions.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }

    function exportToCsv() {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Mô tả,Số tiền,Loại\n"; // Tiêu đề cột
        transactions.forEach(({ desc, amount, type }) => {
            csvContent += `${desc},${amount},${type === 'income' ? 'Thu' : 'Chi'}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", encodedUri);
        downloadAnchor.setAttribute("download", "transactions.csv");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }
