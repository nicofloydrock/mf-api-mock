import * as webPush from 'web-push';

export const configureVapid = () => {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const enabled = Boolean(publicKey && privateKey);
  if (enabled) {
    webPush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:dev@example.com',
      publicKey as string,
      privateKey as string,
    );
  }
  return { enabled };
};
