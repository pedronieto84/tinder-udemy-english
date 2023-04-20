const functions = require("firebase-functions");
// Import the Admin Library
const admin = require('firebase-admin');

// We initialize the admin library
admin.initializeApp();

// From the admin library, we invoke the firestore module
const firestore = admin.firestore();

 exports.get = functions.https.onRequest( async (request, response) => {
  // functions.logger.info("Hello logs!", {structuredData: true});
  

  // We execute an insertion inside the users collection of the object {name:'jesse'}
  const result = await firestore.collection('users').add({name:'Jesse'})

  // I return the result to the navigator
  response.send(result);
 });


 exports.post = functions.https.onRequest((request, response) => {
   // functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello i am a POST");
  });
 
