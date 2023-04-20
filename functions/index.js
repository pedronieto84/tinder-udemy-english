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


 exports.post = functions.https.onRequest( async (request, response) => {
   // functions.logger.info("Hello logs!", {structuredData: true});

   const body = request.body

   const type = body.type
   

  if( type === 'personLikesMe'){
    const myId = body.myId
    const idOfPersonThatILike = body.idOfPersonThatILike
    await firestore.collection('users').doc(idOfPersonThatILike).collection('theyLikeMe').doc(myId).set(
      {
        uid: myId,
        documentReference: firestore.collection('users').doc(myId)
    }
    ,{ merge: true})
    response.send("Successfull")
  }

  if( type === 'IDontLikeYou'){
    const myId = body.myId

    //idOfPersonThatIDontLike
    const idOfPersonThatIDontLike = body.idOfPersonThatIDontLike
    console.log('data', myId, idOfPersonThatIDontLike)
    await firestore.collection('users').doc(myId).collection('theyLikeMe').doc(idOfPersonThatIDontLike).delete()
    response.send("Successfully Deleted")
  }

  if (type === 'weLikeEachOther'){

    const myId = body.myId
    const idOfPersonThatILike = body.idOfPersonThatILike

    // I prepare the 2 objects
    //  otherPersonObject
    const otherPersonObject =  {
      uid: idOfPersonThatILike,
      documentReference: firestore.collection('users').doc(idOfPersonThatILike)
    }
    // My object

    const myObject =  {
      uid: myId,
      documentReference: firestore.collection('users').doc(myId)
    }

    // 2Inserts in weLikeEach other subcollection
    await firestore.collection('users').doc(idOfPersonThatILike).collection('weLikeEachOther').doc(myId).set( myObject ,{ merge: true})
    await firestore.collection('users').doc(myId).collection('weLikeEachOther').doc(idOfPersonThatILike).set( otherPersonObject ,{ merge: true})


    // Delete the document from my subcollection of "theyLikeMe"
    await firestore.collection('users').doc(myId).collection('theyLikeMe').doc(idOfPersonThatILike).delete()
    response.send("We like Each other successfully done");
  }



   response.send("Hello i am a POST");
  });
 
