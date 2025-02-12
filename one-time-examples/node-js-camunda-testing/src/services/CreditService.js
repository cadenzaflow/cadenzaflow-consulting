class CreditService {
    getCreditScore() {
        return Math.floor(Math.random() * 100) + 1;
    }

    getCustomerExists() {
        return Math.random() < 0.2; // 80% false, 20% true
    }
}

module.exports = CreditService;