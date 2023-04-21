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
   console.log('body', body)

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

    // Create the chat Document in the chat collection
    const idOfDocument = generateChatId(myId, idOfPersonThatILike)

    await firestore.collection('chats').doc(idOfDocument).set({
      idsConcatenated: idOfDocument,
      arrayOfPeopleInConversation: [myId, idOfPersonThatILike]
    }, {merge:true})



    response.send("We like Each other successfully done");
  }

  if( type === 'breakMatch'){

    console.log('break match')
    // Get the data passed through the API CALL
    
    const myId = body.myId
    const idOfPersonThatIDontLike = body.idOfPersonThatIDontLike
    console.log('my id', myId)
    console.log('personIdonTLike', idOfPersonThatIDontLike)
    // Delete all the Chat
    const id = generateChatId(myId, idOfPersonThatIDontLike)
    console.log('id', id)
    const listMessageDocuments = await firestore.collection('chats').doc(id).collection('messages').listDocuments()
    console.log('list of message doc', listMessageDocuments)
    listMessageDocuments.forEach((eadhDoc)=>{
      eadhDoc.delete()
    })

    await firestore.collection('chats').doc(id).delete()


    // Delete the user from the "weLikeEachOther" subcollections in both places, in mine, and in the other person's subcollection

    const path1 = `users/${myId}/weLikeEachOther/${idOfPersonThatIDontLike}`
    const path2 = `users/${idOfPersonThatIDontLike}/weLikeEachOther/${myId}`

    // Perform the delete operations
    await firestore.doc(path1).delete()
    await firestore.doc(path2).delete()

    response.send('Deletion successfull')
  }





   response.send("Hello i am a POST");
  });


  const generateChatId = (id1, id2) =>{
    const array = [id1, id2]
    array.sort()
    return `${array[0]}-${array[1]}` 

  }
 
