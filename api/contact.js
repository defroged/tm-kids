export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject, message } = req.body;

    // Here you would send the email, for example using a service like SendGrid or Nodemailer
    // For simplicity, we will just log the message to the console

    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}