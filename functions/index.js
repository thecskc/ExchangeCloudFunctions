const functions = require('firebase-functions');
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
admin.initializeApp();

let SENDGRID_API_KEY = "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";
sgMail.setApiKey(SENDGRID_API_KEY);
console.log(SENDGRID_API_KEY);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const onConnectionsUpdate = functions.firestore.document("Connections/{id}").onWrite((change,context)=>{

    console.log(change.before.data());
    console.log(change.after.data());

    const coachID = change.after.data().coach;
    const userID = change.after.data().user;

    let coachProfile = {};
    let userProfile = {};

    admin.auth().getUser(coachID).then((doc)=>{
        coachProfile = doc;
        admin.auth().getUser(userID).then((doc)=>{
            userProfile = doc;

            const coachEmail = coachProfile.email;
            const userEmail = userProfile.email;
            console.log(coachEmail);
            console.log(userEmail);

            const msg = {
                to: [coachEmail,userEmail],
                from: 'krish@exchangetrain.com',
                cc:["krish@exchangetrain.com","daniel.hyun@exchangetrain.com"],
                replyTo:"krish@exchangetrain.com",
                subject: 'Your Connection Status Changed',
                templateId:'d-fa2eb45868cc4de187b2c8ceb8ee0a19'

            };
            sgMail.sendMultiple(msg).then(()=>null).catch(()=>null);

            return null;
        }).catch((err)=>console.log(err));

        return null;

    }).catch((err)=>console.log(err));


    return null;


});


exports.onConnectionsUpdate = onConnectionsUpdate;