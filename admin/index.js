const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://exchange-231906.firebaseio.com"
});


let db = admin.firestore();



function getUsersWithProfilesWithoutConnections(){

    const allUsers = db.collection("Profiles").get().then((snapshot)=>{
        snapshot.forEach(doc=>{
            const userID = doc.id;
            db.collection("Connections").where("user","==",userID).get().then(snapshot=>{
                if(snapshot.empty){
                    if(!doc.data().coachcode) {

                        admin.auth().getUser(userID).then(function(userRecord){
                            console.log(doc.data().displayName +" --- ",userRecord.email);
                            return true;

                        }).catch((err)=>err);

                    }
                }

                return true;
            }).catch((err)=>{console.log(err); return null;});

            return true;


        });

    }).catch((err)=>{console.log(err)});

}

/*
function getUsersSignedUpWithoutProfiles(){

    const pageToken = "token";

    function listAllUsers(pageToken) {
        admin.auth().listUsers(1000, pageToken)
            .then(function (listUsersResult) {
                listUsersResult.users.forEach(function (userRecord) {
                    console.log('user', userRecord.toJSON());
                });
                if (listUsersResult.pageToken) {
                    // List next batch of users.
                    listAllUsers(listUsersResult.pageToken);
                }

                return true;
            })
            .catch(function (error) {
                console.log('Error listing users:', error);
            });
    }


}
*/


getUsersWithProfilesWithoutConnections();