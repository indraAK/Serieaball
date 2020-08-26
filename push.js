const webPush = require('web-push');

const vapidKeys = {
   'publicKey': "BC-CBiM4CjDvh6Q2dsLOj1bsEsiYiKEgxXpB-izmNTYxrRa9k2PQkvJJkvHfQyZSInVJqkSShZCZGHen-w17IxU",
   'privateKey': '-lXPxGrVsLSy7aBSl8DT-G9I5D9FJr7kWrLSV1vCEm8'
};

webPush.setVapidDetails(
   'mailto:indra.kusumaadi7@gmail.com',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)

const pushSubscription = {
   'endpoint': 'https://fcm.googleapis.com/fcm/send/dMmw8H_Af6I:APA91bFPP0B0e76it9Ui-cWVrLV_SRWUXSnLraFTtl8LKIo0ywptuSqAkQDNbgqzKVKs5LpBrOQ1y9-0H4UWU0RcUGzmWCaH66_l74ivEVwIahSBPNdr67oFwjIjWwh8g_H7M0chePxQ',
   'keys': {
      'p256dh': 'BPlToROx0iR9hF7tIUfeUVn4f7lHoPU3wyzyHqc3uxCLVO8HYuaXmnGJzHxy8uF3rgnaQh/+BanGIpfqaPL/S1Y=',
      'auth': 'ja9hNAhrUYu/YkWJV/OgRQ=='
   }
}

const payload = 'Aplikasi Serieaball sudah dapat menerima push notifikasi';
const options = {
   gcmAPIKey: '839981808457',
   TTL: 60
};

webPush.sendNotification(
   pushSubscription,
   payload,
   options
);