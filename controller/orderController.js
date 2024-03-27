const { getFirestore, collection, addDoc, getDocs, doc, getDoc } = require('firebase/firestore');
const firebase = require('../firebase.js');
// Inisialisasi Firestore
const db = getFirestore();

const orderController = {};

// Membuat Pesanan Baru
orderController.createOrder = async (req, res) => {
    try {
        // Mendapatkan tanggal dan waktu saat ini
        const now = new Date();
        const formattedTimestamp = [
            ('0' + now.getDate()).slice(-2), // Tambahkan '0' di depan dan ambil 2 digit terakhir untuk memastikan format dd
            ('0' + (now.getMonth() + 1)).slice(-2), // Bulan dimulai dari 0 di JavaScript
            now.getFullYear()
        ].join('-') + ' ' + [
            ('0' + now.getSeconds()).slice(-2),
            ('0' + now.getMinutes()).slice(-2),
            ('0' + now.getHours()).slice(-2)
        ].join(':');
        const { services, totalPrice, shippingAddress } = req.body;
        const ordersCollection = collection(db, "orders");
        const docRef = await addDoc(ordersCollection, {
            userId: req.user.id,
            services,
            totalPrice,
            shippingAddress,
            status: "Open",
            createdAt: formattedTimestamp
        });
        res.status(201).json({ code: 201, status: "Created", orderId: docRef.id });
    } catch (error) {
        res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};

// Mendapatkan Daftar Pesanan
orderController.getAllOrders = async (req, res) => {
    try {
        const ordersCollection = collection(db, "orders");
        const snapshot = await getDocs(ordersCollection);
        const ordersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ code: 200, status: "OK", orders: ordersList });
    } catch (error) {
        res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};

// Mengambil Detail Pesanan Berdasarkan ID
orderController.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.id;
        const orderDocRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(orderDocRef);
        if (!docSnap.exists()) {
            res.status(404).json({ code: 404, status: "Not Found", message: "Order not found" });
        } else {
            res.status(200).json({ code: 200, status: "OK", order: { id: docSnap.id, ...docSnap.data() } });
        }
    } catch (error) {
        res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
    }
};

module.exports = orderController;