/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
// حماية طلب شراء الجواهر
exports.buyGems = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    const username = data.username;
    const amount = data.amount;

    if(amount < 100) {
        throw new functions.https.HttpsError('invalid-argument', 'الحد الأدنى 100 جوهرة');
    }

    const now = new Date().toISOString();
    await db.ref("buyRequests").push({name: username, amount: amount, time: now});

    return {success: true, message: "✅ تم إرسال طلب الشراء وسيتم مراجعته"};
});

// حماية طلب السحب
exports.withdrawGems = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    const username = data.username;
    const gems = data.gems;
    const account = data.account;

    if(gems < 1000) {
        throw new functions.https.HttpsError('invalid-argument', 'يجب الوصول إلى 1000 جوهرة');
    }

    const now = new Date().toISOString();
    await db.ref("withdrawRequests").push({name: username, amount: gems, account: account, time: now});

    return {success: true, message: "✅ تم إرسال طلب السحب"};
}); * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
setGlobalOptions({ maxInstances: 10 });const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.database();

// حماية طلب شراء الجواهر
exports.buyGems = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    const username = data.username;
    const amount = data.amount;

    if(amount < 100) {
        throw new functions.https.HttpsError('invalid-argument', 'الحد الأدنى 100 جوهرة');
    }

    const now = new Date().toISOString();
    await db.ref("buyRequests").push({name: username, amount: amount, time: now});

    return {success: true, message: "✅ تم إرسال طلب الشراء وسيتم مراجعته"};
});

// حماية طلب السحب
exports.withdrawGems = functions.runWith({ maxInstances: 10 }).https.onCall(async (data, context) => {
    const username = data.username;
    const gems = data.gems;
    const account = data.account;

    if(gems < 1000) {
        throw new functions.https.HttpsError('invalid-argument', 'يجب الوصول إلى 1000 جوهرة');
    }

    const now = new Date().toISOString();
nano index.js
    await db.ref("withdrawRequests").push({name: username, amount: gems, account: account, time: now});

    return {success: true, message: "✅ تم إرسال طلب السحب"};
});

}); // <-- يغلق دالة withdrawGems بشكل صحيحo
