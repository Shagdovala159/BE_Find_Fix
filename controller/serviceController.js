const { getDoc,doc,getFirestore, collection, addDoc, updateDoc ,getDocs} = require('firebase/firestore');
const { getStorage, ref, uploadString,uploadBytes,getDownloadURL } = require('firebase/storage');
// Inisialisasi Firebase
const db = getFirestore();
const firebase = require('../firebase.js');
const storage = getStorage(firebase);

const serviceController = {};

serviceController.createService = async (req, res) => {
  try {
    // Extracting text fields from the request body
    const { title,provider, description, price } = req.body;
    // The image file will be in req.file due to multer
    const imageFile = req.file;
    // Add service data to Firestore
    const servicesCollection = collection(db, "services");
    const docRef = await addDoc(servicesCollection, {
      title,
      provider,
      description,
      price,
      //imageUrl: "", // Placeholder for the image URL, will update after upload
    });

    // Upload image to Firebase Storage if it exists
    if (imageFile) {
      const imageRef = ref(storage, `services/${docRef.id}/image.jpg`);
      const imageSnapshot = await uploadBytes(imageRef, imageFile.buffer);
      const imageUrl = await getDownloadURL(imageSnapshot.ref);
      console.log(imageUrl);

      // Update Firestore document with the image URL
      await updateDoc(docRef, { imageUrl });
    }

    res.status(201).json({ code: 201, status: "Created", serviceId: docRef.imageUrl });
    // res.status(400).json({ code: 400, status: "Bad Request", message: "halo" });
  } catch (error) {
    res.status(400).json({ code: 400, status: "Bad Request", message: error.message });
  }
};

serviceController.getAllServices = async (req, res) => {
  try {
    const servicesCollection = collection(db, "services");
    const snapshot = await getDocs(servicesCollection);
    const servicesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(req.user);
    res.status(200).json({ code: 200, status: "OK", services: servicesList });
  } catch (error) {
    res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
  }
};

serviceController.getServiceById = async (req, res) => {
  try {
    const serviceId = req.params.id; // Getting the ID from the request parameters
    const serviceDocRef = doc(db, "services", serviceId); // Reference to the service document
    const docSnap = await getDoc(serviceDocRef);

    if (!docSnap.exists()) {
      // If the document does not exist, send a 404 response
      res.status(404).json({ code: 404, status: "Not Found", message: "Service not found" });
    } else {
      // If the document exists, send its data
      res.status(200).json({ code: 200, status: "OK", service: { id: docSnap.id, ...docSnap.data() } });
    }
  } catch (error) {
    res.status(500).json({ code: 500, status: "Internal Server Error", message: error.message });
  }
};

module.exports = serviceController;